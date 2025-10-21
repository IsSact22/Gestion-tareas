# 🎯 Sistema Kanban - Backend

API REST con Node.js, Express, MongoDB y Clean Architecture.

## 🚀 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

Luego edita el archivo `.env` con tus valores:

```env
PORT=5000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/kanban-db
JWT_SECRET=tu-clave-secreta-super-segura-cambiala-en-produccion
JWT_EXPIRE=7d

# Cloudinary (opcional para subir imágenes)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Asegúrate de tener MongoDB corriendo

**Opción A: MongoDB Local**
```bash
# Inicia MongoDB
mongod
```

**Opción B: MongoDB Atlas (Cloud)**
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Obtén la connection string
4. Actualiza `DB_URL` en `.env`:
```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/kanban-db?retryWrites=true&w=majority
```

### 4. Ejecutar el servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará corriendo en `http://localhost:5000`

---

## 📁 Estructura del Proyecto

```
backend/src/
├── application/          # Use Cases (Lógica de negocio)
│   ├── auth/            # Autenticación
│   ├── workspace/       # Espacios de trabajo
│   ├── board/           # Tableros
│   ├── column/          # Columnas
│   ├── task/            # Tareas
│   └── activity/        # Actividades
├── config/              # Configuración
│   ├── database.js      # Conexión MongoDB
│   └── index.js         # Variables de entorno
├── core/                # Utilidades y errores
│   ├── AppError.js      # Errores personalizados
│   └── jwtUtils.js      # JWT helpers
├── domain/              # Entidades (Modelos de dominio)
│   ├── userEntity.js
│   ├── workspaceEntity.js
│   ├── boardEntity.js
│   ├── columnEntity.js
│   ├── taskEntity.js
│   └── activityEntity.js
├── infrastructure/      # Implementaciones técnicas
│   └── database/
│       └── mongo/
│           ├── *Model.js       # Schemas Mongoose
│           └── *Repository.js  # Repositorios
├── interfaces/          # Controllers (Adaptadores HTTP)
│   └── controllers/
├── middleware/          # Middlewares
│   ├── authMiddleware.js
│   ├── ErrorHandler.js
│   └── validation.js
├── app.js              # Configuración Express
└── server.js           # Entry point
```

---

## 🧪 Probar la API

### Opción 1: Thunder Client (VS Code Extension)

1. Instala la extensión "Thunder Client" en VS Code
2. Importa la colección de requests (ver `API_DOCUMENTATION.md`)
3. Empieza probando:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `GET /api/auth/me`

### Opción 2: Postman

1. Abre Postman
2. Crea una nueva colección
3. Sigue la documentación en `API_DOCUMENTATION.md`

### Opción 3: cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## 📚 Endpoints Principales

Ver documentación completa en [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)

### Authentication
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Workspaces
- `POST /api/workspaces` - Crear workspace
- `GET /api/workspaces` - Listar workspaces
- `PUT /api/workspaces/:id` - Actualizar workspace
- `DELETE /api/workspaces/:id` - Eliminar workspace

### Boards
- `POST /api/boards` - Crear tablero
- `GET /api/boards` - Listar tableros
- `GET /api/boards/:id` - Obtener tablero
- `PUT /api/boards/:id` - Actualizar tablero
- `DELETE /api/boards/:id` - Eliminar tablero

### Columns
- `POST /api/columns` - Crear columna
- `GET /api/columns` - Listar columnas
- `PUT /api/columns/:id` - Actualizar columna
- `DELETE /api/columns/:id` - Eliminar columna
- `POST /api/columns/reorder` - Reordenar columnas

### Tasks
- `POST /api/tasks` - Crear tarea
- `GET /api/tasks` - Listar tareas
- `GET /api/tasks/:id` - Obtener tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `POST /api/tasks/:id/move` - Mover tarea (drag & drop)
- `POST /api/tasks/:id/comments` - Agregar comentario
- `GET /api/tasks/search` - Buscar tareas
- `GET /api/tasks/my-tasks` - Mis tareas asignadas

### Activities
- `GET /api/activities` - Listar actividades del board
- `GET /api/activities/my-activities` - Mis actividades

---

## 🔐 Autenticación

Todas las rutas (excepto `/auth/register` y `/auth/login`) requieren autenticación JWT.

**Header requerido:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎨 Features Implementadas

✅ **Autenticación y Autorización**
- Registro y login con JWT
- Hash de passwords con bcrypt
- Middleware de protección de rutas
- Sistema de roles (admin, member, viewer)

✅ **Workspaces**
- CRUD completo
- Gestión de miembros
- Permisos por rol

✅ **Boards (Tableros Kanban)**
- CRUD completo
- Asociados a workspaces
- Gestión de miembros
- Múltiples columnas

✅ **Columns (Listas)**
- CRUD completo
- Reordenamiento (drag & drop)
- Colores personalizables

✅ **Tasks (Tareas)**
- CRUD completo
- Mover entre columnas (drag & drop)
- Asignación a usuarios
- Prioridades (low, medium, high, urgent)
- Fechas de vencimiento
- Tags personalizados
- Comentarios
- Adjuntos (preparado para Cloudinary)
- Búsqueda

✅ **Activity Log**
- Historial de todas las acciones
- Filtrado por board o usuario
- Detalles de cambios

✅ **Clean Architecture**
- Separación de capas
- Inyección de dependencias
- Fácil de testear y mantener

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

---

## 📦 Dependencias Principales

- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **bcryptjs** - Hash de passwords
- **jsonwebtoken** - Autenticación JWT
- **express-validator** - Validación de datos
- **socket.io** - WebSockets (próximamente)
- **helmet** - Seguridad HTTP
- **cors** - CORS
- **morgan** - Logger HTTP
- **dotenv** - Variables de entorno

---

## 🚧 Próximas Features

- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Upload de archivos con Multer + Cloudinary
- [ ] Notificaciones
- [ ] Exportar tableros a PDF/CSV
- [ ] Plantillas de tableros
- [ ] Estadísticas y métricas
- [ ] Integraciones (Slack, Email)

---

## 📝 Notas de Desarrollo

### Generar JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Limpiar base de datos
```bash
# Conectarse a MongoDB
mongosh

# Usar la base de datos
use kanban-db

# Eliminar todas las colecciones
db.dropDatabase()
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB esté corriendo
- Verifica la URL en `.env`
- Si usas MongoDB Atlas, verifica tu IP en la whitelist

### Error: "JWT must be provided"
- Asegúrate de incluir el header `Authorization: Bearer {token}`
- Verifica que el token no haya expirado

### Error: "Port 5000 already in use"
- Cambia el puerto en `.env`
- O mata el proceso: `npx kill-port 5000`

---

## 📄 Licencia

MIT

---

## 👨‍💻 Autor

Desarrollado con ❤️ para demostrar Clean Architecture en Node.js
