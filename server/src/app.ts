import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import restaurantRoutes from "./routes/restaurants";
import multer from "multer";

const app = express();

// middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// routes
app.use(restaurantRoutes);

// error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req, res, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        err_code: err.code,
        err_message: `File size limit of ${process.env.MAX_PHOTO_SIZE.slice(0, 1)}mb exceeded`,
      });
    } else {
      return res.status(400).json({
        err_code: err.code,
        err_message: err.message,
      });
    }
  } else {
    return res.status(500).json({
      err_code: "",
      message: "Something went wrong!"
    })
  }
})

export default app