import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/response";
import { CartService } from "../services/cart.service";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  getCart = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const cart = await this.cartService.getCart(userId);
    ApiResponse.success(res, cart);
  };

  addToCart = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      ApiResponse.error(
        res,
        "Product ID and quantity are required",
        StatusCodes.BAD_REQUEST
      );
      return;
    }

    try {
      const cart = await this.cartService.addToCart({
        userId,
        productId,
        quantity: parseInt(quantity),
      });

      ApiResponse.success(res, cart, "Item added to cart successfully");
    } catch (error: any) {
      ApiResponse.error(res, error.message, StatusCodes.BAD_REQUEST);
    }
  };

  updateCartItem = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      ApiResponse.error(res, "Quantity is required", StatusCodes.BAD_REQUEST);
      return;
    }

    try {
      const cart = await this.cartService.updateCartItem(
        userId,
        productId,
        parseInt(quantity)
      );

      ApiResponse.success(res, cart, "Cart item updated successfully");
    } catch (error: any) {
      ApiResponse.error(res, error.message, StatusCodes.BAD_REQUEST);
    }
  };

  removeFromCart = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { productId } = req.params;

    try {
      const cart = await this.cartService.removeFromCart(userId, productId);
      ApiResponse.success(res, cart, "Item removed from cart successfully");
    } catch (error: any) {
      ApiResponse.error(res, error.message, StatusCodes.BAD_REQUEST);
    }
  };

  clearCart = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    await this.cartService.clearCart(userId);
    ApiResponse.success(res, null, "Cart cleared successfully");
  };
}
