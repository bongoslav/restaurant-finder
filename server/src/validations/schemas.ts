import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(3).max(30).required(),
  name: Joi.string().min(2).max(50),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  name: Joi.string().min(2).max(50).optional(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createRestaurantSchema = Joi.object({
  name: Joi.string().required().max(100),
  location: Joi.string().required(),
  priceRange: Joi.number().required().min(1).max(5),
  cuisine: Joi.string().required(),
  hours: Joi.array().items(Joi.string()).required(),
});

export const addReviewSchema = Joi.object({
  title: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5),
  text: Joi.string().required().max(1000),
});
