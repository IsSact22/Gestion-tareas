# ⚡ Quick Start - PostgreSQL con Prisma

## 🚀 Pasos Rápidos para Empezar

### 1. Instalar PostgreSQL localmente

**Windows:**
- Descarga desde: https://www.postgresql.org/download/windows/
- Instala con las opciones por defecto
- Recuerda el password del usuario `postgres`

**O usa Docker:**
```bash
docker run --name postgres-gestion -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

### 2. Crear base de datos

```sql
-- Conecta a PostgreSQL
psql -U postgres

-- Crea la base de datos
CREATE DATABASE gestion_tareas;

-- Sal
\q
```

### 3. Configurar .env

```env
DB_TYPE=postgres
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/gestion_tareas?schema=public"
```

### 4. Generar cliente Prisma

```bash
cd backend
npx prisma generate
```

### 5. Ejecutar migraciones

```bash
npx prisma migrate dev --name init
```

Esto creará todas las tablas en PostgreSQL.

### 6. (Opcional) Ver datos con Prisma Studio

```bash
npx prisma studio
```

Abre en: http://localhost:5555

### 7. Iniciar servidor

```bash
npm run dev
```

Deberías ver:
```
🟢 PostgreSQL Connected successfully
✅ Database connection verified
🗄️  Using POSTGRES repositories
🚀 Server running on port 5000
```

---

## 🔄 Volver a MongoDB

Cambia en `.env`:
```env
DB_TYPE=mongodb
DB_URL=mongodb://localhost:27017/gestion-tareas
```

Reinicia el servidor. ¡Listo!

---

## 📝 Próximos Pasos

1. Implementa los repositorios faltantes siguiendo `PRISMA_MIGRATION_GUIDE.md`
2. Prueba cada endpoint con Postman
3. Migra datos de MongoDB a PostgreSQL (si es necesario)
4. Despliega en Vercel

---

## 🆘 Problemas Comunes

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica el puerto (5432)
- Verifica usuario y password en DATABASE_URL

### Error: "Schema engine error"
- Ejecuta: `npx prisma generate`
- Luego: `npx prisma migrate dev`

### Error: "PrismaClient is not defined"
- Ejecuta: `npx prisma generate`
- Reinicia el servidor

---

¡Listo para desarrollar! 🎉
