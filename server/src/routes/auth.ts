import express from "express";
import {
  getCurrentUser,
  getUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  updateUser,
} from "../controllers/auth";
import { isLoggedIn } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { loginUserSchema, registerUserSchema } from "../validations/schemas";

const router = express();

router.get("/me", isLoggedIn, getCurrentUser);
router.post("/register", validateRequest(registerUserSchema), registerUser);
router.post("/login", validateRequest(loginUserSchema), loginUser);
router.post("/logout", isLoggedIn, logoutUser);
router.post("/refresh-token", refreshToken);

router.get("/users/:userId", isLoggedIn, getUser);
router.put("/users/:userId", isLoggedIn, updateUser);

export default router;
