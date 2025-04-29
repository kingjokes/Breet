// src/services/product.service.ts
import { Product } from "@prisma/client";
import { ProductRepository } from "../repositories/product.repository";
 

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAllWithCache();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findByIdWithCache(id);
  }

  async createProduct(
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    return this.productRepository.create(data);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string): Promise<Product> {
    return this.productRepository.delete(id);
  }
}
