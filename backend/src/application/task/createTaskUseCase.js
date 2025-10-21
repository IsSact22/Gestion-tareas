import AppError from '../../core/AppError.js';

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
    const board = await this.boardRepository.findById(column.board._id);
    const member = board.members.find(m => m.user._id.toString() === userId.toString());
    if (!member || member.role === 'viewer') {
      throw new AppError('You do not have permission to create tasks', 403);
    }

    // Obtener la siguiente posición
    const maxPosition = await this.taskRepository.getMaxPosition(columnId);

    const task = await this.taskRepository.create({
      title,
      description: description || '',
      column: columnId,
      board: column.board._id,
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
    await this.activityRepository.create({
      user: userId,
      action: 'created',
      entity: 'task',
      entityId: task._id,
      board: column.board._id,
      details: { title: task.title }
    });

    return task;
  }
}
