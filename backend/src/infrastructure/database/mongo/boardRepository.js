import BoardModel from "./boardModel.js";

export default class BoardRepository {
  async findById(id) {
    return BoardModel.findById(id)
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar')
      .populate('columns');
  }

  async findAll() {
    return BoardModel.find()
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  async findByWorkspaceId(workspaceId) {
    return BoardModel.find({ workspace: workspaceId })
      .populate('members.user', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  async findByUserId(userId) {
    return BoardModel.find({
      'members.user': userId
    })
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  async create(data) {
    const board = new BoardModel(data);
    return board.save();
  }

  async update(id, data) {
    return BoardModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar')
      .populate('columns');
  }

  async delete(id) {
    return BoardModel.findByIdAndDelete(id);
  }

  async addColumn(boardId, columnId) {
    return BoardModel.findByIdAndUpdate(
      boardId,
      { $push: { columns: columnId } },
      { new: true }
    ).populate('columns');
  }

  async removeColumn(boardId, columnId) {
    return BoardModel.findByIdAndUpdate(
      boardId,
      { $pull: { columns: columnId } },
      { new: true }
    ).populate('columns');
  }

  async reorderColumns(boardId, newOrder) {
    return BoardModel.findByIdAndUpdate(
      boardId,
      { columns: newOrder },
      { new: true }
    ).populate('columns');
  }

  async addMember(boardId, userId, role = 'member') {
    return BoardModel.findByIdAndUpdate(
      boardId,
      { $push: { members: { user: userId, role } } },
      { new: true }
    )
      .populate('members.user', 'name email avatar');
  }

  async removeMember(boardId, userId) {
    return BoardModel.findByIdAndUpdate(
      boardId,
      { $pull: { members: { user: userId } } },
      { new: true }
    )
      .populate('members.user', 'name email avatar');
  }
}
