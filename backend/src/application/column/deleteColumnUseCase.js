import AppError from '../../core/AppError.js';

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
    const boardId = column.boardId;
    const board = await this.boardRepository.findById(boardId);
    const isMember = board.members?.some(m => m.userId === userId);
    if (!isMember) {
      throw new AppError('You do not have permission to delete columns', 403);
    }

    // Eliminar todas las tareas de la columna
    const tasks = await this.taskRepository.findByColumnId(columnId);
    for (const task of tasks) {
      await this.taskRepository.delete(task.id);
    }

    // Con Prisma, la relación se actualiza automáticamente al eliminar la columna
    // No es necesario hacer removeColumn

    // Eliminar columna
    await this.columnRepository.delete(columnId);

    return { message: 'Column deleted successfully' };
  }
}
