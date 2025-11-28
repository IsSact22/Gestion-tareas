# Variables de Entorno para Vercel (Backend)

## Configuración en Vercel Dashboard

Ve a: **Settings → Environment Variables** y agrega:

```env
# Database - IMPORTANTE: Incluir pgbouncer=true para serverless
DATABASE_URL=postgres://postgres.opruaihydkoufbxhjgnk:auratasks2025@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1

DIRECT_URL=postgres://postgres.opruaihydkoufbxhjgnk:auratasks2025@aws-0-us-west-2.pooler.supabase.com:5432/postgres?sslmode=require

# JWT
JWT_SECRET=fcc742dce64710bd06eea12bad5dc7b04a7adbfabce89f9eaa646671984d89ba
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=https://auratask-phi.vercel.app

# Node Environment
NODE_ENV=production

# Database Type
DB_TYPE=postgres

# Port (Vercel lo asigna automáticamente, pero por si acaso)
PORT=5000
```

## Notas Importantes:

1. **`pgbouncer=true`**: Necesario para entornos serverless
2. **`connection_limit=1`**: Limita las conexiones por instancia serverless
3. **`sslmode=require`**: Requerido por Supabase
4. Todas las variables deben estar en **Production**, **Preview** y **Development**
