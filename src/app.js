import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import config from "./config/index.js";
import connectDB from "./config/database.js";
import userRoutes from "./infrastructure/webserver/express/routes/userRoutes.js";

const app = express();

// 🧱 Middlewares base
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// 📦 Rutas principales
app.use("/api/users", userRoutes);

// 🌐 Ruta de salud
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is healthy", env: config.env });
});

// 🧨 Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

await connectDB();

export default app;