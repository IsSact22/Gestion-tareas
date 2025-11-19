import prisma from "./client.js";


export default class ColumnRepository {
    /**
     * Buscar columna por ID con relaciones
     */

    async findById(id) {
        return prisma.column.findUnique({
            where: { id },
            include: {
                board: true,
                tasks: true
            }
        });
    }

    /**
     * Obtener todas las columnas
     */
    async findAll() {
        return prisma.column.findMany({
            include: {
                board: true,
                tasks: true
            },
            orderBy: {
                position: 'asc'
            }
        });
    }

    /**
     * Buscar columnas por board
     */
    async findByBoardId(boardId) {
        return prisma.column.findMany({
            where: { boardId },
            include: {
                board: true,
                tasks: true
            },
            orderBy: {
                position: 'asc'
            }
        });
    }
    /**
     * Crear columna
     */
    async create(data) {
        return prisma.column.create({
            data: {
                name: data.name,
                boardId: data.board,
                position: data.position || 0,
                color: data.color || '#6B7280'
            }
        });
    }

    /**
     * Actualizar columna
     */
    async update(id, data) {
        return prisma.column.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.position !== undefined && { position: data.position }),
                ...(data.color && { color: data.color })
            }
        });
    }
    
    /**
     * Eliminar columna
     */
    async delete(id) {
        return prisma.column.delete({
            where: { id }
        });
    }

    /**
     * Actualizar posición de columna
     */
    async updatePosition(id, newPosition) {
        return prisma.column.update({
            where: { id },
            data: { position: newPosition }
        });
    }
    
    /**
     * Reordenar columnas (transacción)
     */
    async reorder(boardId, columnOrders) {
        const updates = columnOrders.map((item) =>
            prisma.column.update({
                where: { id: item.columnId },
                data: { position: item.position }
            })
        );

        return prisma.$transaction(updates);
    }

    async getMaxPosition(boardId) {
        const result = await prisma.column.findFirst({
            where: { boardId },
            orderBy: { position: 'desc' },
            select: { position: true }
        });
        return result ? result.position : -1;
    }
}
