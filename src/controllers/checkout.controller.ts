import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CheckoutService } from "../services/checkout.service";
import { ApiResponse } from "../utils/response";

export class CheckoutController {
  private checkoutService: CheckoutService;

  constructor() {
    this.checkoutService = new CheckoutService();
  }

  checkout = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    try {
      const order = await this.checkoutService.checkout(userId);
      ApiResponse.success(
        res,
        order,
        "Checkout completed successfully",
        StatusCodes.CREATED
      );
    } catch (error: any) {
      ApiResponse.error(res, error.message, StatusCodes.BAD_REQUEST);
    }
  };

  getOrder = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const order = await this.checkoutService.getOrder(id);

    if (!order) {
      ApiResponse.error(res, "Order not found", StatusCodes.NOT_FOUND);
      return;
    }

    ApiResponse.success(res, order);
  };

  getUserOrders = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const orders = await this.checkoutService.getUserOrders(userId);
    ApiResponse.success(res, orders);
  };
}