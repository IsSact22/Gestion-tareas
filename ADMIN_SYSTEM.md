# 👑 Sistema de Administrador - Guía Completa

## 🎯 **Tu Pregunta:**

> "¿Cómo hago para tener un usuario admin que pueda ver todos los boards, tasks, workspaces de todos los usuarios?"

---

## ✅ **Respuesta: Sí, se puede implementar!**

Hay **2 enfoques** para implementar un sistema de administrador:

---

## 📋 **Opción 1: Super Admin Global** (Recomendado)

### **Concepto:**
Un usuario con rol `super_admin` que puede ver y gestionar **TODO** en la aplicación, sin importar a qué workspace pertenezca.

### **Implementación:**

#### **1. Agregar campo `role` al modelo User**

**Archivo:** `backend/src/domain/models/User.js`

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // ✅ NUEVO: Rol global del usuario
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user'
  },
  
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

**Roles:**
- `user` - Usuario normal (solo ve sus workspaces)
- `admin` - Administrador (puede gestionar usuarios)
- `super_admin` - Super Admin (ve TODO)

---

#### **2. Crear middleware de autorización**

**Archivo:** `backend/src/middleware/checkRole.js`

```javascript
import AppError from '../core/AppError.js';

export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return next(new AppError('Super admin access required', 403));
  }
  next();
};
```

---

#### **3. Modificar los casos de uso para admins**

**Archivo:** `backend/src/application/workspace/getWorkspacesUseCase.js`

```javascript
export default class GetWorkspacesUseCase {
  constructor(workspaceRepository) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute(userId, userRole) {
    // ✅ Si es super_admin, devolver TODOS los workspaces
    if (userRole === 'super_admin') {
      return await this.workspaceRepository.findAll();
    }

    // Usuario normal: solo sus workspaces
    return await this.workspaceRepository.findByUserId(userId);
  }
}
```

---

#### **4. Crear rutas de administrador**

**Archivo:** `backend/src/routes/adminRoutes.js`

```javascript
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { isSuperAdmin } from '../middleware/checkRole.js';
import * as adminController from '../interfaces/controllers/adminController.js';

const router = express.Router();

// Todas las rutas requieren autenticación + super_admin
router.use(authenticate);
router.use(isSuperAdmin);

// Dashboard de admin
router.get('/dashboard', adminController.getDashboard);

// Ver todos los usuarios
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Ver todos los workspaces
router.get('/workspaces', adminController.getAllWorkspaces);
router.delete('/workspaces/:id', adminController.deleteWorkspace);

// Ver todos los boards
router.get('/boards', adminController.getAllBoards);
router.delete('/boards/:id', adminController.deleteBoard);

// Ver todas las tareas
router.get('/tasks', adminController.getAllTasks);

// Estadísticas globales
router.get('/stats', adminController.getGlobalStats);

export default router;
```

---

#### **5. Crear controlador de admin**

**Archivo:** `backend/src/interfaces/controllers/adminController.js`

```javascript
export async function getDashboard(req, res, next) {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalWorkspaces: await Workspace.countDocuments(),
      totalBoards: await Board.countDocuments(),
      totalTasks: await Task.countDocuments(),
      activeUsers: await User.countDocuments({ lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function getAllWorkspaces(req, res, next) {
  try {
    const workspaces = await Workspace.find()
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: workspaces });
  } catch (error) {
    next(error);
  }
}

export async function getAllBoards(req, res, next) {
  try {
    const boards = await Board.find()
      .populate('workspace', 'name')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: boards });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function getGlobalStats(req, res, next) {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        active: await User.countDocuments({ lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
        byRole: await User.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } }
        ])
      },
      workspaces: {
        total: await Workspace.countDocuments(),
        byOwner: await Workspace.aggregate([
          { $group: { _id: '$owner', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ])
      },
      boards: {
        total: await Board.countDocuments(),
        byWorkspace: await Board.aggregate([
          { $group: { _id: '$workspace', count: { $sum: 1 } } }
        ])
      },
      tasks: {
        total: await Task.countDocuments(),
        byStatus: await Task.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
      }
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}
```

---

#### **6. Frontend: Panel de Admin**

**Archivo:** `frontend/src/app/admin/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    // Verificar que el usuario sea super_admin
    if (user?.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }

    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    // Obtener estadísticas
    const statsRes = await fetch('/api/admin/stats');
    const statsData = await statsRes.json();
    setStats(statsData.data);

    // Obtener todos los usuarios
    const usersRes = await fetch('/api/admin/users');
    const usersData = await usersRes.json();
    setUsers(usersData.data);

    // Obtener todos los workspaces
    const workspacesRes = await fetch('/api/admin/workspaces');
    const workspacesData = await workspacesRes.json();
    setWorkspaces(workspacesData.data);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">👑 Panel de Administrador</h1>

      {/* Estadísticas Globales */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Usuarios</h3>
          <p className="text-3xl font-bold">{stats?.users.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Workspaces</h3>
          <p className="text-3xl font-bold">{stats?.workspaces.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Boards</h3>
          <p className="text-3xl font-bold">{stats?.boards.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Tareas</h3>
          <p className="text-3xl font-bold">{stats?.tasks.total}</p>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Todos los Usuarios</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Nombre</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Rol</th>
              <th className="text-left py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-2">
                  <button className="text-blue-600 hover:underline mr-4">
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista de Workspaces */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Todos los Workspaces</h2>
        <div className="grid grid-cols-3 gap-4">
          {workspaces.map(workspace => (
            <div key={workspace._id} className="border rounded-lg p-4">
              <h3 className="font-bold">{workspace.name}</h3>
              <p className="text-sm text-gray-600">
                Owner: {workspace.owner.name}
              </p>
              <p className="text-sm text-gray-600">
                Members: {workspace.members.length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 **Opción 2: Admin por Workspace**

Cada workspace tiene sus propios admins que solo pueden ver ese workspace.

**Ventajas:**
- ✅ Más seguro (aislamiento por workspace)
- ✅ Escalable para empresas grandes

**Desventajas:**
- ❌ No hay visión global de toda la aplicación

---

## 🚀 **Cómo Implementarlo**

### **Paso 1: Arreglar workspaces existentes**

```bash
cd backend
node scripts/fixWorkspaceMembers.js
```

### **Paso 2: Crear un super admin**

```javascript
// Desde MongoDB Compass o mongo shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "super_admin" } }
)
```

### **Paso 3: Agregar campo `role` al modelo User**

Actualizar el schema en `backend/src/domain/models/User.js`

### **Paso 4: Crear rutas y controladores de admin**

Seguir los ejemplos de arriba.

### **Paso 5: Crear panel de admin en el frontend**

Crear página `/admin` con acceso restringido.

---

## ✅ **Resumen**

**Para tu caso:**
1. ✅ Ejecuta el script para arreglar los workspaces existentes
2. ✅ Agrega el campo `role` al modelo User
3. ✅ Crea un usuario con rol `super_admin`
4. ✅ Implementa las rutas de admin
5. ✅ Crea el panel de admin en el frontend

**Con esto podrás:**
- 👑 Ver todos los workspaces, boards y tareas
- 👥 Gestionar usuarios (cambiar roles, eliminar)
- 📊 Ver estadísticas globales
- 🔧 Administrar toda la aplicación

---

**¿Quieres que implemente el sistema de admin completo?** 🎯
