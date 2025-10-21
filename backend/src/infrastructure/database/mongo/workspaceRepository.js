import WorkspaceModel from "./workspaceModel.js";

export default class WorkspaceRepository {
  async findById(id) {
    return WorkspaceModel.findById(id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
  }

  async findAll() {
    return WorkspaceModel.find()
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  async findByUserId(userId) {
    return WorkspaceModel.find({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  async create(data) {
    const workspace = new WorkspaceModel(data);
    return workspace.save();
  }

  async update(id, data) {
    return WorkspaceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
  }

  async delete(id) {
    return WorkspaceModel.findByIdAndDelete(id);
  }

  async addMember(workspaceId, userId, role = 'member') {
    return WorkspaceModel.findByIdAndUpdate(
      workspaceId,
      { $push: { members: { user: userId, role } } },
      { new: true }
    )
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
  }

  async removeMember(workspaceId, userId) {
    return WorkspaceModel.findByIdAndUpdate(
      workspaceId,
      { $pull: { members: { user: userId } } },
      { new: true }
    )
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
  }

  async updateMemberRole(workspaceId, userId, newRole) {
    return WorkspaceModel.findOneAndUpdate(
      { _id: workspaceId, 'members.user': userId },
      { $set: { 'members.$.role': newRole } },
      { new: true }
    )
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
  }
}
