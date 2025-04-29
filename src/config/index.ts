import { connectDB } from "./database";
import { connectRedis } from "./redis";

export const initializeConnections = async (): Promise<void> => {
  await connectDB();
  await connectRedis();
};
