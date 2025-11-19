import AppError from '../../core/AppError.js';

export default class GetColumnsUseCase {
  constructor(columnRepository, boardRepository) {
    this.columnRepository = columnRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ boardId, userId, userRole }) {
    // Validar que boardId esté presente
    if (!boardId) {
      throw new AppError('boardId is required', 400);
    }

    // Verificar acceso al board
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Permitir acceso a miembros del board o admins del sistema
    const isMember = board.members?.some(m => m.userId === userId);
    const isSystemAdmin = userRole === 'admin';
    
    if (!isMember && !isSystemAdmin) {
      throw new AppError('You do not have access to this board', 403);
    }

    const columns = await this.columnRepository.findByBoardId(boardId);
    return columns;
  }
}
