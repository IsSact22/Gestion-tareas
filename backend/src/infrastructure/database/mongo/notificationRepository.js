import NotificationModel from './notificationModel.js';

export default class NotificationRepository {
  async create(data) {
    const notification = new NotificationModel(data);
    return notification.save();
  }

  async findByUserId(userId, limit = 20) {
    return NotificationModel.find({ user: userId })
      .populate('data.fromUser', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findUnreadByUserId(userId) {
    return NotificationModel.find({ user: userId, read: false })
      .populate('data.fromUser', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  async markAsRead(id) {
    return NotificationModel.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return NotificationModel.updateMany(
      { user: userId, read: false },
      { read: true }
    );
  }

  async delete(id) {
    return NotificationModel.findByIdAndDelete(id);
  }

  async countUnread(userId) {
    return NotificationModel.countDocuments({ user: userId, read: false });
  }
}
