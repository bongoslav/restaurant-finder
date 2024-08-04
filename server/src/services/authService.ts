import { ObjectId } from "mongodb";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { AppError, handleJoiValidationError } from "../utils/errorHandler";

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

export const getCurrentUser = async (userId: string) => {
  const objectUserId = new ObjectId(userId);

  const user = await User.findById(objectUserId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

export const registerUser = async (userData: RegisterUserData) => {
  const { email, password, username, name } = userData;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError(409, "Email already taken");
    } else {
      throw new AppError(409, "Username already taken");
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
      handleJoiValidationError(error);
    }
    throw new AppError(500, "Failed to register user");
  }

  const userObject = newUser.toObject();
  delete userObject.password;
  return userObject;
};

export const findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(400, "Invalid login credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(400, "Invalid login credentials");
  }

  return user;
};

export const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

export const updateUser = async (
  userId: string,
  updateData: UpdateUserData
) => {
  const objectUserId = new ObjectId(userId);

  const user = await User.findById(objectUserId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (updateData.username) {
    const existingUser = await User.findOne({ username: updateData.username });
    if (existingUser && existingUser._id !== objectUserId) {
      throw new AppError(409, "Username is already taken");
    }
    user.username = updateData.username;
  }

  if (updateData.email) {
    const existingUser = await User.findOne({ email: updateData.email });
    if (existingUser && existingUser._id !== objectUserId) {
      throw new AppError(409, "Email is already in use");
    }
    user.email = updateData.email;
  }

  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(updateData.password, salt);
  }

  if (updateData.name) {
    user.name = updateData.name;
  }

  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;
  return updatedUser;
};
