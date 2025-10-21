import AppError from '../../core/AppError.js';

export default class GetTasksUseCase {
  constructor(taskRepository, boardRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ boardId, columnId, userId }) {
    // Verificar acceso al board
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    const isMember = board.members.some(m => m.user._id.toString() === userId.toString());
    if (!isMember) {
      throw new AppError('You do not have access to this board', 403);
    }

    if (columnId) {
      return await this.taskRepository.findByColumnId(columnId);
    }

    return await this.taskRepository.findByBoardId(boardId);
  }
}
