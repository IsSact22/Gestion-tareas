import AppError from '../../core/AppError.js';

export default class UpdateColumnUseCase {
  constructor(columnRepository, boardRepository) {
    this.columnRepository = columnRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ columnId, userId, name, color }) {
    const column = await this.columnRepository.findById(columnId);
    if (!column) {
      throw new AppError('Column not found', 404);
    }

    // Verificar permisos
    const boardId = column.boardId;
    const board = await this.boardRepository.findById(boardId);
    const isMember = board.members?.some(m => m.userId === userId);
    if (!isMember) {
      throw new AppError('You do not have permission to update columns', 403);
    }

    const updatedColumn = await this.columnRepository.update(columnId, {
      name: name || column.name,
      color: color || column.color
    });

    return updatedColumn;
  }
}
