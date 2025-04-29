import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
