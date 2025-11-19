import { PrismaClient } from '@prisma/client';

// Crear instancia única de Prisma Client (Singleton)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Manejo de desconexión graceful
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
