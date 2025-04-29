import { redis } from '../config/redis';

export class Lock {
  // Acquire a distributed lock
  static async acquire(key: string, ttlInSeconds: number = 30): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const result = await redis.set(lockKey, '1', 'EX', ttlInSeconds, 'NX');
    return result === 'OK';
  }

  // Release a distributed lock
  static async release(key: string): Promise<void> {
    const lockKey = `lock:${key}`;
    await redis.del(lockKey);
  }

  // Execute a function with a distributed lock
  static async withLock<T>(
    key: string,
    fn: () => Promise<T>,
    ttlInSeconds: number = 30
  ): Promise<T> {
    const lockAcquired = await this.acquire(key, ttlInSeconds);
    
    if (!lockAcquired) {
      throw new Error(`Could not acquire lock for ${key}`);
    }
    
    try {
      return await fn();
    } finally {
      await this.release(key);
    }
  }
}