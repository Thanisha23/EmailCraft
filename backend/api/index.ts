import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "../src/utils/validateEnv";
import rootRouter from "../src/routes";
import connectDB from "../src/db";
import { getAgenda, gracefulShutdown } from "../src/services/agendaService";
import { initHealthChecks } from "../src/services/healthCheckService";

const app = express();

app.use(
  cors({
    origin: ["https://emailcraft.thanisha.tech", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running");
});

app.use("/api/v1", rootRouter);

const startServer = async () => {
  try {
    await connectDB();

    await getAgenda();
    initHealthChecks();
    console.log("Email scheduling service initialized");

    const PORT = env.PORT || 8080;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });

    const shutdownHandler = async () => {
      console.log("Shutting down server gracefully...");

      server.close(async () => {
        await gracefulShutdown();
        console.log("Server shutdown complete");
        process.exit(0);
      });

      setTimeout(() => {
        console.error(
          "Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", shutdownHandler);
    process.on("SIGINT", shutdownHandler);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
