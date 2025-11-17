import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class CreateTaskUseCase {
  constructor(taskRepository, columnRepository, boardRepository, activityRepository) {
    this.taskRepository = taskRepository;
    this.columnRepository = columnRepository;
    this.boardRepository = boardRepository;
    this.activityRepository = activityRepository;
  }

  async execute({ title, description, columnId, userId, assignedTo, priority, dueDate, tags }) {
    if (!title) {
      throw new AppError('Task title is required', 400);
    }

    // Verificar que la columna exista
    const column = await this.columnRepository.findById(columnId);
    if (!column) {
      throw new AppError('Column not found', 404);
    }

    // Verificar permisos
    const boardId = column.boardId || column.board?._id || column.board;
    const board = await this.boardRepository.findById(boardId);
    const userIdStr = toStringId(userId);
    const isMember = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    if (!isMember) {
      throw new AppError('You do not have permission to create tasks', 403);
    }

    // Obtener la siguiente posición
    const maxPosition = await this.taskRepository.getMaxPosition(columnId);

    const task = await this.taskRepository.create({
      title,
      description: description || '',
      column: columnId,
      board: boardId,
      position: maxPosition + 1,
      assignedTo: assignedTo || null,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || [],
      createdBy: userId,
      attachments: [],
      comments: []
    });

    // Registrar actividad
    const taskId = task.id || task._id;
    await this.activityRepository.create({
      user: userId,
      action: 'created',
      entity: 'task',
      entityId: taskId,
      board: boardId,
      details: { title: task.title }
    });

    return task;
  }
}
