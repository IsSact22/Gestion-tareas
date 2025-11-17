import prisma from "./client.js";

/**
 * ActivityRepository con Prisma
 * Implementa la misma interfaz que el ActivityRepository de MongoDB
 */
export default class ActivityRepository {
    /**
     * Buscar activity por ID
     */
    async findById(id) {
        return prisma.activity.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                board: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    /**
     * Obtener todas las activities
     */
    async findAll(limit = 50) {
        return prisma.activity.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                board: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
    }

    /**
     * Buscar activities por board
     */
    async findByBoardId(boardId, limit = 50) {
        return prisma.activity.findMany({
            where: { boardId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
    }

    /**
     * Buscar activities por usuario
     */
    async findByUserId(userId, limit = 50) {
        return prisma.activity.findMany({
            where: { userId },
            include: {
                board: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
    }

    /**
     * Buscar activities por taskId
     */
    async findByEntityId(taskId, limit = 20) {
        return prisma.activity.findMany({
            where: { taskId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
    }

    /**
     * Crear activity
     */
    async create(data) {
        return prisma.activity.create({
            data: {
                type: data.type,
                description: data.description,
                userId: data.user,
                boardId: data.board,
                taskId: data.task,
                metadata: data.metadata || null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                board: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    /**
     * Eliminar activity
     */
    async delete(id) {
        return prisma.activity.delete({
            where: { id }
        });
    }

    /**
     * Eliminar activities por taskId
     */
    async deleteByEntityId(taskId) {
        return prisma.activity.deleteMany({
            where: { taskId }
        });
    }

    /**
     * Eliminar activities por board
     */
    async deleteByBoardId(boardId) {
        return prisma.activity.deleteMany({
            where: { boardId }
        });
    }

    /**
     * Obtener actividad reciente de un board
     */
    async getRecentActivity(boardId, days = 7) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        return prisma.activity.findMany({
            where: {
                boardId,
                createdAt: {
                    gte: dateLimit
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}
