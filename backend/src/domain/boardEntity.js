export default class Board {
  constructor({ id, name, description, workspace, columns = [], members = [], createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.workspace = workspace;
    this.columns = columns; // Array de Column IDs ordenados
    this.members = members; // [{user: userId, role: 'admin'|'member'|'viewer'}]
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  addColumn(columnId) {
    if (!this.columns.includes(columnId)) {
      this.columns.push(columnId);
    }
  }

  removeColumn(columnId) {
    this.columns = this.columns.filter(id => id.toString() !== columnId.toString());
  }

  reorderColumns(newOrder) {
    this.columns = newOrder;
  }

  addMember(userId, role = 'member') {
    const exists = this.members.find(m => m.user.toString() === userId.toString());
    if (!exists) {
      this.members.push({ user: userId, role });
    }
  }

  removeMember(userId) {
    this.members = this.members.filter(m => m.user.toString() !== userId.toString());
  }

  isMember(userId) {
    return this.members.some(m => m.user.toString() === userId.toString());
  }

  canEdit(userId) {
    const member = this.members.find(m => m.user.toString() === userId.toString());
    return member && (member.role === 'admin' || member.role === 'member');
  }
}
