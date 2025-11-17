import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class DeleteBoardUseCase {
  constructor(boardRepository, columnRepository, taskRepository, activityRepository) {
    this.boardRepository = boardRepository;
    this.columnRepository = columnRepository;
    this.taskRepository = taskRepository;
    this.activityRepository = activityRepository;
  }

  async execute({ boardId, userId }) {
    const board = await this.boardRepository.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Verificar que el usuario sea admin
    const userIdStr = toStringId(userId);
    const member = board.members?.find(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    if (!member || member.role !== 'admin') {
      throw new AppError('Only admins can delete this board', 403);
    }

    // Eliminar todas las columnas del board
    const columns = await this.columnRepository.findByBoardId(boardId);
    for (const column of columns) {
      await this.columnRepository.delete(column.id || column._id);
    }

    // Eliminar todas las tareas del board
    const tasks = await this.taskRepository.findByBoardId(boardId);
    for (const task of tasks) {
      await this.taskRepository.delete(task.id || task._id);
    }

    // Eliminar actividades
    await this.activityRepository.deleteByBoardId(boardId);

    // Eliminar board
    await this.boardRepository.delete(boardId);

    return { message: 'Board deleted successfully' };
  }
}
