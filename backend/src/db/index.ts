import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.DATABASE_URL;
    if (!mongoURI) {
      throw new Error("MongoURI environment variable is not defined");
    }

    const connection = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error: Error | any) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error connecting to MongoDB: ${errorMessage}`);
    console.error(
      error instanceof Error ? error.stack : "No stack trace available"
    );
    process.exit(1);
  }
};

export default connectDB;





