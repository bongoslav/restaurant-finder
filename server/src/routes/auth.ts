import express from "express"
import { getUsers, login, register } from "../controllers/auth";
import { isLoggedIn } from "../middlewares/loggedIn";

const router = express();

router.get("/api/v1/users", isLoggedIn, getUsers);
router.post("/api/v1/login", login);
router.post("/api/v1/register", register);

export default router;