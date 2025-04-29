import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class ApiResponse {
  static success(res: Response, data: any, message = 'Success', statusCode = StatusCodes.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message = 'Something went wrong',
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    errors = null
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}