import express from "express"
import { getCurrentUser, getUsers, login, refreshToken, register, revokeRefreshToken } from "../controllers/auth";
import { isLoggedIn } from "../middlewares/loggedIn";

const router = express();

router.get("/api/v1/users", isLoggedIn, getUsers);
router.get("/api/v1/me", isLoggedIn, getCurrentUser);
router.post("/api/v1/login", login);
router.post("/api/v1/register", register);
router.post("/api/v1/refresh-token", refreshToken)
router.post("/api/v1/revoke", isLoggedIn, revokeRefreshToken)

export default router;