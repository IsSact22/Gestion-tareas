import prisma from "./client.js";

/**
 * NotificationRepository con Prisma
 * Implementa la misma interfaz que el NotificationRepository de MongoDB
 */
export default class NotificationRepository {
    /**
     * Crear notificación
     */
    async create(data) {
        return prisma.notification.create({
            data: {
                type: data.type,
                title: data.title,
                message: data.message,
                userId: data.user,
                read: data.read || false,
                link: data.link
            }
        });
    }

    /**
     * Buscar notificaciones por usuario
     */
    async findByUserId(userId, limit = 20) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
    }

    /**
     * Buscar notificaciones no leídas por usuario
     */
    async findUnreadByUserId(userId) {
        return prisma.notification.findMany({
            where: {
                userId,
                read: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    /**
     * Marcar notificación como leída
     */
    async markAsRead(id) {
        return prisma.notification.update({
            where: { id },
            data: { read: true }
        });
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    async markAllAsRead(userId) {
        return prisma.notification.updateMany({
            where: {
                userId,
                read: false
            },
            data: { read: true }
        });
    }

    /**
     * Eliminar notificación
     */
    async delete(id) {
        return prisma.notification.delete({
            where: { id }
        });
    }

    /**
     * Contar notificaciones no leídas
     */
    async countUnread(userId) {
        return prisma.notification.count({
            where: {
                userId,
                read: false
            }
        });
    }
}
