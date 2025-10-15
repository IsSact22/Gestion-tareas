import mongoose from "mongoose";
import config from "./index.js";

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(config.dbUrl);
    console.log("🟢 MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}