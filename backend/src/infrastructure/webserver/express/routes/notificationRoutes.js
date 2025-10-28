import express from 'express';
import {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../../../../interfaces/controllers/notificationController.js';
import { protect } from '../../../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.get('/', getNotifications);
router.get('/unread', getUnreadNotifications);
router.get('/unread/count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;
