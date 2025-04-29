import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const connectRedis = async (): Promise<void> => {
  try {
    redis.on('connect', () => {
      console.log('Connected to Redis');
    });
    
    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    process.exit(1);
  }
};