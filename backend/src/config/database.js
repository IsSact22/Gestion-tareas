import mongoose from "mongoose";
import prisma from "../infrastructure/database/prisma/client.js";
import config from "./index.js";

const DB_TYPE = process.env.DB_TYPE || 'mongodb';

/**
 * Conectar a la base de datos según DB_TYPE
 * - mongodb: Usa Mongoose
 * - postgres: Usa Prisma
 */
export default async function connectDB() {
  try {
    if (DB_TYPE === 'postgres') {
      // Conectar a PostgreSQL con Prisma
      await prisma.$connect();
      console.log("🟢 PostgreSQL Connected successfully");
      console.log("✅ Database connection verified");
    } else {
      // Conectar a MongoDB con Mongoose
      const conn = await mongoose.connect(config.dbUrl);
      console.log("🟢 MongoDB Connected:", conn.connection.host);
    }
  } catch (error) {
    console.error(`🔴 ${DB_TYPE.toUpperCase()} Connection Error:`, error.message);
    process.exit(1);
  }
}

/**
 * Desconectar de la base de datos
 */
export async function disconnectDB() {
  try {
    if (DB_TYPE === 'postgres') {
      await prisma.$disconnect();
      console.log("🔌 PostgreSQL Disconnected");
    } else {
      await mongoose.disconnect();
      console.log("🔌 MongoDB Disconnected");
    }
  } catch (error) {
    console.error(`Error disconnecting from ${DB_TYPE}:`, error.message);
  }
}