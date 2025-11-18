# 🚀 PRÓXIMOS PASOS - Migración PostgreSQL

## ✅ LO QUE SE HA HECHO

1. ✅ Eliminado sistema dual MongoDB/PostgreSQL
2. ✅ Todos los controllers actualizados
3. ✅ Middleware actualizado
4. ✅ Use cases simplificados (puede haber errores menores)
5. ✅ MongoDB movido a `legacy/mongo/`

---

## 🔧 PASO 1: VERIFICAR Y CORREGIR SINTAXIS

### Opción A: Usar Linter
```bash
cd backend
npm run lint
```

### Opción B: Revisar Manualmente
Buscar archivos con posibles errores:
```bash
# Buscar archivos con sintaxis incorrecta
grep -r "^[[:space:]]*return m\.userId === userId;" src/application/
```

### Errores Comunes a Buscar:
1. **Objetos sin cerrar:** Falta `});`
2. **Funciones arrow rotas:** Líneas sueltas con `return`
3. **Comparaciones duplicadas:** `m.userId === userId` repetido

---

## 🧪 PASO 2: PROBAR EL BACKEND

### 1. Iniciar el Servidor
```bash
cd backend
npm run dev
```

**Deberías ver:**
```
🟢 PostgreSQL Connected successfully
✅ Database connection verified
🚀 Server running on port 5000
```

### 2. Probar Endpoints Básicos

#### Auth
```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Workspaces
```bash
# Crear workspace (necesita token)
POST http://localhost:5000/api/workspaces
Authorization: Bearer <token>
{
  "name": "Mi Workspace",
  "description": "Test"
}

# Listar workspaces
GET http://localhost:5000/api/workspaces
Authorization: Bearer <token>
```

#### Boards
```bash
# Crear board
POST http://localhost:5000/api/boards
Authorization: Bearer <token>
{
  "name": "Mi Board",
  "workspaceId": "<workspace-id>",
  "color": "#8B5CF6"
}
```

### 3. Verificar Logs
Si hay errores, aparecerán en la consola. Buscar:
- ❌ `Cannot read properties of undefined`
- ❌ `SyntaxError`
- ❌ `is not a function`

---

## 🎨 PASO 3: ACTUALIZAR FRONTEND

### Cambios Necesarios:

#### 1. Servicios (`src/services/*.ts`)
```typescript
// ❌ ANTES
const id = entity._id || entity.id;

// ✅ DESPUÉS
const id = entity.id;
```

#### 2. Componentes
```typescript
// ❌ ANTES
<div key={task._id}>

// ✅ DESPUÉS
<div key={task.id}>
```

#### 3. Interfaces TypeScript
```typescript
// ❌ ANTES
export interface Task {
  _id: string;
  id?: string;
  // ...
}

// ✅ DESPUÉS
export interface Task {
  id: string;
  // ...
}
```

### Archivos Principales a Actualizar:
- `src/services/boardService.ts`
- `src/services/taskService.ts`
- `src/services/columnService.ts`
- `src/services/workspaceService.ts`
- `src/components/kanban/TaskCard.tsx`
- `src/components/kanban/Column.tsx`
- `src/types/*.ts`

---

## 📋 PASO 4: PROBAR FLUJO COMPLETO

### Flujo de Prueba:
1. ✅ Registrar usuario
2. ✅ Iniciar sesión
3. ✅ Crear workspace
4. ✅ Crear board
5. ✅ Crear columnas
6. ✅ Crear tareas
7. ✅ Mover tareas
8. ✅ Agregar comentarios
9. ✅ Ver actividades

### Verificar:
- ✅ No hay errores en consola
- ✅ Los IDs se muestran correctamente
- ✅ Las relaciones funcionan (board → columns → tasks)
- ✅ Los usuarios asignados se muestran
- ✅ Socket.IO funciona (actualizaciones en tiempo real)

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Cannot read properties of undefined (reading 'some')"
**Causa:** `board.members` es undefined  
**Solución:** Verificar que el BoardRepository incluye `members` en el `include`

### Error: "m.userId is undefined"
**Causa:** BoardMember no tiene `userId` poblado  
**Solución:** Verificar schema de Prisma y relaciones

### Error: "task.boardId is undefined"
**Causa:** Task no tiene `boardId` en el schema  
**Solución:** Ya está en el schema, verificar migración

### Error: "assignedTo.map is not a function"
**Causa:** Frontend espera array pero recibe objeto  
**Solución:** Ya corregido en TaskRepository con `_transformTask()`

---

## ✅ CHECKLIST FINAL

Antes de hacer merge a main:

- [ ] Backend inicia sin errores
- [ ] Todos los endpoints responden correctamente
- [ ] Frontend se conecta al backend
- [ ] Se pueden crear workspaces
- [ ] Se pueden crear boards
- [ ] Se pueden crear columnas
- [ ] Se pueden crear tareas
- [ ] Se pueden mover tareas
- [ ] Los usuarios asignados se muestran correctamente
- [ ] Las actividades se registran
- [ ] No hay errores en consola (backend y frontend)

---

## 🎯 RESULTADO ESPERADO

**Backend:**
- ✅ Solo PostgreSQL/Prisma
- ✅ Código limpio sin condicionales
- ✅ Imports directos
- ✅ Sin `toStringId()`

**Frontend:**
- ✅ Solo usa `id`
- ✅ Sin lógica de compatibilidad
- ✅ Tipos TypeScript correctos

---

## 📞 SI ENCUENTRAS ERRORES

1. **Revisa el archivo específico** que da error
2. **Busca patrones similares** en otros archivos corregidos
3. **Verifica el schema de Prisma** para relaciones
4. **Consulta `MIGRATION_STATUS_FINAL.md`** para referencia

---

**¡Éxito con la migración!** 🚀
