# 🧪 Prueba de Socket.IO - Guía Paso a Paso

## ✅ **Problema Identificado y Solucionado**

**Problema:** Los eventos Socket.IO no se emitían cuando se creaban boards desde Postman o desde el frontend porque los controladores del backend no estaban configurados para emitir eventos.

**Solución:** Se actualizaron los controladores de `boardController.js` y `workspaceController.js` para emitir eventos Socket.IO automáticamente cuando se crea, actualiza o elimina un board/workspace.

---

## 🚀 **Cómo Probar Ahora**

### **Paso 1: Reiniciar el Backend**

El backend necesita reiniciarse para cargar los cambios en los controladores:

```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 Server running on port 5000
📊 Environment: development
🔌 Socket.IO initialized
```

---

### **Paso 2: Abrir 2 Navegadores**

1. **Navegador 1:** Chrome normal
2. **Navegador 2:** Chrome en modo incógnito (o Firefox)

---

### **Paso 3: Iniciar Sesión en Ambos**

- **Navegador 1:** Inicia sesión con `isaac@gmail.com`
- **Navegador 2:** Inicia sesión con `isaac.tovar@gmail.com`

---

### **Paso 4: Ir a la Página de Boards**

En ambos navegadores, ve a:
```
http://localhost:3000/boards
```

---

### **Paso 5: Abrir la Consola del Navegador**

En ambos navegadores:
- Presiona `F12` o `Ctrl+Shift+I`
- Ve a la pestaña **Console**

Deberías ver:
```
✅ Conectado a Socket.IO: socket-id-abc123
```

---

### **Paso 6: Crear un Board**

**En el Navegador 1:**
1. Click en **"Nuevo Board"**
2. Llena el formulario:
   - Nombre: `Test Socket.IO`
   - Workspace: Selecciona uno
   - Descripción: `Probando tiempo real`
   - Color: Elige uno
3. Click en **"Crear Board"**

---

### **Paso 7: Verificar en el Navegador 2**

**✅ El board debería aparecer automáticamente en el Navegador 2!**

En la consola del Navegador 2 deberías ver:
```
📋 Board actualizado en tiempo real: { board: {...}, userId: "...", timestamp: "..." }
```

---

### **Paso 8: Probar con Postman**

1. Abre Postman
2. Crea una petición POST:
   ```
   POST http://localhost:5000/api/boards
   ```

3. Headers:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   Content-Type: application/json
   ```

4. Body (JSON):
   ```json
   {
     "name": "Board desde Postman",
     "description": "Probando Socket.IO",
     "workspaceId": "TU_WORKSPACE_ID"
   }
   ```

5. **Envía la petición**

**✅ El board debería aparecer automáticamente en AMBOS navegadores!**

---

## 🔍 **Qué Verificar**

### **En el Backend (Terminal):**
```
✅ Usuario conectado: 123456 (socket-id-abc)
📋 Usuario 123456 se unió al board board-id-xyz
✨ Board creado, emitiendo evento Socket.IO...
```

### **En el Frontend (Consola del Navegador):**
```
✅ Conectado a Socket.IO: socket-id-abc
📋 Board actualizado en tiempo real: { board: {...} }
```

### **En la UI:**
- ✅ El board aparece sin necesidad de refrescar la página
- ✅ El contador de boards se actualiza automáticamente
- ✅ Toast notification: "Conectado en tiempo real"

---

## 🐛 **Troubleshooting**

### **Problema 1: No se conecta Socket.IO**

**Síntomas:**
- No aparece "✅ Conectado a Socket.IO" en la consola
- Los cambios no se sincronizan

**Solución:**
1. Verifica que el backend esté corriendo en `http://localhost:5000`
2. Verifica que el frontend esté corriendo en `http://localhost:3000`
3. Verifica que tengas un token JWT válido (inicia sesión de nuevo)
4. Revisa la consola del backend para errores

---

### **Problema 2: Se conecta pero no se actualizan los boards**

**Síntomas:**
- Aparece "✅ Conectado a Socket.IO"
- Pero los boards no se actualizan automáticamente

**Solución:**
1. Verifica que ambos usuarios estén en el **mismo workspace**
2. Abre la consola del navegador y busca errores
3. Verifica que el backend esté emitiendo eventos (revisa la terminal del backend)

---

### **Problema 3: Error "Authentication error"**

**Síntomas:**
- Error en la consola: "Authentication error: Invalid token"

**Solución:**
1. Cierra sesión y vuelve a iniciar sesión
2. Verifica que el token JWT sea válido
3. Verifica que `config.jwtSecret` en el backend sea correcto

---

## 📊 **Eventos Implementados**

### **Boards:**
- ✅ `board:updated` - Cuando se crea o actualiza un board
- ✅ `board:deleted` - Cuando se elimina un board

### **Workspaces:**
- ✅ `workspace:updated` - Cuando se crea o actualiza un workspace

### **Próximamente:**
- ⏳ `task:created` - Cuando se crea una tarea
- ⏳ `task:updated` - Cuando se actualiza una tarea
- ⏳ `task:deleted` - Cuando se elimina una tarea
- ⏳ `task:moved` - Cuando se mueve una tarea (drag & drop)
- ⏳ `column:created` - Cuando se crea una columna
- ⏳ `user:joined` - Cuando un usuario se une al board
- ⏳ `typing:start` - Cuando un usuario empieza a escribir

---

## ✅ **Checklist de Pruebas**

- [ ] Backend reiniciado con los cambios
- [ ] Frontend corriendo en `http://localhost:3000`
- [ ] 2 navegadores abiertos con usuarios diferentes
- [ ] Ambos usuarios conectados a Socket.IO (ver consola)
- [ ] Crear board en navegador 1 → Aparece en navegador 2
- [ ] Editar board en navegador 1 → Se actualiza en navegador 2
- [ ] Eliminar board en navegador 1 → Desaparece en navegador 2
- [ ] Crear board desde Postman → Aparece en ambos navegadores
- [ ] Toast notification "Conectado en tiempo real" aparece

---

## 🎯 **Resultado Esperado**

Cuando crees un board en un navegador, deberías ver:

**Navegador 1 (donde creaste el board):**
- ✅ Toast: "Board creado exitosamente"
- ✅ El board aparece en la lista

**Navegador 2 (otro usuario):**
- ✅ El board aparece automáticamente (sin refrescar)
- ✅ Consola: "📋 Board actualizado en tiempo real"

**Backend (Terminal):**
- ✅ Log: "✨ Board creado, emitiendo evento Socket.IO..."

---

## 📝 **Notas Importantes**

1. **Los usuarios deben estar en el mismo workspace** para ver los cambios
2. **Socket.IO se conecta automáticamente** al iniciar sesión
3. **Los eventos se emiten desde el backend**, no desde el frontend
4. **La reconexión es automática** si se pierde la conexión

---

**¡Ahora prueba y verás la magia del tiempo real! 🎉**
