import AppError from '../../core/AppError.js';

export default class AddCommentUseCase {
  constructor(taskRepository, boardRepository, activityRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
    this.activityRepository = activityRepository;
  }

  async execute({ taskId, userId, text }) {
    if (!text || text.trim() === '') {
      throw new AppError('Comment text is required', 400);
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Verificar acceso
    const boardId = task.boardId || task.board?.id;
    const board = await this.boardRepository.findById(boardId);
    const isMember = board.members?.some(m => m.userId === userId);
    if (!isMember) {
      throw new AppError('You do not have access to this task', 403);
    }

    const updatedTask = await this.taskRepository.addComment(taskId, userId, text);

    // Registrar actividad
    await this.activityRepository.create({
      user: userId,
      action: 'commented',
      entity: 'task',
      entityId: taskId,
      board: boardId,
      details: { title: task.title, comment: text.substring(0, 50) }
    });

    return updatedTask;
  }
}
