import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Column name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  position: {
    type: Number,
    required: true,
    default: 0
  },
  color: {
    type: String,
    default: '#6B7280',
    match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color']
  }
}, {
  timestamps: true
});

// Índices
columnSchema.index({ board: 1, position: 1 });

export default mongoose.model('Column', columnSchema);
