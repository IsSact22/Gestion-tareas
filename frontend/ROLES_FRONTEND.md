# 🎨 Sistema de Roles en el Frontend

## Componentes Implementados

### 1. **Sidebar Dinámico** (`components/layout/Sidebar.tsx`)

El sidebar ahora muestra menús diferentes según el rol del usuario:

#### **Admin** ⭐
```
✅ Dashboard
✅ Workspaces
✅ Boards
✅ My Tasks
✅ Manage Users (exclusivo)
✅ Team
✅ My Profile
✅ Settings (exclusivo)
```

#### **Member** 👤
```
✅ Dashboard
✅ Workspaces
✅ Boards
✅ My Tasks
✅ Team
✅ My Profile
```

#### **Viewer** 👁️
```
✅ Dashboard
✅ Workspaces
✅ Boards
✅ My Tasks
✅ My Profile
```

**Características:**
- Badge de rol visible en el sidebar (Admin/Member/Viewer)
- Menús filtrados automáticamente según permisos
- Colores distintivos por rol:
  - Admin: Púrpura
  - Member: Azul
  - Viewer: Gris

---

### 2. **Página de Gestión de Usuarios** (`app/admin/users/page.tsx`)

**Solo accesible para Admin**

**Funcionalidades:**
- ✅ Ver lista completa de usuarios del sistema
- ✅ Crear nuevos usuarios con rol asignado
- ✅ Editar usuarios existentes (nombre, contraseña, rol)
- ✅ Eliminar usuarios (excepto a sí mismo)
- ✅ Tabla con información detallada:
  - Avatar
  - Nombre
  - Email
  - Rol (con badge de color)
  - Fecha de registro
  - Acciones (editar/eliminar)

**Protección:**
```typescript
useEffect(() => {
  if (currentUser && currentUser.role !== 'admin') {
    toast.error('No tienes permisos para acceder a esta página');
    router.push('/dashboard');
  }
}, [currentUser, router]);
```

**Endpoints utilizados:**
- `GET /api/users` - Listar todos los usuarios
- `POST /api/auth/register` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario (admin)
- `DELETE /api/users/:id` - Eliminar usuario

---

### 3. **Página de Perfil Personal** (`app/profile/page.tsx`)

**Accesible para todos los roles**

**Funcionalidades:**
- ✅ Ver información personal
- ✅ Editar nombre
- ✅ Cambiar contraseña
- ✅ Ver rol actual (no editable)
- ✅ Ver fecha de registro
- ✅ Ver última actualización

**Campos NO editables:**
- ❌ Email (único e inmutable)
- ❌ Rol (solo admin puede cambiar)
- ❌ ID de usuario

**Endpoint utilizado:**
- `PUT /api/users/profile` - Actualizar propio perfil

---

## Flujo de Autenticación y Roles

### 1. **Login**
```typescript
// El usuario inicia sesión
const response = await api.post('/auth/login', { email, password });
const { token, user } = response.data.data;

// user contiene:
{
  id: "...",
  name: "Isaac Tovar",
  email: "isaac@test.com",
  role: "admin", // o "member" o "viewer"
  avatar: null,
  createdAt: "...",
  updatedAt: "..."
}
```

### 2. **Verificación de Rol**
```typescript
// En el Sidebar
const menuItems = useMemo(() => {
  return getMenuItemsByRole(user?.role || 'viewer');
}, [user?.role]);

// En páginas protegidas
if (currentUser && currentUser.role !== 'admin') {
  router.push('/dashboard');
}
```

### 3. **Actualización de Perfil**
```typescript
// Usuario normal (NO puede cambiar rol)
PUT /api/users/profile
{
  "name": "Nuevo Nombre",
  "password": "nuevaContraseña"
}

// Admin (PUEDE cambiar rol de otros)
PUT /api/users/:id
{
  "name": "Isaac Tovar",
  "role": "admin",
  "password": "12345678"
}
```

---

## Diferencias entre Roles

| Característica | Admin | Member | Viewer |
|---------------|-------|--------|--------|
| Ver Dashboard | ✅ | ✅ | ✅ |
| Ver Workspaces | ✅ | ✅ | ✅ |
| Ver Boards | ✅ | ✅ | ✅ |
| Ver Tareas | ✅ | ✅ | ✅ |
| Crear/Editar Tareas | ✅ | ✅ | ❌ |
| Eliminar Tareas | ✅ (todas) | ✅ (propias) | ❌ |
| Agregar Comentarios | ✅ | ✅ | ❌ |
| Eliminar Comentarios | ✅ (todos) | ✅ (propios) | ❌ |
| Ver Team | ✅ | ✅ | ❌ |
| Gestionar Usuarios | ✅ | ❌ | ❌ |
| Cambiar Roles | ✅ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ |
| Editar Perfil | ✅ | ✅ | ✅ |
| Cambiar Propio Rol | ❌ | ❌ | ❌ |

---

## Rutas del Frontend

### Públicas (sin autenticación)
- `/` - Landing page
- `/login` - Inicio de sesión
- `/register` - Registro

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard (todos)
- `/workspaces` - Workspaces (todos)
- `/boards` - Boards (todos)
- `/tasks` - Mis tareas (todos)
- `/profile` - Mi perfil (todos)
- `/team` - Equipo (admin, member)

### Solo Admin
- `/admin/users` - Gestión de usuarios
- `/settings` - Configuración del sistema

---

## Componentes Reutilizables

### Badge de Rol
```typescript
const getRoleBadge = (role: string) => {
  const styles = {
    admin: 'bg-purple-100 text-purple-700',
    member: 'bg-blue-100 text-blue-700',
    viewer: 'bg-gray-100 text-gray-700',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[role]}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};
```

### Protección de Rutas
```typescript
// En cualquier página que requiera permisos específicos
useEffect(() => {
  if (currentUser && !['admin', 'member'].includes(currentUser.role)) {
    toast.error('No tienes permisos para acceder a esta página');
    router.push('/dashboard');
  }
}, [currentUser, router]);
```

---

## Próximos Pasos

1. ✅ Sidebar dinámico implementado
2. ✅ Página de gestión de usuarios (admin)
3. ✅ Página de perfil personal (todos)
4. ⏳ Proteger componentes de edición en boards (mostrar/ocultar botones según rol)
5. ⏳ Proteger componentes de comentarios (viewers no pueden comentar)
6. ⏳ Agregar middleware de protección de rutas en Next.js
7. ⏳ Implementar página de configuración (solo admin)

---

## Ejemplo de Uso

### Crear un Admin desde Postman
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

### Iniciar Sesión
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Crear Usuario desde el Frontend (Admin)
1. Iniciar sesión como admin
2. Ir a "Manage Users" en el sidebar
3. Click en "Crear Usuario"
4. Llenar formulario y seleccionar rol
5. Guardar

### Actualizar Perfil (Cualquier usuario)
1. Ir a "My Profile" en el sidebar
2. Click en "Editar Perfil"
3. Modificar nombre y/o contraseña
4. Guardar cambios
