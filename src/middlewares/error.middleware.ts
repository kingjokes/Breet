import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/response";

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  const message = err.message || "Something went wrong";
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  ApiResponse.error(res, message, statusCode);
};
