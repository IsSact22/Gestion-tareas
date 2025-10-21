import AppError from '../../core/AppError.js';

export default class ReorderColumnsUseCase {
  constructor(columnRepository, boardRepository) {
    this.columnRepository = columnRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ boardId, userId, newOrder }) {
    // newOrder es un array de column IDs en el nuevo orden
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Verificar permisos
    const member = board.members.find(m => m.user._id.toString() === userId.toString());
    if (!member || member.role === 'viewer') {
      throw new AppError('You do not have permission to reorder columns', 403);
    }

    // Actualizar posiciones de las columnas
    const updates = newOrder.map((columnId, index) => ({
      id: columnId,
      position: index
    }));

    await this.columnRepository.updateMultiplePositions(updates);

    // Actualizar el orden en el board
    await this.boardRepository.reorderColumns(boardId, newOrder);

    return { message: 'Columns reordered successfully' };
  }
}
