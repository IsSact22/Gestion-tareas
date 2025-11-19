export default class User {
  constructor({ id, name, email, password, avatar = null, role = 'member', createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.role = role; // 'admin', 'member', 'viewer'
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  canEdit() {
    return this.role === 'admin' || this.role === 'member';
  }

  canOnlyView() {
    return this.role === 'viewer';
  }
}