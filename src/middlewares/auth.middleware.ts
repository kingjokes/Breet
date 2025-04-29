import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/response";
import { UserRepository } from "../repositories/user.repository";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

const userService = new UserRepository();
// In production, we can JWT
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  
  // For this purpose, I am just using  user email from header
  const userEmail = req.header("X-User-Email");

  if (!userEmail) {
    ApiResponse.error(
      res,
      "Unauthorized - Missing user email",
      StatusCodes.UNAUTHORIZED
    );
    return;
  }

  const user = await userService.findByEmail(userEmail);

  if (!user) {
    ApiResponse.error(res, "Unauthorized", StatusCodes.UNAUTHORIZED);
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
  };

  next();
};
