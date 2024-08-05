import app from "./app";
import { createServer } from "http";
import {
  connectDB,
  setupMongooseEvents,
  setupGracefulShutdown,
} from "./config/database";
import "dotenv/config";

const server = createServer(app);

const { PORT, NODE_ENV, CLIENT_DEV_URL, CLIENT_PROD_URL } = process.env;

const startServer = async () => {
  try {
    console.log(`Starting server in ${NODE_ENV} mode...`);
    await connectDB();
    setupMongooseEvents();

    if (NODE_ENV === "DEV") {
      const port = Number(PORT) || 3000;
      server.listen(port, () => {
        console.log(`Express is listening at http://localhost:${port}`);
        console.log(`CORS is set to accept requests from: ${CLIENT_DEV_URL}`);
      });
    } else {
      server.listen(() => {
        console.log("Server is running in production mode");
        console.log(`CORS is set to accept requests from: ${CLIENT_PROD_URL}`);
      });
    }

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

export default app;
