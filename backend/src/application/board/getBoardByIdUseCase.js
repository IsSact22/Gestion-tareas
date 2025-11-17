import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class GetBoardByIdUseCase {
  constructor(boardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute({ boardId, userId, userRole }) {
    const board = await this.boardRepository.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Verificar que el usuario sea miembro o admin del sistema
    const userIdStr = toStringId(userId);
    const isMember = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    const isSystemAdmin = userRole === 'admin';
    
    if (!isMember && !isSystemAdmin) {
      throw new AppError('You do not have access to this board', 403);
    }

    return board;
  }
}
