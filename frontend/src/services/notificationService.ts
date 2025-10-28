import api from '../lib/api';

export interface Notification {
  _id: string;
  user: string;
  type: 'board_invitation' | 'workspace_invitation' | 'task_assigned' | 'task_comment' | 'task_mention' | 'board_update' | 'workspace_update';
  title: string;
  message: string;
  data: {
    boardId?: string;
    workspaceId?: string;
    taskId?: string;
    fromUser?: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  read: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

class NotificationService {
  /**
   * Obtener todas las notificaciones del usuario
   */
  async getNotifications(limit = 20): Promise<Notification[]> {
    const response = await api.get(`/notifications?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Obtener notificaciones no leídas
   */
  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications/unread');
    return response.data.data;
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data.data;
  }

  /**
   * Marcar todas como leídas
   */
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  }

  /**
   * Eliminar notificación
   */
  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  }

  /**
   * Obtener contador de no leídas
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread/count');
    return response.data.data.count;
  }
}

export default new NotificationService();
