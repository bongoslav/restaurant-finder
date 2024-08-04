import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { handleJoiValidationError } from "../utils/errorHandler";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      handleJoiValidationError(error);
    }

    next();
  };
};
