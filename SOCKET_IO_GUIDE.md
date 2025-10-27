# 🔌 Socket.IO - Guía de Implementación

## ✅ ¡Tiempo Real Implementado!

La aplicación ahora cuenta con **actualizaciones en tiempo real** usando Socket.IO. Los cambios se sincronizan automáticamente entre todos los usuarios conectados.

---

## 🚀 **Cómo Funciona**

### **Backend (Node.js + Socket.IO)**
- Servidor Socket.IO inicializado en `backend/src/socket/index.js`
- Autenticación JWT para cada conexión
- Rooms/Namespaces para organizar eventos por board/workspace

### **Frontend (React + Socket.IO Client)**
- Servicio centralizado en `frontend/src/services/socketService.ts`
- Hook personalizado `useSocket()` para conexión automática
- Integración en stores de Zustand

---

## 📡 **Eventos Implementados**

### **Workspaces**
```typescript
// Unirse a un workspace
socket.joinWorkspace(workspaceId);

// Escuchar actualizaciones
socket.onWorkspaceUpdated((data) => {
  console.log('Workspace actualizado:', data);
});
```

### **Boards**
```typescript
// Unirse a un board
socket.joinBoard(boardId);

// Emitir actualización
socket.emitBoardUpdated(boardId, board, workspaceId);

// Escuchar actualizaciones
socket.onBoardUpdated((data) => {
  console.log('Board actualizado:', data);
});

// Ver quién se unió
socket.onUserJoined((data) => {
  console.log(`${data.userEmail} se unió al board`);
});
```

### **Tasks (Próximamente)**
```typescript
// Crear tarea
socket.emitTaskCreated(boardId, task);

// Mover tarea (drag & drop)
socket.emitTaskMoved(boardId, taskId, fromColumn, toColumn, position);

// Escuchar cambios
socket.onTaskCreated((data) => {
  // Agregar tarea al estado
});

socket.onTaskMoved((data) => {
  // Actualizar posición de la tarea
});
```

### **Columns (Próximamente)**
```typescript
// Crear columna
socket.emitColumnCreated(boardId, column);

// Reordenar columnas
socket.emitColumnReordered(boardId, columns);

// Escuchar cambios
socket.onColumnCreated((data) => {
  // Agregar columna al estado
});
```

### **Typing Indicator (Próximamente)**
```typescript
// Indicar que estás escribiendo
socket.emitTypingStart(boardId, taskId);
socket.emitTypingStop(boardId, taskId);

// Escuchar quién está escribiendo
socket.onTypingStart((data) => {
  console.log(`${data.userEmail} está escribiendo...`);
});
```

---

## 🎯 **Uso en Componentes**

### **Opción 1: Hook Personalizado**
```typescript
import { useSocket } from '@/hooks/useSocket';

function MyComponent() {
  const socket = useSocket(); // Se conecta automáticamente

  useEffect(() => {
    // Escuchar eventos
    socket.onBoardUpdated((data) => {
      console.log('Board actualizado:', data);
    });

    // Cleanup
    return () => {
      socket.off('board:updated');
    };
  }, [socket]);

  return <div>...</div>;
}
```

### **Opción 2: Hook para Board Específico**
```typescript
import { useBoardSocket } from '@/hooks/useSocket';

function BoardPage({ boardId }) {
  const socket = useBoardSocket(boardId); // Se une automáticamente al board

  useEffect(() => {
    socket.onTaskCreated((data) => {
      toast.info(`Nueva tarea: ${data.task.title}`);
    });

    return () => {
      socket.off('task:created');
    };
  }, [socket]);

  return <div>...</div>;
}
```

### **Opción 3: Directamente en el Store**
```typescript
// Ya implementado en boardStore.ts
export const useBoardStore = create<BoardState>((set) => ({
  createBoard: async (data) => {
    const newBoard = await boardService.createBoard(data);
    
    // Emitir evento Socket.IO
    socketService.emitBoardUpdated(newBoard._id, newBoard, data.workspaceId);
    
    return newBoard;
  }
}));
```

---

## 🔧 **Configuración**

### **Variables de Entorno**

**Backend (.env):**
```env
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🧪 **Cómo Probar**

### **Prueba 1: Actualización de Boards**
1. Abre la aplicación en **2 navegadores diferentes** (o ventanas incógnito)
2. Inicia sesión con el mismo usuario en ambos
3. Ve a `/boards` en ambos navegadores
4. **Crea un board** en el navegador 1
5. ✅ **El board aparecerá automáticamente** en el navegador 2

### **Prueba 2: Edición de Boards**
1. Abre un board en 2 navegadores
2. **Edita el nombre** del board en el navegador 1
3. ✅ **El cambio se reflejará automáticamente** en el navegador 2

### **Prueba 3: Usuarios Conectados**
1. Abre un board en 2 navegadores
2. Mira la consola del navegador
3. ✅ Verás mensajes como: `"Usuario X se unió al board"`

---

## 📊 **Logs y Debugging**

### **Backend**
```bash
# Verás en la consola:
✅ Usuario conectado: 123456 (socket-id-abc)
📋 Usuario 123456 se unió al board board-id-xyz
✨ Tarea creada en board board-id-xyz
```

### **Frontend**
```javascript
// Abre la consola del navegador
✅ Conectado a Socket.IO: socket-id-abc
📋 Uniéndose al board: board-id-xyz
📋 Board actualizado en tiempo real: { board: {...} }
```

---

## 🎨 **Próximas Mejoras**

### **1. Indicadores de Presencia**
```typescript
// Ver quién está viendo el board
const [onlineUsers, setOnlineUsers] = useState([]);

socket.onUserJoined((data) => {
  setOnlineUsers(prev => [...prev, data.userId]);
});
```

### **2. Typing Indicator**
```typescript
// "Juan está escribiendo..."
const [typingUsers, setTypingUsers] = useState([]);

socket.onTypingStart((data) => {
  setTypingUsers(prev => [...prev, data.userEmail]);
});
```

### **3. Notificaciones Toast**
```typescript
socket.onTaskCreated((data) => {
  if (data.userId !== currentUserId) {
    toast.info(`${data.userEmail} creó una tarea`);
  }
});
```

### **4. Optimistic Updates**
```typescript
// Actualizar UI inmediatamente, luego confirmar con el servidor
const createTask = async (task) => {
  // 1. Actualizar UI inmediatamente
  addTaskToUI(task);
  
  // 2. Enviar al servidor
  const savedTask = await api.createTask(task);
  
  // 3. Emitir evento Socket.IO
  socket.emitTaskCreated(boardId, savedTask);
};
```

---

## 🔒 **Seguridad**

### **Autenticación**
- ✅ Cada conexión Socket.IO requiere un JWT válido
- ✅ El token se verifica en el middleware `authenticateSocket`
- ✅ Si el token es inválido, la conexión se rechaza

### **Autorización**
- ✅ Los usuarios solo pueden unirse a boards/workspaces donde son miembros
- ✅ Los eventos se emiten solo a usuarios en el mismo room

---

## 📚 **Recursos**

- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [Rooms and Namespaces](https://socket.io/docs/v4/rooms/)

---

## ✅ **Checklist de Implementación**

- [x] Instalar dependencias (socket.io + socket.io-client)
- [x] Configurar servidor Socket.IO en backend
- [x] Crear servicio de Socket.IO en frontend
- [x] Crear hooks personalizados (useSocket, useBoardSocket)
- [x] Integrar en stores (boardStore, workspaceStore)
- [x] Agregar listeners en componentes
- [x] Probar actualizaciones en tiempo real
- [ ] Implementar eventos de Tasks
- [ ] Implementar eventos de Columns
- [ ] Agregar indicadores de presencia
- [ ] Agregar typing indicators
- [ ] Agregar notificaciones toast personalizadas

---

**🎉 ¡Socket.IO está listo para usar!**

Ahora la aplicación se actualiza en tiempo real cuando múltiples usuarios están trabajando simultáneamente.
