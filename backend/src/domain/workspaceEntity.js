export default class Workspace {
  constructor({ id, name, description, owner, members = [], createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.members = members; // [{user: userId, role: 'admin'|'member'|'viewer'}]
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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

  updateMemberRole(userId, newRole) {
    const member = this.members.find(m => m.user.toString() === userId.toString());
    if (member) {
      member.role = newRole;
    }
  }

  isOwner(userId) {
    return this.owner.toString() === userId.toString();
  }

  isMember(userId) {
    return this.members.some(m => m.user.toString() === userId.toString()) || this.isOwner(userId);
  }
}
