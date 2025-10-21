import AppError from '../../core/AppError.js';

export default class DeleteTaskUseCase {
  constructor(taskRepository, boardRepository, activityRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
    this.activityRepository = activityRepository;
  }

  async execute({ taskId, userId }) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Verificar permisos
    const board = await this.boardRepository.findById(task.board._id);
    const member = board.members.find(m => m.user._id.toString() === userId.toString());
    if (!member || member.role === 'viewer') {
      throw new AppError('You do not have permission to delete tasks', 403);
    }

    // Registrar actividad antes de eliminar
    await this.activityRepository.create({
      user: userId,
      action: 'deleted',
      entity: 'task',
      entityId: taskId,
      board: task.board._id,
      details: { title: task.title }
    });

    await this.taskRepository.delete(taskId);

    return { message: 'Task deleted successfully' };
  }
}
