
import { Cart, CartItem } from '@prisma/client';
import { prisma } from '../config/database';
import { BaseRepository } from './base.repository';

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: {
      id: string;
      name: string;
      price: number;
      stockCount: number;
    };
  })[];
};

export class CartRepository extends BaseRepository<Cart> {
  constructor() {
    super(prisma.cart);
  }
  
  async findByUserId(userId: string): Promise<CartWithItems | null> {
    return this.model.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }
  
  async createForUser(userId: string): Promise<Cart> {
    return this.model.create({
      data: {
        userId,
        items: {
          create: []
        }
      }
    });
  }
  
  async addItem(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    // First check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId
        }
      }
    });
    
    if (existingItem) {
      // Update quantity of existing item
      return prisma.cartItem.update({
        where: {
          id: existingItem.id
        },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });
    } else {
      // Create new cart item
      return prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity
        }
      });
    }
  }
  
  async updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    return prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId,
          productId
        }
      },
      data: {
        quantity
      }
    });
  }
  
  async removeItem(cartId: string, productId: string): Promise<void> {
    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId
        }
      }
    });
  }
  
  async clearCart(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: {
        cartId
      }
    });
  }
}
