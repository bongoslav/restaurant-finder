import { Request, Response, NextFunction } from "express";
import Joi, { ValidationErrorItem } from "joi";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: ValidationErrorItem[]
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
      details: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

export const handleJoiValidationError = (
  error: Joi.ValidationError
): AppError => {
  return new AppError(400, "Validation Error", error.details);
};
