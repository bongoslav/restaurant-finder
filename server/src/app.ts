import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import restaurantRoutes from "./routes/restaurants";
import reviewRoutes from "./routes/reviews";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler";

const app = express();

// middlewares
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/restaurants", reviewRoutes);
app.use("/api/v1/auth", authRoutes);

// error handling middleware
app.use(errorHandler);

export default app;
