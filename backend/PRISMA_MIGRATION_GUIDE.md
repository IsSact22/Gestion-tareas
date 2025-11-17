# 🚀 Guía de Migración a PostgreSQL con Prisma

Esta guía te ayudará a completar la implementación de la arquitectura dual MongoDB + PostgreSQL.

## 📁 Estructura Implementada

```
backend/
├── prisma/
│   └── schema.prisma              ✅ Schema completo de PostgreSQL
├── src/
│   ├── config/
│   │   ├── database.js            ✅ Conexión dual (MongoDB/PostgreSQL)
│   │   └── index.js               ✅ Configuración actualizada
│   └── infrastructure/
│       └── database/
│           ├── mongo/             ✅ Repositorios MongoDB (existentes)
│           ├── prisma/
│           │   ├── client.js      ✅ Cliente Prisma
│           │   ├── userRepository.js        ✅ EJEMPLO COMPLETO
│           │   ├── workspaceRepository.js   ✅ EJEMPLO COMPLETO
│           │   ├── boardRepository.js       ⚠️ POR IMPLEMENTAR
│           │   ├── columnRepository.js      ⚠️ POR IMPLEMENTAR
│           │   ├── taskRepository.js        ⚠️ POR IMPLEMENTAR
│           │   ├── activityRepository.js    ⚠️ POR IMPLEMENTAR
│           │   └── notificationRepository.js ⚠️ POR IMPLEMENTAR
│           └── repositoryFactory.js ✅ Factory pattern
```

## 🎯 Repositorios Completados (Ejemplos)

### ✅ UserRepository
- Ubicación: `src/infrastructure/database/prisma/userRepository.js`
- Métodos implementados:
  - `findById(id)`
  - `findByIdWithPassword(id)`
  - `findByEmail(email)`
  - `findByEmailWithPassword(email)`
  - `findAll()`
  - `create(data)`
  - `update(id, data)`
  - `delete(id)`
  - `search(query)`

### ✅ WorkspaceRepository
- Ubicación: `src/infrastructure/database/prisma/workspaceRepository.js`
- Métodos implementados:
  - `findById(id)`
  - `findAll()`
  - `findByUserId(userId)`
  - `create(data)`
  - `update(id, data)`
  - `delete(id)`
  - `addMember(workspaceId, userId, role)`
  - `removeMember(workspaceId, userId)`
  - `updateMemberRole(workspaceId, userId, newRole)`

## 📝 Tareas Pendientes

### 1️⃣ Implementar BoardRepository

Crea: `src/infrastructure/database/prisma/boardRepository.js`

**Referencia MongoDB:** `src/infrastructure/database/mongo/boardRepository.js`

**Métodos a implementar:**
```javascript
class BoardRepository {
  async findById(id) { }
  async findAll() { }
  async findByWorkspaceId(workspaceId) { }
  async findByUserId(userId) { }
  async create(data) { }
  async update(id, data) { }
  async delete(id) { }
  async addMember(boardId, userId, role) { }
  async removeMember(boardId, userId) { }
}
```

**Tips:**
- Usa `prisma.board.findUnique()` para buscar por ID
- Incluye relaciones con `include: { workspace: true, members: { include: { user: true } } }`
- Para `findByUserId`, usa `where: { OR: [{ workspace: { ownerId: userId } }, { members: { some: { userId } } }] }`

---

### 2️⃣ Implementar ColumnRepository

Crea: `src/infrastructure/database/prisma/columnRepository.js`

**Referencia MongoDB:** `src/infrastructure/database/mongo/columnRepository.js`

**Métodos a implementar:**
```javascript
class ColumnRepository {
  async findById(id) { }
  async findByBoardId(boardId) { }
  async create(data) { }
  async update(id, data) { }
  async delete(id) { }
  async reorder(boardId, columnOrders) { }
}
```

**Tips:**
- Usa `orderBy: { order: 'asc' }` para ordenar columnas
- En `reorder`, usa transacciones: `prisma.$transaction()`

---

### 3️⃣ Implementar TaskRepository

Crea: `src/infrastructure/database/prisma/taskRepository.js`

**Referencia MongoDB:** `src/infrastructure/database/mongo/taskRepository.js`

**Métodos a implementar:**
```javascript
class TaskRepository {
  async findById(id) { }
  async findAll() { }
  async findByColumnId(columnId) { }
  async findByBoardId(boardId) { }
  async create(data) { }
  async update(id, data) { }
  async delete(id) { }
  async move(taskId, newColumnId, newOrder) { }
  async search(query, boardId) { }
  async addComment(taskId, commentData) { }
  async deleteComment(commentId) { }
}
```

**Tips:**
- Incluye relaciones: `include: { assignee: true, creator: true, comments: { include: { user: true } } }`
- Para `search`, usa `where: { AND: [{ column: { boardId } }, { OR: [{ title: { contains: query } }, { description: { contains: query } }] }] }`
- Los comentarios son un modelo separado en Prisma

---

### 4️⃣ Implementar ActivityRepository

Crea: `src/infrastructure/database/prisma/activityRepository.js`

**Referencia MongoDB:** `src/infrastructure/database/mongo/activityRepository.js`

**Métodos a implementar:**
```javascript
class ActivityRepository {
  async create(data) { }
  async findByBoardId(boardId, limit) { }
  async findByUserId(userId, limit) { }
}
```

**Tips:**
- Usa `orderBy: { createdAt: 'desc' }` para actividades recientes
- El campo `metadata` es de tipo `Json` en Prisma

---

### 5️⃣ Implementar NotificationRepository

Crea: `src/infrastructure/database/prisma/notificationRepository.js`

**Referencia MongoDB:** `src/infrastructure/database/mongo/notificationRepository.js`

**Métodos a implementar:**
```javascript
class NotificationRepository {
  async create(data) { }
  async findByUserId(userId) { }
  async markAsRead(id) { }
  async markAllAsRead(userId) { }
  async delete(id) { }
}
```

---

### 6️⃣ Actualizar repositoryFactory.js

Una vez implementados todos los repositorios, descomenta las importaciones en:
`src/infrastructure/database/repositoryFactory.js`

```javascript
// Descomentar estas líneas:
import PrismaBoardRepository from './prisma/boardRepository.js';
import PrismaColumnRepository from './prisma/columnRepository.js';
import PrismaTaskRepository from './prisma/taskRepository.js';
import PrismaActivityRepository from './prisma/activityRepository.js';
import PrismaNotificationRepository from './prisma/notificationRepository.js';

// Y en cada método, descomentar:
getBoardRepository() {
  if (this.dbType === 'postgres') {
    return new PrismaBoardRepository(); // Descomentar
  }
  return new MongoBoardRepository();
}
```

---

## 🔧 Configuración de Variables de Entorno

### Para MongoDB (actual)
```env
DB_TYPE=mongodb
DB_URL=mongodb://localhost:27017/gestion-tareas
```

### Para PostgreSQL
```env
DB_TYPE=postgres
DATABASE_URL="postgresql://usuario:password@localhost:5432/gestion_tareas?schema=public"
```

### Para Vercel (Producción)
```env
DB_TYPE=postgres
DATABASE_URL="postgresql://..." # Vercel Postgres URL
```

---

## 🚀 Comandos Prisma

### Generar cliente Prisma
```bash
npx prisma generate
```

### Crear migración
```bash
npx prisma migrate dev --name init
```

### Aplicar migraciones en producción
```bash
npx prisma migrate deploy
```

### Abrir Prisma Studio (GUI)
```bash
npx prisma studio
```

### Seed de datos (opcional)
```bash
npx prisma db seed
```

---

## 📊 Diferencias Clave MongoDB vs Prisma

### MongoDB (Mongoose)
```javascript
// Populate manual
.populate('owner', 'name email')
.populate('members.user', 'name email')

// Búsqueda con regex
{ name: { $regex: query, $options: 'i' } }

// Array push/pull
{ $push: { members: { user: userId } } }
```

### PostgreSQL (Prisma)
```javascript
// Include automático
include: {
  owner: { select: { name: true, email: true } },
  members: { include: { user: true } }
}

// Búsqueda con contains
{ name: { contains: query, mode: 'insensitive' } }

// Crear relación
members: { create: [{ userId, role }] }
```

---

## ✅ Checklist de Implementación

- [x] Instalar Prisma
- [x] Crear schema.prisma
- [x] Crear cliente Prisma
- [x] Implementar UserRepository
- [x] Implementar WorkspaceRepository
- [ ] Implementar BoardRepository
- [ ] Implementar ColumnRepository
- [ ] Implementar TaskRepository
- [ ] Implementar ActivityRepository
- [ ] Implementar NotificationRepository
- [ ] Actualizar repositoryFactory.js
- [ ] Probar con PostgreSQL local
- [ ] Migrar datos de MongoDB a PostgreSQL
- [ ] Desplegar en Vercel

---

## 🎓 Recursos de Aprendizaje

- **Prisma Docs**: https://www.prisma.io/docs
- **Prisma Schema**: https://www.prisma.io/docs/concepts/components/prisma-schema
- **Prisma Client**: https://www.prisma.io/docs/concepts/components/prisma-client
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres

---

## 💡 Tips de Implementación

1. **Sigue el patrón de UserRepository y WorkspaceRepository**
2. **Mantén la misma interfaz** que los repositorios MongoDB
3. **Usa transacciones** para operaciones complejas: `prisma.$transaction()`
4. **Prueba cada repositorio** antes de continuar con el siguiente
5. **Usa Prisma Studio** para visualizar datos: `npx prisma studio`

---

## 🐛 Debugging

### Error: "PrismaClient is unable to run in this browser environment"
- Asegúrate de que Prisma solo se use en el backend

### Error: "Invalid `prisma.xxx.findUnique()` invocation"
- Verifica que el ID sea válido (UUID en PostgreSQL)

### Error: "Unique constraint failed"
- Verifica que no existan duplicados antes de crear

---

## 📞 Soporte

Si tienes dudas, revisa:
1. Los repositorios MongoDB existentes
2. Los ejemplos de UserRepository y WorkspaceRepository
3. La documentación de Prisma
4. El schema.prisma para ver las relaciones

¡Éxito con la implementación! 🚀
