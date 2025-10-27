# 👥 Guía de Miembros y Roles

## ✅ **Problemas Resueltos:**

1. ✅ Ahora puedes especificar el `role` al crear un usuario
2. ✅ Puedes agregar miembros a un workspace
3. ✅ Los miembros verán el workspace automáticamente

---

## 🎯 **Roles Disponibles:**

- **`admin`** - Puede crear, editar y eliminar todo
- **`member`** - Puede crear y editar (rol por defecto)
- **`viewer`** - Solo puede ver, no puede editar

---

## 📝 **1. Crear Usuario con Rol Específico**

### **Endpoint:**
```
POST http://localhost:5000/api/auth/register
```

### **Body (JSON):**
```json
{
  "name": "Usuario Admin",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```

### **Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "68fba384ca85a2734aa21ac1",
      "name": "Usuario Admin",
      "email": "admin@test.com",
      "avatar": null,
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **Ejemplos:**

**Crear Admin:**
```json
{
  "name": "Super Admin",
  "email": "superadmin@test.com",
  "password": "123456",
  "role": "admin"
}
```

**Crear Member (por defecto):**
```json
{
  "name": "Usuario Normal",
  "email": "user@test.com",
  "password": "123456"
  // role: "member" (por defecto)
}
```

**Crear Viewer:**
```json
{
  "name": "Usuario Solo Lectura",
  "email": "viewer@test.com",
  "password": "123456",
  "role": "viewer"
}
```

---

## 👥 **2. Agregar Miembro a un Workspace**

### **Endpoint:**
```
POST http://localhost:5000/api/workspaces/:workspaceId/members
```

### **Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "email": "usuario2@test.com",
  "role": "member"
}
```

### **Ejemplo Completo:**

**Paso 1: Tienes este workspace (creado por Usuario 1):**
```json
{
  "_id": "68ffcfbbc9836a4ca961d677",
  "name": "Test Socket.IO Final",
  "owner": {
    "_id": "68fba384ca85a2734aa21ac1",
    "email": "isaac@test2.com"
  },
  "members": [
    {
      "user": "68fba384ca85a2734aa21ac1",
      "role": "admin"
    }
  ]
}
```

**Paso 2: Agregar Usuario 2 al workspace:**

**Request:**
```
POST http://localhost:5000/api/workspaces/68ffcfbbc9836a4ca961d677/members
Authorization: Bearer TOKEN_DEL_USUARIO_1
Content-Type: application/json

{
  "email": "isaac.tovar@test.com",
  "role": "member"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "_id": "68ffcfbbc9836a4ca961d677",
    "name": "Test Socket.IO Final",
    "owner": {
      "_id": "68fba384ca85a2734aa21ac1",
      "name": "isaac Tovar",
      "email": "isaac@test2.com"
    },
    "members": [
      {
        "user": {
          "_id": "68fba384ca85a2734aa21ac1",
          "name": "isaac Tovar",
          "email": "isaac@test2.com"
        },
        "role": "admin"
      },
      {
        "user": {
          "_id": "68f7b78a7ea7f2e2b4c43f49",
          "name": "isaac Tovar",
          "email": "isaac.tovar@test.com"
        },
        "role": "member",
        "_id": "68ffd123c9836a4ca961d999"
      }
    ]
  }
}
```

**Paso 3: Usuario 2 refresca su navegador**

Ahora el Usuario 2 verá el workspace "Test Socket.IO Final" en su dashboard automáticamente.

---

## 🔄 **3. Ver Workspaces (Usuario 2)**

Cuando el Usuario 2 haga login y vaya al dashboard, verá:

**Request:**
```
GET http://localhost:5000/api/workspaces
Authorization: Bearer TOKEN_DEL_USUARIO_2
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68ff9e57a7e4e322f41846c6",
      "name": "Mi Proyecto Principal",
      "owner": "68f7b78a7ea7f2e2b4c43f49",
      "members": [...]
    },
    {
      "_id": "68ffcfbbc9836a4ca961d677",
      "name": "Test Socket.IO Final",
      "owner": "68fba384ca85a2734aa21ac1",
      "members": [
        {
          "user": "68fba384ca85a2734aa21ac1",
          "role": "admin"
        },
        {
          "user": "68f7b78a7ea7f2e2b4c43f49",
          "role": "member"
        }
      ]
    }
  ]
}
```

---

## 🎯 **4. Flujo Completo: Compartir Workspace**

### **Escenario:**
- Usuario 1 (isaac@test2.com) crea un workspace
- Usuario 2 (isaac.tovar@test.com) quiere acceder a ese workspace

### **Pasos:**

**1. Usuario 1 crea el workspace:**
```bash
POST /api/workspaces
{
  "name": "Proyecto Compartido",
  "description": "Workspace colaborativo"
}
```

**2. Usuario 1 agrega a Usuario 2:**
```bash
POST /api/workspaces/68ffcfbbc9836a4ca961d677/members
{
  "email": "isaac.tovar@test.com",
  "role": "member"
}
```

**3. Usuario 2 refresca su navegador (F5)**

**4. Usuario 2 ve el workspace en su dashboard**

**5. Ambos usuarios pueden crear boards en ese workspace**

**6. ✅ Socket.IO sincroniza los cambios en tiempo real!**

---

## 🔐 **5. Permisos por Rol**

### **Admin:**
- ✅ Crear, editar, eliminar workspaces
- ✅ Crear, editar, eliminar boards
- ✅ Crear, editar, eliminar tasks
- ✅ Agregar/remover miembros
- ✅ Cambiar roles de miembros

### **Member:**
- ✅ Ver workspaces donde es miembro
- ✅ Crear, editar boards
- ✅ Crear, editar, eliminar tasks
- ❌ No puede agregar/remover miembros
- ❌ No puede eliminar el workspace

### **Viewer:**
- ✅ Ver workspaces donde es miembro
- ✅ Ver boards
- ✅ Ver tasks
- ❌ No puede crear ni editar nada

---

## 📊 **6. Ver Miembros de un Workspace**

### **Endpoint:**
```
GET http://localhost:5000/api/workspaces/:workspaceId
```

### **Respuesta:**
```json
{
  "success": true,
  "data": {
    "_id": "68ffcfbbc9836a4ca961d677",
    "name": "Test Socket.IO Final",
    "owner": {
      "_id": "68fba384ca85a2734aa21ac1",
      "name": "isaac Tovar",
      "email": "isaac@test2.com"
    },
    "members": [
      {
        "user": {
          "_id": "68fba384ca85a2734aa21ac1",
          "name": "isaac Tovar",
          "email": "isaac@test2.com",
          "avatar": null
        },
        "role": "admin",
        "joinedAt": "2025-10-27T20:02:03.963Z"
      },
      {
        "user": {
          "_id": "68f7b78a7ea7f2e2b4c43f49",
          "name": "isaac Tovar",
          "email": "isaac.tovar@test.com",
          "avatar": null
        },
        "role": "member",
        "joinedAt": "2025-10-27T20:15:30.123Z"
      }
    ]
  }
}
```

---

## 🗑️ **7. Remover Miembro de un Workspace**

### **Endpoint:**
```
DELETE http://localhost:5000/api/workspaces/:workspaceId/members/:userId
```

### **Ejemplo:**
```
DELETE http://localhost:5000/api/workspaces/68ffcfbbc9836a4ca961d677/members/68f7b78a7ea7f2e2b4c43f49
Authorization: Bearer TOKEN_DEL_ADMIN
```

---

## 🧪 **8. Prueba Completa con Postman**

### **Colección de Postman:**

**1. Crear Usuario 1 (Admin):**
```
POST http://localhost:5000/api/auth/register
{
  "name": "Usuario 1",
  "email": "user1@test.com",
  "password": "123456",
  "role": "admin"
}
```
→ Guarda el token como `TOKEN_USER1`

**2. Crear Usuario 2 (Member):**
```
POST http://localhost:5000/api/auth/register
{
  "name": "Usuario 2",
  "email": "user2@test.com",
  "password": "123456",
  "role": "member"
}
```
→ Guarda el token como `TOKEN_USER2`

**3. Usuario 1 crea workspace:**
```
POST http://localhost:5000/api/workspaces
Authorization: Bearer {{TOKEN_USER1}}
{
  "name": "Workspace Compartido",
  "description": "Para colaborar"
}
```
→ Guarda el `_id` como `WORKSPACE_ID`

**4. Usuario 1 agrega a Usuario 2:**
```
POST http://localhost:5000/api/workspaces/{{WORKSPACE_ID}}/members
Authorization: Bearer {{TOKEN_USER1}}
{
  "email": "user2@test.com",
  "role": "member"
}
```

**5. Usuario 2 ve sus workspaces:**
```
GET http://localhost:5000/api/workspaces
Authorization: Bearer {{TOKEN_USER2}}
```
→ ✅ Debería ver el workspace compartido!

**6. Usuario 2 crea un board:**
```
POST http://localhost:5000/api/boards
Authorization: Bearer {{TOKEN_USER2}}
{
  "name": "Board Colaborativo",
  "description": "Creado por Usuario 2",
  "workspaceId": "{{WORKSPACE_ID}}"
}
```

**7. ✅ Usuario 1 ve el board automáticamente en tiempo real!**

---

## ✅ **Resumen:**

1. ✅ **Crear usuario con rol:** Agrega `"role": "admin"` al registrar
2. ✅ **Agregar miembro:** `POST /api/workspaces/:id/members` con email y role
3. ✅ **Ver workspaces compartidos:** El usuario verá automáticamente los workspaces donde es miembro
4. ✅ **Socket.IO:** Los cambios se sincronizan en tiempo real entre todos los miembros

---

**¡Ahora prueba agregando un miembro a tu workspace!** 🎯
