import app from "./app";
import { createServer } from "http";
import {
  connectDB,
  setupMongooseEvents,
  setupGracefulShutdown,
} from "./config/database";
import "dotenv/config";

const server = createServer(app);

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT) || 3000;

  const startServer = async () => {
    try {
      console.log("Starting server...");
      await connectDB();
      setupMongooseEvents();

      server.listen(port, () => {
        console.log(`Express is listening at http://localhost:${port}`);
      });

      setupGracefulShutdown(server);
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer().catch((error) => {
    console.error("Unhandled error during server startup:", error);
    process.exit(1);
  });
}

export default app;
