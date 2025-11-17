import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class UpdateBoardUseCase {
  constructor(boardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute({ boardId, userId, name, description, color }) {
    const board = await this.boardRepository.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Verificar permisos
    const userIdStr = toStringId(userId);
    const isMember = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    if (!isMember) {
      throw new AppError('You do not have permission to update this board', 403);
    }

    const updatedBoard = await this.boardRepository.update(boardId, {
      name: name || board.name,
      description: description !== undefined ? description : board.description,
      color: color || board.color
    });

    return updatedBoard;
  }
}
