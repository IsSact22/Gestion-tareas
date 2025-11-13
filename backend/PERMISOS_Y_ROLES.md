# 🔐 Sistema de Roles y Permisos

## Roles Disponibles

### 1. **Admin** - Control Total
- ✅ Acceso completo a todas las funcionalidades
- ✅ Puede gestionar usuarios (crear, actualizar, eliminar, cambiar roles)
- ✅ Puede eliminar cualquier tarea, comentario o board
- ✅ Puede modificar cualquier recurso del sistema

### 2. **Member** - Colaborador
- ✅ Puede ver workspaces donde está invitado
- ✅ Puede ver y editar boards donde está invitado
- ✅ Puede crear, editar y mover tareas
- ✅ Puede eliminar sus propias tareas
- ✅ Puede agregar comentarios
- ✅ Puede eliminar sus propios comentarios
- ✅ Puede ver su información personal y estadísticas
- ❌ No puede eliminar tareas/comentarios de otros (solo admin)
- ❌ No puede modificar usuarios
- ❌ No puede cambiar su propio rol

### 3. **Viewer** - Solo Lectura
- ✅ Puede ver boards donde está invitado
- ✅ Puede ver tareas asignadas
- ✅ Puede ver comentarios
- ❌ No puede crear, editar o eliminar nada
- ❌ No puede agregar comentarios
- ❌ No puede cambiar estados de tareas

---

## Endpoints y Permisos

### 👤 Usuarios (`/api/users`)

| Método | Ruta | Permisos | Descripción |
|--------|------|----------|-------------|
| GET | `/` | Admin | Ver todos los usuarios |
| GET | `/search` | Todos | Buscar usuarios |
| GET | `/:id` | Todos | Ver un usuario específico |
| PUT | `/profile` | Todos | Actualizar propio perfil (NO puede cambiar rol) |
| PUT | `/:id` | Admin | Actualizar cualquier usuario (puede cambiar rol) |
| DELETE | `/:id` | Admin | Eliminar usuario |

**Ejemplo - Usuario actualiza su perfil:**
```http
PUT /api/users/profile
Authorization: Bearer <token>
{
  "name": "Nuevo Nombre",
  "password": "nuevaContraseña123"
}
```

**Ejemplo - Admin actualiza usuario:**
```http
PUT /api/users/68f7b78a7ea7f2e2b4c43f49
Authorization: Bearer <admin_token>
{
  "name": "Isaac Tovar",
  "role": "admin",
  "password": "12345678"
}
```

---

### 📋 Tareas (`/api/tasks`)

| Método | Ruta | Permisos | Descripción |
|--------|------|----------|-------------|
| GET | `/` | Todos | Ver tareas de un board |
| GET | `/my-tasks` | Todos | Ver mis tareas asignadas |
| GET | `/search` | Todos | Buscar tareas |
| GET | `/:id` | Todos | Ver una tarea específica |
| POST | `/` | Admin, Member | Crear tarea |
| PUT | `/:id` | Admin, Member | Actualizar tarea |
| DELETE | `/:id` | Admin, Member* | Eliminar tarea (*solo propias o admin) |
| POST | `/:id/move` | Admin, Member | Mover tarea a otra columna |
| POST | `/:id/comments` | Admin, Member | Agregar comentario |
| DELETE | `/:id/comments/:commentId` | Admin, Member* | Eliminar comentario (*solo propios o admin) |

---

### 📊 Boards (`/api/boards`)

| Método | Ruta | Permisos | Descripción |
|--------|------|----------|-------------|
| GET | `/` | Todos | Ver boards donde soy miembro |
| GET | `/:id` | Todos | Ver un board específico |
| POST | `/` | Admin, Member | Crear board |
| PUT | `/:id` | Admin, Member* | Actualizar board (*solo si es admin del board) |
| DELETE | `/:id` | Admin | Eliminar board |
| POST | `/:id/members` | Admin, Board Admin | Agregar miembro al board |
| DELETE | `/:id/members/:userId` | Admin, Board Admin | Eliminar miembro del board |

---

### 📁 Workspaces (`/api/workspaces`)

| Método | Ruta | Permisos | Descripción |
|--------|------|----------|-------------|
| GET | `/` | Todos | Ver workspaces donde soy miembro |
| GET | `/:id` | Todos | Ver un workspace específico |
| POST | `/` | Todos | Crear workspace |
| PUT | `/:id` | Admin, Workspace Owner | Actualizar workspace |
| DELETE | `/:id` | Admin, Workspace Owner | Eliminar workspace |
| POST | `/:id/members` | Admin, Workspace Owner | Agregar miembro |
| DELETE | `/:id/members/:userId` | Admin, Workspace Owner | Eliminar miembro |

---

## Lógica de Permisos

### Eliminar Tarea
```javascript
// Admin puede eliminar cualquier tarea
// Member solo puede eliminar sus propias tareas
if (user.role === 'admin') {
  // Permitir
} else if (task.createdBy === user._id) {
  // Permitir
} else {
  // Denegar
}
```

### Eliminar Comentario
```javascript
// Admin puede eliminar cualquier comentario
// Member solo puede eliminar sus propios comentarios
if (user.role === 'admin') {
  // Permitir
} else if (comment.user === user._id) {
  // Permitir
} else {
  // Denegar
}
```

### Actualizar Board
```javascript
// Admin global puede actualizar cualquier board
// Admin del board puede actualizar el board
// Member del board NO puede actualizar (solo viewer)
const boardMember = board.members.find(m => m.user._id === user._id);
if (user.role === 'admin' || boardMember.role === 'admin') {
  // Permitir
} else {
  // Denegar
}
```

---

## Middleware de Autorización

### `protect`
Verifica que el usuario esté autenticado (tiene token válido).

### `isAdmin`
Verifica que el usuario tenga rol `admin`.

### `canEdit`
Verifica que el usuario pueda editar (admin o member, NO viewer).

### `canComment`
Verifica que el usuario pueda comentar (admin o member, NO viewer).

---

## Ejemplos de Uso

### Crear un Admin
```http
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

### Cambiar Rol de Usuario (Solo Admin)
```http
PUT /api/users/68f7b78a7ea7f2e2b4c43f49
Authorization: Bearer <admin_token>
{
  "role": "member"
}
```

### Usuario Viewer Intenta Crear Tarea
```http
POST /api/tasks
Authorization: Bearer <viewer_token>
{
  "title": "Nueva tarea"
}

// Respuesta: 403 Forbidden
// "Los viewers no pueden realizar modificaciones"
```

---

## Notas Importantes

1. **Contraseñas**: Siempre se hashean antes de guardar en la base de datos usando bcrypt.
2. **Roles en Boards**: Un usuario puede tener rol global `member` pero ser `admin` de un board específico.
3. **Jerarquía**: Admin global > Admin de board > Member > Viewer
4. **Tokens**: Los tokens JWT incluyen el ID del usuario, el rol se obtiene de la base de datos en cada request.
