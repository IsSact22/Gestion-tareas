# 📮 Guía de Postman - Kanban API

## 🚀 Importar la Colección

### Paso 1: Abrir Postman
1. Abre Postman Desktop o Web
2. Click en **"Import"** (arriba a la izquierda)
3. Arrastra el archivo `Kanban_API.postman_collection.json` o haz click en **"Upload Files"**
4. Click en **"Import"**

✅ La colección aparecerá en tu sidebar con el nombre **"Kanban API - Sistema de Gestión de Tareas"**

---

## 🔧 Configuración Inicial

### Variables de Colección

La colección ya tiene configuradas estas variables:

| Variable | Valor Inicial | Descripción |
|----------|---------------|-------------|
| `baseUrl` | `http://localhost:5000/api` | URL base de la API |
| `token` | (vacío) | Se guarda automáticamente al login |
| `workspaceId` | (vacío) | Se guarda al crear workspace |
| `boardId` | (vacío) | Se guarda al crear board |
| `columnId` | (vacío) | Se guarda al crear columna |
| `taskId` | (vacío) | Se guarda al crear tarea |
| `userId` | (vacío) | Se guarda al registrar/login |

**No necesitas configurar nada manualmente**, las variables se guardan automáticamente al ejecutar los requests.

---

## 🎯 Flujo de Prueba Recomendado

### 1️⃣ **Authentication**

#### a) Register User
```
POST /auth/register
```
- Ejecuta este request primero
- El token se guarda automáticamente en `{{token}}`
- El userId se guarda en `{{userId}}`

#### b) Login (opcional)
```
POST /auth/login
```
- Usa este si ya tienes un usuario registrado
- También guarda el token automáticamente

#### c) Get Current User
```
GET /auth/me
```
- Verifica que estás autenticado correctamente

---

### 2️⃣ **Workspaces**

#### a) Create Workspace
```
POST /workspaces
```
- Crea tu primer workspace
- El `workspaceId` se guarda automáticamente

#### b) Get All Workspaces
```
GET /workspaces
```
- Ver todos tus workspaces

---

### 3️⃣ **Boards**

#### a) Create Board
```
POST /boards
```
- Usa el `{{workspaceId}}` que se guardó automáticamente
- El `boardId` se guarda automáticamente

#### b) Get Boards by Workspace
```
GET /boards?workspaceId={{workspaceId}}
```
- Ver todos los boards de un workspace

---

### 4️⃣ **Columns**

Ejecuta estos 3 requests en orden para crear las columnas típicas de Kanban:

#### a) Create Column - To Do
```
POST /columns
Body: { "name": "📝 To Do", "color": "#EF4444" }
```

#### b) Create Column - In Progress
```
POST /columns
Body: { "name": "🚧 In Progress", "color": "#F59E0B" }
```

#### c) Create Column - Done
```
POST /columns
Body: { "name": "✅ Done", "color": "#10B981" }
```

El `columnId` de la primera columna se guarda automáticamente.

---

### 5️⃣ **Tasks**

#### a) Create Task
```
POST /tasks
```
- Crea una tarea en la columna guardada
- El `taskId` se guarda automáticamente

#### b) Get Tasks by Board
```
GET /tasks?boardId={{boardId}}
```
- Ver todas las tareas del board

#### c) Move Task (Drag & Drop)
```
POST /tasks/{{taskId}}/move
```
- Simula el drag & drop
- Cambia `newColumnId` al ID de otra columna

#### d) Add Comment
```
POST /tasks/{{taskId}}/comments
```
- Agrega un comentario a la tarea

---

### 6️⃣ **Activities**

#### Get Board Activities
```
GET /activities?boardId={{boardId}}
```
- Ver el historial de todas las acciones en el board

---

## 🎨 Estructura de la Colección

```
📮 Kanban API
├── 🔐 Authentication (4 requests)
│   ├── Register User ⭐
│   ├── Login ⭐
│   ├── Get Current User
│   └── Logout
│
├── 👥 Users (4 requests)
│   ├── Get All Users
│   ├── Search Users
│   ├── Get User by ID
│   └── Update Profile
│
├── 🏢 Workspaces (7 requests)
│   ├── Create Workspace ⭐
│   ├── Get All Workspaces
│   ├── Get Workspace by ID
│   ├── Update Workspace
│   ├── Delete Workspace
│   ├── Add Member to Workspace
│   └── Remove Member from Workspace
│
├── 📋 Boards (6 requests)
│   ├── Create Board ⭐
│   ├── Get All Boards
│   ├── Get Boards by Workspace
│   ├── Get Board by ID
│   ├── Update Board
│   └── Delete Board
│
├── 📊 Columns (7 requests)
│   ├── Create Column - To Do ⭐
│   ├── Create Column - In Progress ⭐
│   ├── Create Column - Done ⭐
│   ├── Get Columns by Board
│   ├── Update Column
│   ├── Delete Column
│   └── Reorder Columns
│
├── ✅ Tasks (10 requests)
│   ├── Create Task ⭐
│   ├── Get Tasks by Board
│   ├── Get Tasks by Column
│   ├── Get Task by ID
│   ├── Get My Tasks
│   ├── Search Tasks
│   ├── Update Task
│   ├── Move Task (Drag & Drop) ⭐
│   ├── Add Comment to Task
│   └── Delete Task
│
├── 📝 Activities (2 requests)
│   ├── Get Board Activities
│   └── Get My Activities
│
└── 🏥 Health Check (1 request)
    └── API Health
```

**Total: 41 requests** ⭐ = Esenciales para empezar

---

## 🔐 Autenticación

### Automática (Recomendado)
La colección está configurada para usar el token automáticamente:
- Al hacer login/register, el token se guarda en `{{token}}`
- Todos los requests protegidos usan `Authorization: Bearer {{token}}`

### Manual (si es necesario)
Si necesitas usar otro token:
1. Click derecho en la colección → **"Edit"**
2. Ve a la pestaña **"Variables"**
3. Cambia el valor de `token`

---

## 📝 Ejemplos de Body

### Register/Login
```json
{
  "name": "Isaac Chung",
  "email": "isaac@example.com",
  "password": "password123"
}
```

### Create Workspace
```json
{
  "name": "Mi Proyecto",
  "description": "Workspace principal"
}
```

### Create Board
```json
{
  "name": "Sprint 1",
  "description": "Board del primer sprint",
  "workspaceId": "{{workspaceId}}"
}
```

### Create Column
```json
{
  "name": "To Do",
  "boardId": "{{boardId}}",
  "color": "#EF4444"
}
```

### Create Task
```json
{
  "title": "Implementar login",
  "description": "Crear página de login con validaciones",
  "columnId": "{{columnId}}",
  "priority": "high",
  "dueDate": "2025-10-30",
  "tags": ["frontend", "auth"]
}
```

### Move Task
```json
{
  "newColumnId": "otra_columna_id",
  "newPosition": 0
}
```

### Add Comment
```json
{
  "text": "Esta tarea está lista para revisión"
}
```

---

## 🎯 Scripts Automáticos

La colección incluye scripts que automatizan el guardado de variables:

### Register/Login
```javascript
// Guarda automáticamente el token y userId
if (pm.response.code === 201 || pm.response.code === 200) {
    const response = pm.response.json();
    pm.collectionVariables.set('token', response.data.token);
    pm.collectionVariables.set('userId', response.data.user.id);
}
```

### Create Workspace
```javascript
// Guarda automáticamente el workspaceId
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.collectionVariables.set('workspaceId', response.data._id);
}
```

### Create Board
```javascript
// Guarda automáticamente el boardId
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.collectionVariables.set('boardId', response.data._id);
}
```

Y así sucesivamente para columns y tasks.

---

## 🧪 Testing

Puedes agregar tests a cada request. Ejemplo:

```javascript
// Test de status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test de estructura de respuesta
pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

// Test de datos
pm.test("Response has data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});
```

---

## 🚀 Consejos Pro

### 1. Usar Environments
Crea diferentes environments para desarrollo, staging y producción:
```
Development: http://localhost:5000/api
Staging: https://api-staging.example.com/api
Production: https://api.example.com/api
```

### 2. Organizar con Folders
Los requests ya están organizados por módulos (Auth, Users, Workspaces, etc.)

### 3. Usar Runner
Para probar múltiples requests en secuencia:
1. Click en la colección
2. Click en **"Run"**
3. Selecciona los requests que quieres ejecutar
4. Click en **"Run Kanban API"**

### 4. Compartir Colección
Exporta la colección para compartir con tu equipo:
1. Click derecho en la colección
2. **"Export"**
3. Elige formato v2.1
4. Comparte el archivo JSON

---

## 🐛 Troubleshooting

### Error: "Could not get response"
- Verifica que el servidor esté corriendo: `npm run dev`
- Verifica la URL base: `http://localhost:5000/api`

### Error: "Unauthorized"
- Ejecuta primero **Register** o **Login**
- Verifica que el token se guardó en las variables

### Error: "Workspace not found"
- Ejecuta primero **Create Workspace**
- Verifica que `{{workspaceId}}` tiene un valor

### Variables no se guardan
- Verifica que los scripts están habilitados en Settings
- Revisa la consola de Postman para ver errores

---

## 📊 Prioridades de Testing

### Nivel 1 - Básico (Empezar aquí)
1. ✅ Health Check
2. ✅ Register User
3. ✅ Login
4. ✅ Get Current User

### Nivel 2 - Core Features
5. ✅ Create Workspace
6. ✅ Create Board
7. ✅ Create Columns (To Do, In Progress, Done)
8. ✅ Create Task

### Nivel 3 - Funcionalidades Avanzadas
9. ✅ Move Task
10. ✅ Add Comment
11. ✅ Search Tasks
12. ✅ Get Activities

### Nivel 4 - Gestión
13. ✅ Add Members
14. ✅ Update/Delete
15. ✅ Reorder Columns

---

## 🎉 ¡Listo!

Ahora tienes una colección completa de Postman con:
- ✅ 41 requests organizados
- ✅ Variables automáticas
- ✅ Autenticación configurada
- ✅ Scripts para guardar IDs
- ✅ Ejemplos de datos

**¡Empieza probando desde "Register User" y sigue el flujo! 🚀**
