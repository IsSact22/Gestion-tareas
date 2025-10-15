const fs = require('fs');
const path = require('path');

const structure = {
  directories: [
    'src/controllers',
    'src/models',
    'src/routes',
    'src/middleware',
    'src/config',
    'src/utils',
    'src/services',
    'src/tests/unit',
    'src/tests/integration',
    'public/uploads',
    'docs/api',
    'logs',
    'scripts'
  ],
  files: {
    'app.js': `const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', require('./src/routes/health'));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error' 
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route Not Found' 
  });
});

module.exports = app;`,

    'server.js': `const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📊 Environment: \${process.env.NODE_ENV}\`);
});`,

    'package.json': `{
  "name": "mi-proyecto-api",
  "version": "1.0.0",
  "description": "API REST con Node.js y Express",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "keywords": ["api", "express", "nodejs"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0",
    "jest": "^29.0.0"
  }
}`,

    '.env.example': `PORT=3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/mi-db
JWT_SECRET=your-super-secret-key-here`,

    '.gitignore': `node_modules/
.env
.DS_Store
logs/
*.log
coverage/
.nyc_output/`,

    'README.md': `# Mi Proyecto API

## Descripción
API REST desarrollada con Node.js y Express

## Instalación
\`\`\`bash
npm install
\`\`\`

## Desarrollo
\`\`\`bash
npm run dev
\`\`\`

## Producción
\`\`\`bash
npm start
\`\`\`

## Estructura del Proyecto
...`
  }
};

function createProjectStructure() {
  console.log('🏗️  Creando estructura del proyecto...\\n');

  // Crear directorios
  structure.directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log('📁 Creando: \${dir}');
      
      // Crear archivos .gitkeep en directorios vacíos
      const gitkeepPath = path.join(dirPath, '.gitkeep');
      fs.writeFileSync(gitkeepPath, '');
    }
  });

  // Crear archivos básicos
  Object.entries(structure.files).forEach(([filename, content]) => {
    const filePath = path.join(process.cwd(), filename);
    
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
      console.log('📄 Creando: \${filename}')
    };
  });

  // Crear archivos adicionales para la estructura
  const additionalFiles = {
    'src/routes/health.js': `const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

module.exports = router;`,

    'src/config/database.js': `// Configuración de base de datos
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB Connected: \${conn.connection.host}\');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;`
  };

  Object.entries(additionalFiles).forEach(([filename, content]) => {
    const filePath = path.join(process.cwd(), filename);
    const dir = path.dirname(filePath);
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
      console.log('📄 Creando: \${filename}');
    }
  });

  console.log('\\n🎉 ¡Estructura del proyecto creada exitosamente!');
  console.log('\\n📋 Próximos pasos:');
  console.log('1. Ejecuta: npm install');
  console.log('2. Copia .env.example a .env');
  console.log('3. Configura tus variables de entorno');
  console.log('4. Ejecuta: npm run dev');
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  createProjectStructure();
}

module.exports = createProjectStructure;