import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'board_invitation',
      'workspace_invitation',
      'task_assigned',
      'task_comment',
      'task_mention',
      'board_update',
      'workspace_update'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  link: {
    type: String
  }
}, {
  timestamps: true
});

// Índices compuestos para consultas eficientes
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;
