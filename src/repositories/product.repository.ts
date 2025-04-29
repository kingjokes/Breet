import { Product } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { Cache } from "../utils/cache";
import { prisma } from "../config/database";

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(prisma.product);
  }

  async findAllWithCache(): Promise<Product[]> {
    const cacheKey = "products:all";

    // Try from cache first
    const cachedProducts = await Cache.get<Product[]>(cacheKey);
    if (cachedProducts?.length) return cachedProducts;

    // If not in cache, get from database
    const products = await this.findAll();

    // Save to cache (10 minutes)
    await Cache.set(cacheKey, products, 600);

    return products;
  }

  async findByIdWithCache(id: string): Promise<Product | null> {
    const cacheKey = `product:${id}`;

    // Try from cache first
    const cachedProduct = await Cache.get<Product>(cacheKey);
    if (cachedProduct) return cachedProduct;

    // If not in cache, get from database
    const product = await this.findById(id);
    if (!product) return null;

    // Save to cache (10 minutes)
    await Cache.set(cacheKey, product, 600);

    return product;
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const result = await this.model.update({
      where: { id },
      data: {
        stockCount: {
          decrement: quantity,
        },
      },
    });

    // Invalidate cache
    await Cache.delete(`product:${id}`);
    await Cache.deletePattern("products:*");

    return result;
  }

  async checkStock(id: string, quantity: number): Promise<boolean> {
    const product = await this.findById(id);
    return product !== null && product.stockCount >= quantity;
  }
}
