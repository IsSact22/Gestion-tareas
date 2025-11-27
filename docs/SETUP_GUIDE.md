# 🚀 Guía de Configuración Rápida - Sistema Kanban

## 📋 Requisitos Previos

- ✅ Node.js 18+ instalado
- ✅ MongoDB instalado localmente O cuenta en MongoDB Atlas
- ✅ Git instalado
- ✅ Editor de código (VS Code recomendado)

---

## ⚡ Instalación Rápida

### 1️⃣ Backend

```bash
# Navegar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus valores (ver abajo)
```

**Configurar `.env`:**
```env
PORT=5000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/kanban-db
JWT_SECRET=genera-una-clave-secreta-aqui
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Generar JWT Secret seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Iniciar servidor:**
```bash
npm run dev
```

✅ Backend corriendo en: `http://localhost:5000`

---

### 2️⃣ Frontend

```bash
# Navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

✅ Frontend corriendo en: `http://localhost:3000`

---

## 🧪 Probar el Backend

### Opción 1: Health Check
```bash
curl http://localhost:5000/api/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "API is healthy",
  "env": "development"
}
```

### Opción 2: Registrar un usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Deberías recibir un token JWT.

---

## 🗄️ MongoDB

### Opción A: MongoDB Local

1. **Instalar MongoDB:**
   - Windows: [Descargar MongoDB](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt install mongodb`

2. **Iniciar MongoDB:**
   ```bash
   # Windows
   mongod

   # Mac/Linux
   brew services start mongodb-community
   # o
   sudo systemctl start mongod
   ```

3. **Verificar conexión:**
   ```bash
   mongosh
   ```

### Opción B: MongoDB Atlas (Cloud - Gratis)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crear un cluster gratuito (M0)
3. Crear un usuario de base de datos
4. Agregar tu IP a la whitelist (o permitir acceso desde cualquier IP: 0.0.0.0/0)
5. Obtener connection string
6. Actualizar `.env`:
   ```env
   DB_URL=mongodb+srv://username:password@cluster.mongodb.net/kanban-db?retryWrites=true&w=majority
   ```

---

## 🎯 Flujo de Prueba Completo

### 1. Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Guardar el token que recibes!**

### 2. Crear Workspace
```bash
curl -X POST http://localhost:5000/api/workspaces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Mi Proyecto",
    "description": "Workspace principal"
  }'
```

**Guardar el workspace ID!**

### 3. Crear Board
```bash
curl -X POST http://localhost:5000/api/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Sprint 1",
    "workspaceId": "WORKSPACE_ID_AQUI"
  }'
```

**Guardar el board ID!**

### 4. Crear Columnas
```bash
# To Do
curl -X POST http://localhost:5000/api/columns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "To Do",
    "boardId": "BOARD_ID_AQUI",
    "color": "#EF4444"
  }'

# In Progress
curl -X POST http://localhost:5000/api/columns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "In Progress",
    "boardId": "BOARD_ID_AQUI",
    "color": "#F59E0B"
  }'

# Done
curl -X POST http://localhost:5000/api/columns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Done",
    "boardId": "BOARD_ID_AQUI",
    "color": "#10B981"
  }'
```

### 5. Crear Tarea
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Configurar base de datos",
    "description": "Instalar y configurar MongoDB",
    "columnId": "TODO_COLUMN_ID_AQUI",
    "priority": "high",
    "tags": ["backend", "database"]
  }'
```

### 6. Ver Tareas del Board
```bash
curl -X GET "http://localhost:5000/api/tasks?boardId=BOARD_ID_AQUI" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🛠️ Herramientas Recomendadas

### VS Code Extensions
- **Thunder Client** - Probar APIs (alternativa a Postman)
- **MongoDB for VS Code** - Ver base de datos
- **ESLint** - Linting
- **Prettier** - Formateo de código

### Otras Herramientas
- **Postman** - Probar APIs
- **MongoDB Compass** - GUI para MongoDB
- **Insomnia** - Alternativa a Postman

---

## 📊 Estructura de Archivos Creados

```
api-blogPersonal/
├── backend/
│   ├── src/
│   │   ├── application/        # 30+ Use Cases
│   │   ├── config/             # Configuración
│   │   ├── core/               # Utilidades
│   │   ├── domain/             # 6 Entidades
│   │   ├── infrastructure/     # 12 Models + 12 Repositories
│   │   ├── interfaces/         # 7 Controllers
│   │   │   └── webserver/
│   │   │       └── express/
│   │   │           └── routes/ # 7 Routes
│   │   ├── middleware/         # Auth, Errors, Validation
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── API_DOCUMENTATION.md
├── frontend/
│   ├── src/
│   │   └── app/
│   ├── package.json
│   └── README.md
├── PROGRESS.md
└── SETUP_GUIDE.md (este archivo)
```

---

## 🎨 Endpoints Disponibles

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Workspaces
- `POST /api/workspaces`
- `GET /api/workspaces`
- `GET /api/workspaces/:id`
- `PUT /api/workspaces/:id`
- `DELETE /api/workspaces/:id`
- `POST /api/workspaces/:id/members`

### Boards
- `POST /api/boards`
- `GET /api/boards`
- `GET /api/boards/:id`
- `PUT /api/boards/:id`
- `DELETE /api/boards/:id`

### Columns
- `POST /api/columns`
- `GET /api/columns`
- `PUT /api/columns/:id`
- `DELETE /api/columns/:id`
- `POST /api/columns/reorder`

### Tasks
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/move`
- `POST /api/tasks/:id/comments`
- `GET /api/tasks/search`
- `GET /api/tasks/my-tasks`

### Activities
- `GET /api/activities`
- `GET /api/activities/my-activities`

Ver documentación completa en `backend/API_DOCUMENTATION.md`

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
cd backend
npm install
```

### Error: "Port 5000 already in use"
```bash
# Cambiar puerto en .env
PORT=5001

# O matar el proceso
npx kill-port 5000
```

### Error: "MongooseServerSelectionError"
- Verifica que MongoDB esté corriendo
- Verifica la URL en `.env`
- Si usas Atlas, verifica tu IP en la whitelist

### Error: "JWT malformed"
- Verifica que estés enviando el token correctamente
- Header: `Authorization: Bearer {token}`

---

## ✅ Checklist de Verificación

- [ ] Node.js instalado
- [ ] MongoDB corriendo
- [ ] Backend: `npm install` ejecutado
- [ ] Backend: `.env` configurado
- [ ] Backend: servidor corriendo en puerto 5000
- [ ] Backend: health check exitoso
- [ ] Backend: usuario registrado correctamente
- [ ] Frontend: `npm install` ejecutado (próximamente)
- [ ] Frontend: servidor corriendo en puerto 3000 (próximamente)

---

## 🚀 Próximos Pasos

1. ✅ **Backend completado** - Listo para usar
2. ⏳ **Frontend** - Implementar UI con Next.js
3. ⏳ **WebSockets** - Tiempo real
4. ⏳ **Deploy** - Producción

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs del servidor
2. Verifica la configuración del `.env`
3. Asegúrate de que MongoDB esté corriendo
4. Revisa la documentación en `API_DOCUMENTATION.md`

---

¡Listo para desarrollar! 🎉
