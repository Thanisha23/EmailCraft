import mongoose from "mongoose";
import env from "../utils/validateEnv";

mongoose.connect(env.DATABASE_URL);

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to database");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});







