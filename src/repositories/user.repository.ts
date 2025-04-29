// src/repositories/user.repository.ts
import { User } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { prisma } from "../config/database";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  async findWithCart(id: string): Promise<User | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: any): Promise<User> {
    return this.model.create({
      data,
    });
  }

  
}
