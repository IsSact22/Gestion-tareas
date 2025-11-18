import prisma from "../infrastructure/database/prisma/client.js";

/**
 * Conectar a PostgreSQL con Prisma
 */
export default async function connectDB() {
  try {
    await prisma.$connect();
    console.log("🟢 PostgreSQL Connected successfully");
    console.log("✅ Database connection verified");
  } catch (error) {
    console.error("🔴 PostgreSQL Connection Error:", error.message);
    process.exit(1);
  }
}

/**
 * Desconectar de PostgreSQL
 */
export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log("🔌 PostgreSQL Disconnected");
  } catch (error) {
    console.error("Error disconnecting from PostgreSQL:", error.message);
  }
}