import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🔧 Compatibilidad ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const structure = {
  directories: [
    "src/domain",
    "src/application/user",
    "src/interfaces/controllers",
    "src/interfaces/mappers",
    "src/infrastructure/database/mongo",
    "src/infrastructure/webserver/express/routes",
    "src/infrastructure/webserver/middlewares",
    "src/config",
    "src/core",
    "src/tests/unit",
    "src/tests/integration",
    "public/uploads",
    "docs/api",
    "logs",
    "scripts",
  ],
  files: {
    "package.json": `{
  "name": "clean-architecture-api",
  "version": "1.0.0",
  "description": "API REST con Node.js, Express y Clean Architecture",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "express": "^4.18.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "mongoose": "^8.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.3.0"
  }
}`,

    ".gitignore": `node_modules/
.env
.DS_Store
logs/
coverage/
*.log`,

    ".env.example": `PORT=3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/clean-api
JWT_SECRET=your-secret-key`,

    "README.md": `# 🧱 Clean Architecture API

Estructura base para un proyecto Node.js + Express + MongoDB usando Arquitectura Limpia.

## 🚀 Instrucciones

1. Clona este repositorio o ejecuta el script de creación.
2. Instala dependencias:
   \`\`\`bash
   npm install
   \`\`\`
3. Copia el archivo .env.example a .env
4. Ejecuta el proyecto:
   \`\`\`bash
   npm run dev
   \`\`\`
`
  }
};

const additionalFiles = {
  "server.js": `import app from "./src/app.js";
import config from "./src/config/index.js";

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📊 Environment: \${config.env}\`);
});`,

  "src/app.js": `import express from "express";
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

export default app;`,

  "src/config/index.js": `import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET
};`,

  "src/config/database.js": `import mongoose from "mongoose";
import config from "./index.js";

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(config.dbUrl);
    console.log("🟢 MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}`,

  "src/core/AppError.js": `export default class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}`,

  "src/domain/userEntity.js": `export default class User {
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}`,

  "src/application/user/createUserUseCase.js": `export default class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) throw new Error("User already exists");

    return await this.userRepository.create(userData);
  }
}`,

  "src/infrastructure/database/mongo/userModel.js": `import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;`,

  "src/infrastructure/database/mongo/userRepository.js": `import UserModel from "./userModel.js";

export default class UserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async create(data) {
    const user = new UserModel(data);
    return user.save();
  }
}`,

  "src/interfaces/controllers/userController.js": `import CreateUserUseCase from "../../application/user/createUserUseCase.js";
import UserRepository from "../../infrastructure/database/mongo/userRepository.js";

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);

export async function createUser(req, res, next) {
  try {
    const user = await createUserUseCase.execute(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}`,

  "src/infrastructure/webserver/express/routes/userRoutes.js": `import express from "express";
import { createUser } from "../../../../interfaces/controllers/userController.js";

const router = express.Router();

router.post("/", createUser);

export default router;`
};

function createCleanArchitectureProject() {
  console.log("🏗️  Creando estructura Clean Architecture para Node + Express + MongoDB...\n");

  // Usar process.cwd() para crear en el directorio actual, no donde está el script
  const baseDir = process.cwd();

  // Crear carpetas
  structure.directories.forEach((dir) => {
    const dirPath = path.join(baseDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Carpeta creada: ${dir}`);
    }
  });

  // Crear archivos base
  Object.entries({ ...structure.files, ...additionalFiles }).forEach(([file, content]) => {
    const filePath = path.join(baseDir, file);
    const dir = path.dirname(filePath);
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Solo crear el archivo si no existe
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
      console.log(`📄 Archivo creado: ${file}`);
    } else {
      console.log(`⏭️  Archivo ya existe: ${file}`);
    }
  });

  console.log("\n✅ Estructura generada con éxito.");
  console.log("\n📋 Próximos pasos:");
  console.log("1️⃣ Ejecuta: npm install");
  console.log("2️⃣ Copia .env.example a .env");
  console.log("3️⃣ Ejecuta: npm run dev");
  console.log("\n🧠 Arquitectura Limpia activada. ¡A construir APIs escalables!");
}

// 🧩 **CORRECCIÓN: Detectar ejecución directa en ESM**
// En ES Modules, process.argv[1] contiene la ruta del script ejecutado
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMainModule) {
  createCleanArchitectureProject();
}

export default createCleanArchitectureProject;