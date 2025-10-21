import AppError from '../../core/AppError.js';

export default class GetActivitiesUseCase {
  constructor(activityRepository, boardRepository) {
    this.activityRepository = activityRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ boardId, userId, limit = 50 }) {
    // Verificar acceso al board
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    const isMember = board.members.some(m => m.user._id.toString() === userId.toString());
    if (!isMember) {
      throw new AppError('You do not have access to this board', 403);
    }

    const activities = await this.activityRepository.findByBoardId(boardId, limit);
    return activities;
  }
}
