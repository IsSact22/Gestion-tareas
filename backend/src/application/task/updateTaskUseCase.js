import AppError from '../../core/AppError.js';

export default class UpdateTaskUseCase {
  constructor(taskRepository, boardRepository, activityRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
    this.activityRepository = activityRepository;
  }

  async execute({ taskId, userId, title, description, assignedTo, priority, dueDate, tags }) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Verificar permisos
    const boardId = task.boardId;
    const board = await this.boardRepository.findById(boardId);
    const isMember = board.members?.some(m => m.userId === userId);
    if (!isMember) {
      throw new AppError('You do not have permission to update tasks', 403);
    }

    const updateData = {};
    const changes = {};

    if (title !== undefined) {
      updateData.title = title;
      changes.title = { from: task.title, to: title };
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
      changes.assignedTo = { from: task.assignedTo, to: updateData.assignedTo };
    }
    if (priority !== undefined) {
      updateData.priority = priority;
      changes.priority = { from: task.priority, to: priority };
    }
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate;
      changes.dueDate = { from: task.dueDate, to: dueDate };
    }
    if (tags !== undefined) {
      updateData.tags = tags;
    }

    const updatedTask = await this.taskRepository.update(taskId, updateData);

    // Registrar actividad
    if (Object.keys(changes).length > 0) {
      await this.activityRepository.create({
        user: userId,
        action: 'updated',
        entity: 'task',
        entityId: taskId,
        board: boardId,
        details: changes
      });
    }

    return updatedTask;
  }
}
