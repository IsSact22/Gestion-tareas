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
    const board = await this.boardRepository.findById(column.board._id);
    const member = board.members.find(m => m.user._id.toString() === userId.toString());
    if (!member || member.role === 'viewer') {
      throw new AppError('You do not have permission to delete columns', 403);
    }

    // Eliminar todas las tareas de la columna
    const tasks = await this.taskRepository.findByColumnId(columnId);
    for (const task of tasks) {
      await this.taskRepository.delete(task._id);
    }

    // Remover columna del board
    await this.boardRepository.removeColumn(column.board._id, columnId);

    // Eliminar columna
    await this.columnRepository.delete(columnId);

    return { message: 'Column deleted successfully' };
  }
}
