import mongoose from "mongoose";
import env from "../utils/validateEnv";

const connectionOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: "majority" as const,
};

const connectToDatabase = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL, connectionOptions);
    console.log("Mongoose connected to database");
  } catch (error) {
    console.error("MongoDB initial connection error:", error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connection established");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to application termination");
  process.exit(0);
});

connectToDatabase();

export default mongoose;
