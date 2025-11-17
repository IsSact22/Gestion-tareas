import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class DeleteColumnUseCase {
  constructor(columnRepository, boardRepository, taskRepository) {
    this.columnRepository = columnRepository;
    this.boardRepository = boardRepository;
    this.taskRepository = taskRepository;
  }

  async execute({ columnId, userId }) {
    const column = await this.columnRepository.findById(columnId);
    if (!column) {
      throw new AppError('Column not found', 404);
    }

    // Verificar permisos
    const boardId = column.boardId || column.board?._id || column.board;
    const board = await this.boardRepository.findById(boardId);
    const userIdStr = toStringId(userId);
    const isMember = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    if (!isMember) {
      throw new AppError('You do not have permission to delete columns', 403);
    }

    // Eliminar todas las tareas de la columna
    const tasks = await this.taskRepository.findByColumnId(columnId);
    for (const task of tasks) {
      await this.taskRepository.delete(task.id || task._id);
    }

    // Con Prisma, la relación se actualiza automáticamente al eliminar la columna
    // No es necesario hacer removeColumn

    // Eliminar columna
    await this.columnRepository.delete(columnId);

    return { message: 'Column deleted successfully' };
  }
}
