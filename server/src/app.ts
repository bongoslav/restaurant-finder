import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import restaurantRoutes from "./routes/restaurants";
import reviewRoutes from "./routes/reviews";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler";
import limiter from "./middlewares/rateLimit";

const app = express();

const { NODE_ENV, CLIENT_PROD_URL, CLIENT_DEV_URL } = process.env;

// middlewares
app.use(limiter);
app.use(cookieParser());
app.use(
  cors({
    origin: NODE_ENV === "PROD" ? CLIENT_PROD_URL : CLIENT_DEV_URL,
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV === "DEV") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/restaurants", reviewRoutes);
app.use("/api/v1/auth", authRoutes);

// error handling middleware
app.use(errorHandler);

export default app;
