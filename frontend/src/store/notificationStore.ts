/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import notificationService, { Notification } from '@/services/notificationService';
import socketService from '@/services/socketService';
import toast from 'react-hot-toast';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await notificationService.getNotifications();
      set({ notifications, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar notificaciones';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const count = await notificationService.getUnreadCount();
      set({ unreadCount: count });
    } catch (error: any) {
      console.error('Error al obtener contador de notificaciones:', error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al marcar como leída';
      toast.error(errorMessage);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al marcar todas como leídas';
      toast.error(errorMessage);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: notification && !notification.read 
            ? Math.max(0, state.unreadCount - 1) 
            : state.unreadCount,
        };
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar notificación';
      toast.error(errorMessage);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
    
    // Mostrar toast con la notificación
    toast.success(notification.title, {
      duration: 5000,
      icon: '🔔',
    });
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));

// Escuchar notificaciones en tiempo real
socketService.on('notification', (notification: Notification) => {
  console.log('🔔 Nueva notificación recibida:', notification);
  useNotificationStore.getState().addNotification(notification);
});
