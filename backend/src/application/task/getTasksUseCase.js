import AppError from '../../core/AppError.js';

export default class GetTasksUseCase {
  constructor(taskRepository, boardRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ boardId, columnId, userId, userRole }) {
    // Validar que boardId o columnId esté presente
    if (!boardId && !columnId) {
      throw new AppError('boardId or columnId is required', 400);
    }

    // Si hay columnId, obtener tareas de la columna
    if (columnId) {
      return await this.taskRepository.findByColumnId(columnId);
    }

    // Verificar acceso al board
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Permitir acceso a miembros del board o admins del sistema
    const isMember = board.members?.some(m => m.userId === userId);
    const isSystemAdmin = userRole === 'admin';
    
    if (!isMember && !isSystemAdmin) {
      throw new AppError('You do not have access to this board', 403);
    }

    return await this.taskRepository.findByBoardId(boardId);
  }
}
