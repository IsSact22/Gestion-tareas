export default class Task {
  constructor({ 
    id, 
    title, 
    description = '', 
    column, 
    board, 
    position, 
    assignedTo = null,
    priority = 'medium',
    dueDate = null,
    tags = [],
    attachments = [],
    comments = [],
    createdBy,
    createdAt,
    updatedAt 
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.column = column;
    this.board = board;
    this.position = position;
    this.assignedTo = assignedTo;
    this.priority = priority; // 'low', 'medium', 'high', 'urgent'
    this.dueDate = dueDate;
    this.tags = tags;
    this.attachments = attachments; // [{url, name, type}]
    this.comments = comments; // [{user, text, createdAt}]
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  moveToColumn(newColumnId, newPosition) {
    this.column = newColumnId;
    this.position = newPosition;
  }

  updatePosition(newPosition) {
    this.position = newPosition;
  }

  assignTo(userId) {
    this.assignedTo = userId;
  }

  unassign() {
    this.assignedTo = null;
  }

  setPriority(priority) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (validPriorities.includes(priority)) {
      this.priority = priority;
    }
  }

  addComment(userId, text) {
    this.comments.push({
      user: userId,
      text,
      createdAt: new Date()
    });
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  addAttachment(attachment) {
    this.attachments.push(attachment);
  }

  isOverdue() {
    if (!this.dueDate) return false;
    return new Date(this.dueDate) < new Date();
  }
}
