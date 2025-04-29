import { CartRepository, CartWithItems } from "../repositories/cart.repository";
import { ProductRepository } from "../repositories/product.repository";
import { UserRepository } from "../repositories/user.repository";
import { Lock } from "../utils/lock";

interface AddToCartInput {
  userId: string;
  productId: string;
  quantity: number;
}

export class CartService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;
  private userRepository: UserRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
    this.userRepository = new UserRepository();
  }

  async getCart(userId: string): Promise<CartWithItems> {
    let cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      // Create new cart for user if it doesn't exist
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      await this.cartRepository.createForUser(userId);
      // Re-fetch with items included
      cart = await this.cartRepository.findByUserId(userId);
    }

    return cart!;
  }

  async addToCart({
    userId,
    productId,
    quantity,
  }: AddToCartInput): Promise<CartWithItems> {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    // Acquire a lock for this product to prevent race conditions
    return Lock.withLock(`product:${productId}`, async () => {
      // Check if product exists and has sufficient stock
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stockCount < quantity) {
        throw new Error("Insufficient stock");
      }

      // Get or create cart
      let cart = await this.getCart(userId);

      // Add item to cart
      await this.cartRepository.addItem(cart.id, productId, quantity);

      // Return updated cart
      return this.cartRepository.findByUserId(userId) as Promise<CartWithItems>;
    });
  }

  async updateCartItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartWithItems> {
    if (quantity <= 0) {
      // If quantity is zero or negative, remove item
      return this.removeFromCart(userId, productId);
    }

    return Lock.withLock(`product:${productId}`, async () => {
      // Check if product has sufficient stock
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stockCount < quantity) {
        throw new Error("Insufficient stock");
      }

      // Get cart
      const cart = await this.getCart(userId);

      // Update item quantity
      await this.cartRepository.updateItemQuantity(
        cart.id,
        productId,
        quantity
      );

      // Return updated cart
      return this.cartRepository.findByUserId(userId) as Promise<CartWithItems>;
    });
  }

  async removeFromCart(
    userId: string,
    productId: string
  ): Promise<CartWithItems> {
    const cart = await this.getCart(userId);

    // Check if item exists in cart
    const itemExists = cart.items.some((item) => item.productId === productId);
    if (!itemExists) {
      throw new Error("Item not found in cart");
    }

    // Remove item
    await this.cartRepository.removeItem(cart.id, productId);

    // Return updated cart
    return this.cartRepository.findByUserId(userId) as Promise<CartWithItems>;
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getCart(userId);
    await this.cartRepository.clearCart(cart.id);
  }
}
