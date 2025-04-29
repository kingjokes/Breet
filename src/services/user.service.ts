import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(
    data: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    return this.userRepository.create(data);
  }

  async getUser(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
