# 🔐 Variables de Entorno

Copia este contenido en tu archivo `.env`

## Para MongoDB (Configuración Actual)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos
DB_TYPE=mongodb
DB_URL=mongodb://localhost:27017/gestion-tareas

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## Para PostgreSQL (Nueva Configuración)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos
DB_TYPE=postgres
DATABASE_URL="postgresql://usuario:password@localhost:5432/gestion_tareas?schema=public"

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## Para Vercel (Producción)

```env
# Servidor
NODE_ENV=production

# Base de Datos (Vercel Postgres)
DB_TYPE=postgres
DATABASE_URL="postgresql://..." # Se genera automáticamente en Vercel

# JWT
JWT_SECRET=tu_secreto_super_seguro_en_produccion
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=https://tu-app.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 🔄 Cambiar entre Bases de Datos

Solo cambia la variable `DB_TYPE`:
- `DB_TYPE=mongodb` → Usa MongoDB
- `DB_TYPE=postgres` → Usa PostgreSQL

El código se adapta automáticamente gracias al Factory Pattern.
