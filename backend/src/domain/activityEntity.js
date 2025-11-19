export default class Activity {
  constructor({ id, user, action, entity, entityId, details = {}, board, createdAt }) {
    this.id = id;
    this.user = user;
    this.action = action; // 'created', 'updated', 'moved', 'deleted', 'assigned', 'commented'
    this.entity = entity; // 'task', 'column', 'board', 'workspace'
    this.entityId = entityId;
    this.details = details; // Objeto con información adicional del cambio
    this.board = board;
    this.createdAt = createdAt || new Date();
  }

  static createTaskActivity(user, action, taskId, boardId, details = {}) {
    return new Activity({
      user,
      action,
      entity: 'task',
      entityId: taskId,
      board: boardId,
      details
    });
  }

  static createColumnActivity(user, action, columnId, boardId, details = {}) {
    return new Activity({
      user,
      action,
      entity: 'column',
      entityId: columnId,
      board: boardId,
      details
    });
  }

  static createBoardActivity(user, action, boardId, details = {}) {
    return new Activity({
      user,
      action,
      entity: 'board',
      entityId: boardId,
      board: boardId,
      details
    });
  }
}
