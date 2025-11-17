import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class GetTasksUseCase {
  constructor(taskRepository, boardRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ boardId, columnId, userId, userRole }) {
    // Verificar acceso al board
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Permitir acceso a miembros del board o admins del sistema
    const userIdStr = toStringId(userId);
    const isMember = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    const isSystemAdmin = userRole === 'admin';
    
    if (!isMember && !isSystemAdmin) {
      throw new AppError('You do not have access to this board', 403);
    }

    if (columnId) {
      return await this.taskRepository.findByColumnId(columnId);
    }

    return await this.taskRepository.findByBoardId(boardId);
  }
}
