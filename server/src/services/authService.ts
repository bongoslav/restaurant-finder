import { ObjectId } from "mongodb";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import Joi from "joi";

interface RegisterUserData {
  email: string;
  password: string;
  username: string;
  name?: string;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  name?: string;
}
const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(3).max(30).required(),
  name: Joi.string().min(2).max(50),
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  name: Joi.string().min(2).max(50),
});

export const getCurrentUser = async (userId: string) => {
  const objectUserId = new ObjectId(userId);

  const user = await User.findById(objectUserId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const registerUser = async (userData: RegisterUserData) => {
  const { error, value } = registerUserSchema.validate(userData);
  if (error) {
    throw new Error(`Validation error: ${error.details[0].message}`);
  }

  const { email, password, username, name } = value;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already in use");
    } else {
      throw new Error("Username already taken");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    username,
    name,
  });

  try {
    await newUser.save();
  } catch (error) {
    console.error("Error registering user", error);
    if (error.name === "ValidationError") {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw new Error("Failed to register user");
  }

  const userObject = newUser.toObject();
  delete userObject.password;
  return userObject;
};

export const findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid login credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid login credentials");
  }

  return user;
};

export const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateUser = async (
  userId: string,
  updateData: UpdateUserData
) => {
  const objectUserId = new ObjectId(userId);

  const { error, value } = updateUserSchema.validate(updateData);
  if (error) {
    throw new Error(`Validation error: ${error.details[0].message}`);
  }

  const user = await User.findById(objectUserId);
  if (!user) {
    throw new Error("User not found");
  }

  if (value.username) {
    const existingUser = await User.findOne({ username: value.username });
    if (existingUser && existingUser._id !== objectUserId) {
      throw new Error("Username is already taken");
    }
    user.username = value.username;
  }

  if (value.email) {
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser && existingUser._id !== objectUserId) {
      throw new Error("Email is already in use");
    }
    user.email = value.email;
  }

  if (value.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(value.password, salt);
  }

  if (value.name) {
    user.name = value.name;
  }

  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;
  return updatedUser;
};
