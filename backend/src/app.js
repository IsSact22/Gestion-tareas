import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import config from "./config/index.js";
import connectDB from "./config/database.js";
import swaggerSpec from "./config/swagger.js";

// Importar rutas
import authRoutes from "./infrastructure/webserver/express/routes/authRoutes.js";
import userRoutes from "./infrastructure/webserver/express/routes/userRoutes.js";
import workspaceRoutes from "./infrastructure/webserver/express/routes/workspaceRoutes.js";
import boardRoutes from "./infrastructure/webserver/express/routes/boardRoutes.js";
import columnRoutes from "./infrastructure/webserver/express/routes/columnRoutes.js";
import taskRoutes from "./infrastructure/webserver/express/routes/taskRoutes.js";
import activityRoutes from "./infrastructure/webserver/express/routes/activityRoutes.js";
import notificationRoutes from "./infrastructure/webserver/express/routes/notificationRoutes.js";

const app = express();

// 🧱 Middlewares base
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📚 Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AuraTask API Documentation',
  customfavIcon: '/favicon.ico',
}));

// Ruta para obtener el spec en JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 📦 Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications", notificationRoutes);

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