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

const router = express();

router.get("/me", isLoggedIn, getCurrentUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isLoggedIn, logoutUser);
router.post("/refresh-token", refreshToken);

router.get("/users/:userId", isLoggedIn, getUser);
router.put("/users/:userId", isLoggedIn, updateUser);

export default router;
