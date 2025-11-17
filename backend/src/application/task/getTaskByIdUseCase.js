import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class GetTaskByIdUseCase {
  constructor(taskRepository, boardRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ taskId, userId }) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Verificar acceso
    const boardId = task.boardId || task.board?._id || task.board;
    const board = await this.boardRepository.findById(boardId);
    const userIdStr = toStringId(userId);
    const isMember = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    if (!isMember) {
      throw new AppError('You do not have access to this task', 403);
    }

    return task;
  }
}
