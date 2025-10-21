import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'moved', 'deleted', 'assigned', 'commented', 'attached']
  },
  entity: {
    type: String,
    required: true,
    enum: ['task', 'column', 'board', 'workspace']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  }
}, {
  timestamps: true
});

// Índices
activitySchema.index({ board: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ entityId: 1 });

export default mongoose.model('Activity', activitySchema);
