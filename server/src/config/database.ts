import mongoose from "mongoose";
import { Server } from "http";
import "dotenv/config";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    process.exit(1);
  }
};

const setupMongooseEvents = (): void => {
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
};

const setupGracefulShutdown = (server: Server): void => {
  const shutdown = async () => {
    console.log("Received kill signal, shutting down gracefully");
    server.close(() => {
      console.log("Closed out remaining connections");
      disconnectDB().then(() => process.exit(0));
    });

    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

export { connectDB, setupMongooseEvents, setupGracefulShutdown };
