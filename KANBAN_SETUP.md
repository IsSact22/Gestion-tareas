# 🎯 Setup del Sistema Kanban

## 📦 **Dependencias Necesarias**

Ejecuta este comando en el frontend:

```bash
cd frontend
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Librerías:**
- `@dnd-kit/core` - Core de drag & drop
- `@dnd-kit/sortable` - Para listas ordenables
- `@dnd-kit/utilities` - Utilidades para drag & drop

---

## ✅ **Ya Creado:**

1. ✅ **Servicios API:**
   - `frontend/src/services/columnService.ts`
   - `frontend/src/services/taskService.ts`

2. ✅ **Stores de Zustand:**
   - `frontend/src/store/columnStore.ts`
   - `frontend/src/store/taskStore.ts`

---

## 📋 **Próximos Pasos:**

1. Instalar dependencias de drag & drop
2. Crear página de detalle del Board (`/boards/[id]`)
3. Crear componentes de Kanban:
   - `KanbanBoard` - Contenedor principal
   - `KanbanColumn` - Columna individual
   - `TaskCard` - Tarjeta de tarea
4. Implementar drag & drop
5. Crear modales para crear/editar tasks y columns
6. Integrar Socket.IO para sincronización en tiempo real

---

**Ejecuta el comando de instalación y avísame cuando esté listo!** 🚀
