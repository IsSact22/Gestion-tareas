import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",
  dbType: process.env.DB_TYPE || 'mongodb',

  
  dbUrl: process.env.DB_URL, // MongoDB URL
  databaseUrl: process.env.DATABASE_URL, // PostgreSQL URL (Prisma)


  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
};