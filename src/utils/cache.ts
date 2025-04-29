import { redis } from "../config/redis";

export class Cache {
  // Get data from cache
  static async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error("Error parsing cached data:", error);
      return null;
    }
  }

  // Set data to cache with optional expiration
  static async set(
    key: string,
    data: any,
    expiryInSeconds?: number
  ): Promise<void> {
    const jsonData = JSON.stringify(data);

    if (expiryInSeconds) {
      await redis.setex(key, expiryInSeconds, jsonData);
    } else {
      await redis.set(key, jsonData);
    }
  }

  // Delete from cache
  static async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  // Delete using pattern
  static async deletePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
}
