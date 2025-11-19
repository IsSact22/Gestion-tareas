import AppError from '../../core/AppError.js';

export default class GetTaskByIdUseCase {
  constructor(taskRepository, boardRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ taskId, userId }) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Verificar acceso
    const boardId = task.boardId;
    const board = await this.boardRepository.findById(boardId);
    const isMember = board.members?.some(m => m.userId === userId);
    if (!isMember) {
      throw new AppError('You do not have access to this task', 403);
    }

    return task;
  }
}
