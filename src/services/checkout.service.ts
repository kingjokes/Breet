import { prisma } from "../config/database";
import { Order, OrderItem } from "@prisma/client";
import { CartService } from "./cart.service";
import { ProductRepository } from "../repositories/product.repository";
import { Lock } from "../utils/lock";

export class CheckoutService {
  private cartService: CartService;
  private productRepository: ProductRepository;

  constructor() {
    this.cartService = new CartService();
    this.productRepository = new ProductRepository();
  }

  async checkout(userId: string): Promise<Order> {
    // Get cart with items
    const cart = await this.cartService.getCart(userId);

    // Validate cart has items
    if (cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    return prisma.$transaction(async (tx) => {
      // Lock to prevent race conditions during checkout
      const lockPromises = cart.items.map((item) =>
        Lock.acquire(`product:${item.productId}`)
      );

      const lockResults = await Promise.all(lockPromises);

      // Check if all locks were acquired
      if (lockResults.some((result) => !result)) {
        throw new Error("Failed to acquire locks for checkout");
      }

      try {
        // Verify stock availability for all items
        for (const item of cart.items) {
          const hasStock = await this.productRepository.checkStock(
            item.productId,
            item.quantity
          );

          if (!hasStock) {
            throw new Error(
              `Insufficient stock for product: ${item.product.name}`
            );
          }
        }

        // Calculate total price
        const total = cart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        // Create order
        const order = await tx.order.create({
          data: {
            userId,
            total,
            items: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
              })),
            },
            status: "COMPLETED",
          },
          include: {
            items: true,
          },
        });

        // Update stock for each product
        for (const item of cart.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockCount: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Clear cart after successful checkout
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return order;
      } finally {
        // Release all locks
        for (const item of cart.items) {
          await Lock.release(`product:${item.productId}`);
        }
      }
    });
  }

  async getOrder(orderId: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
