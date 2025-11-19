import TaskModel from "./taskModel.js";

export default class TaskRepository {
  async findById(id) {
    return TaskModel.findById(id)
      .populate('column', 'name color')
      .populate('board', 'name')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');
  }

  async findAll() {
    return TaskModel.find()
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ position: 1 });
  }

  async findByBoardId(boardId) {
    return TaskModel.find({ board: boardId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ position: 1 });
  }

  async findByColumnId(columnId) {
    return TaskModel.find({ column: columnId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ position: 1 });
  }

  async findByAssignedUser(userId) {
    return TaskModel.find({ assignedTo: userId })
      .populate('column', 'name color')
      .populate('board', 'name')
      .populate('createdBy', 'name email avatar')
      .sort({ dueDate: 1 });
  }

  async create(data) {
    const task = new TaskModel(data);
    return task.save();
  }

  async update(id, data) {
    return TaskModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })
      .populate('column', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');
  }

  async delete(id) {
    return TaskModel.findByIdAndDelete(id);
  }

  async moveToColumn(taskId, newColumnId, newPosition) {
    return TaskModel.findByIdAndUpdate(
      taskId,
      { column: newColumnId, position: newPosition },
      { new: true }
    )
      .populate('column', 'name color')
      .populate('assignedTo', 'name email avatar');
  }

  async updatePosition(id, newPosition) {
    return TaskModel.findByIdAndUpdate(
      id,
      { position: newPosition },
      { new: true }
    );
  }

  async updateMultiplePositions(updates) {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { id: update.id },
        update: { $set: { position: update.position } }
      }
    }));

    return TaskModel.bulkWrite(bulkOps);
  }

  async addComment(taskId, userId, text) {
    return TaskModel.findByIdAndUpdate(
      taskId,
      { $push: { comments: { user: userId, text, createdAt: new Date() } } },
      { new: true }
    )
      .populate('comments.user', 'name email avatar');
  }

  async deleteComment(taskId, commentId) {
    return TaskModel.findByIdAndUpdate(
      taskId,
      { $pull: { comments: { id: commentId } } },
      { new: true }
    )
      .populate('comments.user', 'name email avatar');
  }

  async addAttachment(taskId, attachment) {
    return TaskModel.findByIdAndUpdate(
      taskId,
      { $push: { attachments: attachment } },
      { new: true }
    );
  }

  async getMaxPosition(columnId) {
    const result = await TaskModel.findOne({ column: columnId })
      .sort({ position: -1 })
      .select('position');
    return result ? result.position : -1;
  }

  async searchByBoard(boardId, query) {
    return TaskModel.find({
      board: boardId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
      .populate('column', 'name color')
      .populate('assignedTo', 'name email avatar')
      .limit(20);
  }

  async getOverdueTasks(boardId) {
    return TaskModel.find({
      board: boardId,
      dueDate: { $lt: new Date() }
    })
      .populate('column', 'name color')
      .populate('assignedTo', 'name email avatar')
      .sort({ dueDate: 1 });
  }
}
