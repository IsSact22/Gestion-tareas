import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class CreateColumnUseCase {
  constructor(columnRepository, boardRepository) {
    this.columnRepository = columnRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ name, boardId, userId, color }) {
    if (!name) {
      throw new AppError('Column name is required', 400);
    }

    // Verificar que el board exista y el usuario tenga permisos
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    const userIdStr = toStringId(userId);
    const isMember = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    if (!isMember) {
      throw new AppError('You do not have permission to create columns', 403);
    }

    // Obtener la siguiente posición
    const maxPosition = await this.columnRepository.getMaxPosition(boardId);

    const column = await this.columnRepository.create({
      name,
      board: boardId,
      position: maxPosition + 1,
      color: color || '#6B7280'
    });

    // Con Prisma, la relación ya se establece al crear la columna con boardId
    // No es necesario hacer un update adicional al board

    return column;
  }
}
