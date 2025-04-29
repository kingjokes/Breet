import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ProductService } from "../services/product.service";
import { ApiResponse } from "../utils/response";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    const products = await this.productService.getAllProducts();
    ApiResponse.success(res, products);
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);

    if (!product) {
      ApiResponse.error(res, "Product not found", StatusCodes.NOT_FOUND);
      return;
    }

    ApiResponse.success(res, product);
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, stockCount } = req.body;

    if (!name || !price || !stockCount) {
      ApiResponse.error(
        res,
        "Name, price, and stock count are required",
        StatusCodes.BAD_REQUEST
      );
      return;
    }

    const product = await this.productService.createProduct({
      name,
      description,
      price: parseFloat(price),
      stockCount: parseInt(stockCount),
    });

    ApiResponse.success(
      res,
      product,
      "Product created successfully",
      StatusCodes.CREATED
    );
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, price, stockCount } = req.body;

    const product = await this.productService.updateProduct(id, {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      stockCount: stockCount ? parseInt(stockCount) : undefined,
    });

    ApiResponse.success(res, product, "Product updated successfully");
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);
      ApiResponse.success(res, null, "Product deleted successfully");
    } catch (error: any) {
      ApiResponse.error(res, error.message, StatusCodes.BAD_REQUEST);
    }
  };
}
