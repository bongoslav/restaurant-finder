import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import * as tokenService from "../services/tokenService";
import { AuthRequest } from "../types/AuthRequest";
import { ObjectId } from "mongodb";
import { AppError } from "../utils/errorHandler";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import setCookie from "../utils/setCookie";

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getCurrentUser(req.user.userId);

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
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, username, name } = req.body;
    const email = req.body.email.toLowerCase();

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
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const email = req.body.email.toLowerCase();

    const user = await authService.findByCredentials(email, password);
    const { accessToken, refreshToken } = await tokenService.generateTokens(
      user._id
    );

    setCookie(res, "refreshToken", refreshToken);

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError(400, "Refresh token not provided"));
    }

    const objectUserId = new ObjectId(req.user.userId);
    await tokenService.revokeRefreshToken(objectUserId, refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PROD",
      sameSite: process.env.NODE_ENV === "PROD" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
    next(error);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (req.user.userId !== userId) {
      return next(new AppError(403, "User can update only their own data"));
    }

    const { username, password, name } = req.body;
    const email = req.body.email.toLowerCase();

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
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new AppError(401, "Refresh token not provided"));
    }

    const result = await tokenService.refreshAccessToken(refreshToken);

    setCookie(res, "refreshToken", refreshToken);

    res.status(200).json({
      status: "success",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    res.clearCookie("refreshToken");

    if (error instanceof AppError) {
      return next(error);
    } else if (error instanceof JsonWebTokenError) {
      return next(new AppError(401, "Invalid refresh token"));
    } else if (error instanceof TokenExpiredError) {
      return next(new AppError(401, "Refresh token expired"));
    } else {
      return next(new AppError(500, `Error refreshing token: ${error.message}`));
    }
  }
};
