import NotificationRepository from '../../infrastructure/database/prisma/NotificationRepository.js';

const notificationRepository = new NotificationRepository();

export async function getNotifications(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const notifications = await notificationRepository.findByUserId(req.user.id, limit);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadNotifications(req, res, next) {
  try {
    const notifications = await notificationRepository.findUnreadByUserId(req.user.id);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const count = await notificationRepository.countUnread(req.user.id);
    res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const notification = await notificationRepository.markAsRead(req.params.id);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    await notificationRepository.markAllAsRead(req.user.id);
    res.status(200).json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    next(error);
  }
}

export async function deleteNotification(req, res, next) {
  try {
    await notificationRepository.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Notificación eliminada' });
  } catch (error) {
    next(error);
  }
}
