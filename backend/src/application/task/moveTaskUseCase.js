import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class MoveTaskUseCase {
  constructor(taskRepository, columnRepository, boardRepository, activityRepository) {
    this.taskRepository = taskRepository;
    this.columnRepository = columnRepository;
    this.boardRepository = boardRepository;
    this.activityRepository = activityRepository;
  }

  async execute({ taskId, userId, newColumnId, newPosition }) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const newColumn = await this.columnRepository.findById(newColumnId);
    if (!newColumn) {
      throw new AppError('Column not found', 404);
    }

    // Verificar permisos
    const boardId = task.boardId || task.board?._id || task.board;
    const board = await this.boardRepository.findById(boardId);
    const userIdStr = toStringId(userId);
    const isMember = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    if (!isMember) {
      throw new AppError('You do not have permission to move tasks', 403);
    }

    const oldColumnId = task.columnId || task.column?._id || task.column;

    // Mover tarea
    await this.taskRepository.moveToColumn(taskId, newColumnId, newPosition);

    // Registrar actividad
    await this.activityRepository.create({
      user: userId,
      action: 'moved',
      entity: 'task',
      entityId: taskId,
      board: boardId,
      details: {
        title: task.title,
        from: oldColumnId,
        to: newColumnId
      }
    });

    return await this.taskRepository.findById(taskId);
  }
}
