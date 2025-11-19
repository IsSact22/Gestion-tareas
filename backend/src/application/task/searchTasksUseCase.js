import AppError from '../../core/AppError.js';

export default class SearchTasksUseCase {
  constructor(taskRepository, boardRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ boardId, userId, query }) {
    if (!query || query.trim() === '') {
      throw new AppError('Search query is required', 400);
    }

    // Verificar acceso al board
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    const isMember = board.members?.some(m => m.userId === userId);
    if (!isMember) {
      throw new AppError('You do not have access to this board', 403);
    }

    const tasks = await this.taskRepository.searchByBoard(boardId, query);
    return tasks;
  }
}
