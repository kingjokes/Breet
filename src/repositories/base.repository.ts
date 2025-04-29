import { PrismaClient } from "@prisma/client";
import { prisma } from "../config/database";

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(model: any) {
    this.prisma = prisma;
    this.model = model;
  }

  async findAll(options: any = {}): Promise<T[]> {
    return this.model.findMany(options);
  }

  async findById(id: string, options: any = {}): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      ...options,
    });
  }

  async create(data: any): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }
}
