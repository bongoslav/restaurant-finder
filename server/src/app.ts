import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import restaurantRoutes from "./routes/restaurants";

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use(restaurantRoutes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
