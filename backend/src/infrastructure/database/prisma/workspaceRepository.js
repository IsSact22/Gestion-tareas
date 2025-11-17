import prisma from './client.js';

/**
 * WorkspaceRepository con Prisma
 * Implementa la misma interfaz que el WorkspaceRepository de MongoDB
 */
export default class WorkspaceRepository {
  /**
   * Buscar workspace por ID con relaciones
   */
  async findById(id) {
    return prisma.workspace.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              }
            }
          }
        },
        boards: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
  }

  /**
   * Obtener todos los workspaces
   */
  async findAll() {
    return prisma.workspace.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              }
            }
          }
        },
        boards: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Buscar workspaces por usuario (owner o miembro)
   */
  async findByUserId(userId) {
    return prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              }
            }
          }
        },
        boards: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Crear workspace
   */
  async create(data) {
    return prisma.workspace.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.owner,
        members: {
          create: data.members?.map(member => ({
            userId: member.user,
            role: member.role,
            joinedAt: member.joinedAt || new Date(),
          })) || []
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              }
            }
          }
        }
      }
    });
  }

  /**
   * Actualizar workspace
   */
  async update(id, data) {
    return prisma.workspace.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              }
            }
          }
        }
      }
    });
  }

  /**
   * Eliminar workspace
   */
  async delete(id) {
    return prisma.workspace.delete({
      where: { id }
    });
  }

  /**
   * Agregar miembro al workspace
   */
  async addMember(workspaceId, userId, role = 'member') {
    // Verificar si ya existe
    const existing = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId
        }
      }
    });

    if (existing) {
      throw new Error('User is already a member of this workspace');
    }

    // Crear miembro
    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      }
    });

    // Retornar workspace actualizado
    return this.findById(workspaceId);
  }

  /**
   * Remover miembro del workspace
   */
  async removeMember(workspaceId, userId) {
    await prisma.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId
        }
      }
    });

    // Retornar workspace actualizado
    return this.findById(workspaceId);
  }

  /**
   * Actualizar rol de miembro
   */
  async updateMemberRole(workspaceId, userId, newRole) {
    await prisma.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId
        }
      },
      data: {
        role: newRole
      }
    });

    // Retornar workspace actualizado
    return this.findById(workspaceId);
  }
}
