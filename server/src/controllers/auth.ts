import { Request, Response } from "express";
import * as authService from "../services/authService";
import * as tokenService from "../services/tokenService";
import { AuthRequest } from "../types/AuthRequest";
import { ObjectId } from "mongodb";

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.user.userId);

    res.status(200).json({
      status: "success",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user data" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username, name } = req.body;

    const newUser = await authService.registerUser({
      email,
      password,
      username,
      name,
    });

    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    console.error("Error in register user:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while registering a user",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    const user = await authService.findByCredentials(email, password);
    const { accessToken, refreshToken } = await tokenService.generateTokens(
      user._id
    );

    // set refresh token as an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);

    res.status(400).json({
      status: "error",
      message: "Invalid login credentials",
    });
  }
};

export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "No refresh token provided",
      });
    }

    const objectUserId = new ObjectId(req.user.userId);
    await tokenService.revokeRefreshToken(objectUserId, refreshToken);

    res.clearCookie("refreshToken");

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in logoutUser:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred during logout",
    });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await authService.getUserById(userId);

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error("Error in getUser:", error.message);

    if (error.message === "User not found") {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching user data",
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, email, password, name } = req.body;

    if (userId !== req.user.userId) {
      return res.status(403).json({
        status: "error",
        message: "You can only update your own user data",
      });
    }

    const updatedUser = await authService.updateUser(userId, {
      username,
      email,
      password,
      name,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          name: updatedUser.name,
        },
      },
    });
  } catch (error) {
    console.error("Error in updateUser:", error.message);

    if (error.message.includes("Validation error")) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    if (error.message === "User not found") {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (
      error.message === "Username is already taken" ||
      error.message === "Email is already in use"
    ) {
      return res.status(409).json({
        status: "error",
        message: error.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "An error occurred while updating user data",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: "error",
        message: "Refresh token is missing",
      });
    }

    const result = await tokenService.refreshAccessToken(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: "success",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    console.error("Error in refreshToken:", error.message);

    if (error.message === "Invalid refresh token") {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired refresh token",
      });
    }

    res.status(500).json({
      status: "error",
      message: "An error occurred while refreshing the token",
    });
  }
};
