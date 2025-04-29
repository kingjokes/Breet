import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/user.service";
import { ApiResponse } from "../utils/response";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email } = req.body;

    if (!name || !email) {
      ApiResponse.error(
        res,
        "User Name and email are required",
        StatusCodes.BAD_REQUEST
      );
      return;
    }

    const checkUser = await this.userService.getUser(email);

    if (checkUser) {
      ApiResponse.error(
        res,
        "User with email are already exist",
        StatusCodes.BAD_REQUEST
      );

      return;
    }

    const user = await this.userService.createUser({
      name,
      email,
    });

    ApiResponse.success(
      res,
      user,
      "User created successfully",
      StatusCodes.CREATED
    );
  };
}
