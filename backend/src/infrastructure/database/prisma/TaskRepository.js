import prisma from "./client.js";

/**
 * TaskRepository con Prisma
 * Implementa la misma interfaz que el TaskRepository de MongoDB
 */
export default class TaskRepository {
    /**
     * Buscar task por ID con relaciones
     */
    async findById(id) {
        return prisma.task.findUnique({
            where: { id },
            include: {
                column: {
                    select: {
                        id: true,
                        name: true,
                        boardId: true
                    }
                },
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                comments: {
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
                        createdAt: 'asc'
                    }
                }
            }
        });
    }

    /**
     * Obtener todas las tasks
     */
    async findAll() {
        return prisma.task.findMany({
            include: {
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                position: 'asc'
            }
        });
    }

    /**
     * Buscar tasks por board
     */
    async findByBoardId(boardId) {
        return prisma.task.findMany({
            where: {
                boardId: boardId
            },
            include: {
                column: true,
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                position: 'asc'
            }
        });
    }

    /**
     * Buscar tasks por columna
     */
    async findByColumnId(columnId) {
        return prisma.task.findMany({
            where: { columnId },
            include: {
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                position: 'asc'
            }
        });
    }

    /**
     * Buscar tasks asignadas a un usuario
     */
    async findByAssignedUser(userId) {
        return prisma.task.findMany({
            where: {
                assignedTo: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                column: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                dueDate: 'asc'
            }
        });
    }

    /**
     * Crear task
     */
    async create(data) {
        // Convertir dueDate a ISO-8601 si es solo fecha
        let dueDate = data.dueDate;
        if (dueDate && typeof dueDate === 'string' && !dueDate.includes('T')) {
            dueDate = new Date(dueDate + 'T00:00:00.000Z').toISOString();
        }

        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                columnId: data.column,
                boardId: data.board,
                createdBy: data.createdBy,
                priority: data.priority || 'medium',
                dueDate: dueDate,
                position: data.position || 0,
                tags: data.tags || [],
                attachments: data.attachments || [],
                ...(data.assignedTo && data.assignedTo.length > 0 && {
                    assignedTo: {
                        create: data.assignedTo.map(userId => ({
                            userId: userId
                        }))
                    }
                })
            },
            include: {
                column: true,
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        });
    }

    /**
     * Actualizar task
     */
    async update(id, data) {
        // Convertir dueDate a ISO-8601 si es solo fecha
        let dueDate = data.dueDate;
        if (dueDate && typeof dueDate === 'string' && !dueDate.includes('T')) {
            dueDate = new Date(dueDate + 'T00:00:00.000Z').toISOString();
        }

        // Preparar datos de actualización
        const updateData = {
            ...(data.title && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.priority && { priority: data.priority }),
            ...(data.dueDate !== undefined && { dueDate: dueDate }),
            ...(data.position !== undefined && { position: data.position }),
            ...(data.tags && { tags: data.tags }),
            ...(data.attachments && { attachments: data.attachments })
        };

        return prisma.task.update({
            where: { id },
            data: updateData,
            include: {
                column: true,
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Eliminar task
     */
    async delete(id) {
        return prisma.task.delete({
            where: { id }
        });
    }

    /**
     * Mover task a otra columna
     */
    async moveToColumn(taskId, newColumnId, newPosition) {
        return prisma.task.update({
            where: { id: taskId },
            data: {
                columnId: newColumnId,
                position: newPosition
            },
            include: {
                column: true,
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Actualizar orden de task
     */
    async updatePosition(id, newPosition) {
        return prisma.task.update({
            where: { id },
            data: { position: newPosition }
        });
    }

    /**
     * Actualizar múltiples posiciones (transacción)
     */
    async updateMultiplePositions(updates) {
        const operations = updates.map((update) =>
            prisma.task.update({
                where: { id: update.id },
                data: { position: update.position }
            })
        );

        return prisma.$transaction(operations);
    }

    /**
     * Agregar comentario a task
     */
    async addComment(taskId, userId, text) {
        await prisma.comment.create({
            data: {
                content: text,
                taskId: taskId,
                userId: userId
            }
        });

        return this.findById(taskId);
    }

    /**
     * Eliminar comentario
     */
    async deleteComment(taskId, commentId) {
        await prisma.comment.delete({
            where: { id: commentId }
        });

        return this.findById(taskId);
    }

    /**
     * Agregar attachment
     */
    async addAttachment(taskId, attachment) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: { attachments: true }
        });

        const updatedAttachments = [...(task.attachments || []), attachment];

        return prisma.task.update({
            where: { id: taskId },
            data: { attachments: updatedAttachments }
        });
    }

    /**
     * Obtener máximo orden en una columna
     */
    async getMaxPosition(columnId) {
        const result = await prisma.task.findFirst({
            where: { columnId },
            orderBy: { position: 'desc' },
            select: { position: true }
        });
        return result ? result.position : -1;
    }

    /**
     * Buscar tasks por board con query
     */
    async searchByBoard(boardId, query) {
        return prisma.task.findMany({
            where: {
                boardId: boardId,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } }
                ]
            },
            include: {
                column: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                }
            },
            take: 20
        });
    }

    /**
     * Obtener tasks vencidas
     */
    async getOverdueTasks(boardId) {
        return prisma.task.findMany({
            where: {
                boardId: boardId,
                dueDate: {
                    lt: new Date()
                }
            },
            include: {
                column: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                assignedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                dueDate: 'asc'
            }
        });
    }
}
