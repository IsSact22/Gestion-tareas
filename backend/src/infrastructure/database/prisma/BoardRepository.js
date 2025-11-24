import prisma from "./client.js";


export default class BoardRepository {
    /**
   * Buscar board por ID con relaciones
   */
    async findById(id) {
        if (!id) {
            console.error("Error: Se intentó buscar un Board sin ID");
            return null; // O lanza un error: throw new Error("Board ID is required");
        }
        return prisma.board.findUnique({
            where: { id },
            include: {
                workspace: true,
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
                columns: true
            }
        });
    }
    /**
   * Obtener todos los boards
   */
    async findAll() {
        return prisma.board.findMany({
            include: {
                workspace: true,
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
                columns: true
            }
        });
    }
    /**
   * Buscar boards por workspace
   */
    async findByWorkspaceId(workspaceId) {
        return prisma.board.findMany({
            where: { workspaceId },
            include: {
                workspace: true,
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
                columns: true
            }
        });
    }
    /**
   * Buscar boards por usuario
   */
    async findByUserId(userId) {
        return prisma.board.findMany({
            where: {
                members: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                workspace: true,
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
                columns: true
            }
        });
    }
    /**
   * Crear board
   */
    async create(data) {
        return prisma.board.create({
            data: {
                name: data.name,
                description: data.description,
                color: data.color || '#8B5CF6',
                workspaceId: data.workspace,
                members: {
                    create: data.members?.map(member => ({
                        userId: member.user,
                        role: member.role,
                        joinedAt: member.joinedAt || new Date(),
                    })) || []
                }
            },
            include: {
                workspace: true,
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
                columns: true
            }
        });
    }
    /**
   * Actualizar board
   */
    async update(id, data) {
        return prisma.board.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.color && { color: data.color }),
            },
            include: {
                workspace: true,
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
                columns: true
            }
        });
    }
    /**
   * Eliminar board
   */
    async delete(id) {
        return prisma.board.delete({
            where: { id }
        });
    }
    /**
   * Agregar miembro al board
   */
    async addMember(boardId, userId, role = 'member') {
        const existing = await prisma.boardMember.findUnique({
            where: {
                boardId_userId: {
                    boardId,
                    userId
                }
            }
        });
        
        if (existing) {
            throw new Error('User is already a member of this board');
        }
        
        await prisma.boardMember.create({
            data: {
                boardId,
                userId,
                role,
            }
        });
        
        return this.findById(boardId);
    }
    /**
   * Agregar columna al board
   */
    async addColumn(boardId, columnId) {
        return prisma.board.update({
            where: { id: boardId },
            data: {
                columns: {
                    connect: { id: columnId }
                }
            }
        });
    }
    /**
   * Remover columna del board
   */
    async removeColumn(boardId, columnId) {
        return prisma.board.update({
            where: { id: boardId },
            data: {
                columns: {
                    disconnect: { id: columnId }
                }
            }
        });
    }
    /**
   * Reordenar columnas del board
   */
    async reorderColumns(boardId, newOrder) {
        return prisma.board.update({
            where: { id: boardId },
            data: {
                columns: newOrder
            }
        });
    }
    /**
   * Remover miembro del board
   */
    async removeMember(boardId, userId) {
        return prisma.boardMember.delete({
            where: { boardId_userId: { boardId, userId } }
        });
    }
}
