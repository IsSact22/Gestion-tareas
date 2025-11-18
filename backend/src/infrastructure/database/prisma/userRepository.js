import prisma from "./client.js";
import bcrypt from "bcryptjs";

/**
 * UserRepository con Prisma
 * Implementa la misma interfaz que el UserRepository de MongoDB
 * para mantener compatibilidad con los Use Cases
 */
export default class UserRepository {
  /**
   * Buscar usuario por ID (sin password)
   */
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // password: false (excluido por defecto)
      }
    });
  }

  /**
   * Buscar usuario por ID (con password)
   */
  async findByIdWithPassword(id) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  /**
   * Buscar usuario por email (sin password)
   */
  async findByEmail(email) {
    if (!email) {
        console.error("Error: findByEmail llamado sin email.");
        return null; // Retorna null si no se proporciona email
    }
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  /**
   * Buscar usuario por email (con password)
   */
  async findByEmailWithPassword(email) {
    if (!email) {
        console.error("Error: findByEmailWithPassword llamado sin email.");
        return null; // Retorna null si no se proporciona email
    }
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    // Agregar método comparePassword para compatibilidad con MongoDB
    user.comparePassword = async function(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    };

    return user;
  }

  /**
   * Obtener todos los usuarios (sin password)
   */
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Crear usuario
   */
  async create(data) {
    // Hashear password antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        avatar: data.avatar,
        role: data.role || 'member',
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  /**
   * Actualizar usuario
   */
  async update(id, data) {
    // Si se está actualizando la contraseña, hashearla primero
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.password && { password: data.password }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.role && { role: data.role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  /**
   * Eliminar usuario
   */
  async delete(id) {
    return prisma.user.delete({
      where: { id }
    });
  }

  /**
   * Buscar usuarios por query (nombre o email)
   */
  async search(query) {
    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 10
    });
  }
}
