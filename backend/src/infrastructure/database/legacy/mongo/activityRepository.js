import ActivityModel from "./activityModel.js";

export default class ActivityRepository {
  async findById(id) {
    return ActivityModel.findById(id)
      .populate('user', 'name email avatar')
      .populate('board', 'name');
  }

  async findAll(limit = 50) {
    return ActivityModel.find()
      .populate('user', 'name email avatar')
      .populate('board', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findByBoardId(boardId, limit = 50) {
    return ActivityModel.find({ board: boardId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findByUserId(userId, limit = 50) {
    return ActivityModel.find({ user: userId })
      .populate('board', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findByEntityId(entityId, limit = 20) {
    return ActivityModel.find({ entityId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async create(data) {
    const activity = new ActivityModel(data);
    return activity.save();
  }

  async delete(id) {
    return ActivityModel.findByIdAndDelete(id);
  }

  async deleteByEntityId(entityId) {
    return ActivityModel.deleteMany({ entityId });
  }

  async deleteByBoardId(boardId) {
    return ActivityModel.deleteMany({ board: boardId });
  }

  async getRecentActivity(boardId, days = 7) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    return ActivityModel.find({
      board: boardId,
      createdAt: { $gte: dateLimit }
    })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });
  }
}
