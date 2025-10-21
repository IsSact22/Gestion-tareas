# 🎨 Frontend - Kanban Pro

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno

El archivo `.env` ya está configurado con:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

---

## 📁 Estructura Creada

```
frontend/src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/
│   │   └── page.tsx          # Página de login
│   ├── register/
│   │   └── page.tsx          # Página de registro
│   ├── layout.tsx            # Layout global
│   └── globals.css           # Estilos globales
│
├── components/
│   └── ui/
│       ├── Button.tsx        # Componente Button
│       ├── Input.tsx         # Componente Input
│       └── Card.tsx          # Componente Card
│
├── lib/
│   ├── api.ts                # Cliente Axios configurado
│   └── utils.ts              # Utilidades (cn)
│
└── store/
    └── authStore.ts          # Store de autenticación (Zustand)
```

---

## 🎨 Páginas Implementadas

### 1. Landing Page (`/`)
- Hero section con gradiente
- Features destacadas
- Lista de beneficios
- Call to action
- Navegación a login/register

### 2. Login (`/login`)
- Formulario de inicio de sesión
- Validación de campos
- Integración con API
- Opción de "Recordarme"
- Links a registro y recuperación de contraseña
- Botones de login social (Google, GitHub)
- Toast notifications
- Loading states

### 3. Register (`/register`)
- Formulario de registro completo
- Validación en tiempo real
- Confirmación de contraseña
- Términos y condiciones
- Integración con API
- Botones de registro social
- Toast notifications
- Loading states

---

## 🎯 Flujo de Autenticación

### Registro de Usuario

1. Usuario completa el formulario en `/register`
2. Se validan los campos (nombre, email, contraseña)
3. Se envía POST a `/api/auth/register`
4. El token JWT se guarda en cookies (7 días)
5. El usuario se guarda en Zustand store
6. Redirección a `/dashboard`

### Login

1. Usuario ingresa email y contraseña en `/login`
2. Se envía POST a `/api/auth/login`
3. El token JWT se guarda en cookies
4. El usuario se guarda en Zustand store
5. Redirección a `/dashboard`

### Persistencia

- El token se guarda en cookies con `js-cookie`
- Expira en 7 días
- Se envía automáticamente en cada request (interceptor de Axios)
- Si el token expira, se redirige a `/login`

---

## 🛠️ Tecnologías Utilizadas

### Core
- **Next.js 15** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos

### Estado y Datos
- **Zustand** - State management
- **Axios** - Cliente HTTP
- **js-cookie** - Manejo de cookies

### UI/UX
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones
- **clsx + tailwind-merge** - Utilidades de clases

---

## 🎨 Diseño

### Paleta de Colores

- **Primary (Blue):** `#2563EB` (blue-600)
- **Secondary (Purple):** `#9333EA` (purple-600)
- **Success (Green):** `#10B981` (green-500)
- **Error (Red):** `#EF4444` (red-500)
- **Warning (Orange):** `#F59E0B` (orange-500)

### Gradientes

- Landing: `from-blue-50 via-white to-purple-50`
- Login: `from-blue-50 via-white to-purple-50`
- Register: `from-purple-50 via-white to-blue-50`

### Tipografía

- **Font:** Inter (Google Fonts)
- **Headings:** Bold, 24px-60px
- **Body:** Regular, 14px-18px

---

## 🧪 Probar el Sistema de Autenticación

### 1. Iniciar Backend

```bash
cd backend
npm run dev
```

### 2. Iniciar Frontend

```bash
cd frontend
npm run dev
```

### 3. Flujo de Prueba

1. Abre http://localhost:3000
2. Click en "Comenzar Gratis" o "Regístrate gratis"
3. Completa el formulario de registro:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: password123
   - Confirmar contraseña: password123
4. Click en "Crear Cuenta"
5. Deberías ver un toast de éxito
6. Serás redirigido a `/dashboard` (próximamente)

### 4. Probar Login

1. Ve a http://localhost:3000/login
2. Ingresa las credenciales:
   - Email: tu@email.com
   - Contraseña: password123
3. Click en "Iniciar Sesión"
4. Deberías ver un toast de bienvenida
5. Serás redirigido a `/dashboard`

---

## 🔐 Seguridad

### Tokens JWT

- Se guardan en cookies HTTP-only (próximamente)
- Expiran en 7 días
- Se envían en header `Authorization: Bearer {token}`

### Validaciones

- **Frontend:** Validación en tiempo real
- **Backend:** Validación con Joi/Express-validator
- **Passwords:** Mínimo 6 caracteres
- **Email:** Formato válido

### Protección de Rutas

- Middleware de autenticación en el backend
- Interceptor de Axios para agregar token
- Redirección automática si no hay token

---

## 📱 Responsive Design

Todas las páginas son completamente responsive:

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

---

## 🎯 Próximos Pasos

1. ✅ **Sistema de Autenticación** - Completado
2. ⏳ **Dashboard** - Próximamente
3. ⏳ **Workspaces** - Próximamente
4. ⏳ **Boards** - Próximamente
5. ⏳ **Kanban con Drag & Drop** - Próximamente
6. ⏳ **WebSockets** - Próximamente

---

## 🐛 Troubleshooting

### Error: "Cannot find module"

```bash
cd frontend
npm install
```

### Error: "Network Error"

- Verifica que el backend esté corriendo en puerto 5000
- Verifica la URL en `.env`: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

### Error: "Unauthorized"

- El token puede haber expirado
- Intenta hacer login nuevamente
- Verifica que el backend esté funcionando

### Estilos no se aplican

```bash
# Reinicia el servidor
npm run dev
```

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/)

---

¡Listo para desarrollar! 🚀
