import { toStringId } from '../../core/idUtils.js';

export default class DeleteCommentUseCase {
  constructor(taskRepository, boardRepository, activityRepository) {
    this.taskRepository = taskRepository;
    this.boardRepository = boardRepository;
    this.activityRepository = activityRepository;
  }

  async execute({ taskId, commentId, userId }) {
    // Verificar que la tarea existe
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    // Verificar que el board existe y el usuario tiene acceso
    const boardId = task.boardId || task.board?._id || task.board;
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new Error('Board no encontrado');
    }

    const userIdStr = toStringId(userId);
    const isMember = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    if (!isMember) {
      throw new Error('No tienes permiso para eliminar comentarios en este board');
    }

    // Encontrar el comentario
    const comment = task.comments?.find(c => toStringId(c.id || c._id) === toStringId(commentId));
    if (!comment) {
      throw new Error('Comentario no encontrado');
    }

    // Verificar que el usuario es el autor del comentario o admin del board
    const commentUserId = toStringId(comment.userId || comment.user?._id || comment.user);
    const isAuthor = commentUserId === userIdStr;
    const isAdmin = board.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr && m.role === 'admin';
    });

    if (!isAuthor && !isAdmin) {
      throw new Error('No tienes permiso para eliminar este comentario');
    }

    // Eliminar el comentario
    await this.taskRepository.deleteComment(taskId, commentId);

    // Registrar actividad
    await this.activityRepository.create({
      board: boardId,
      user: userId,
      type: 'comment_deleted',
      task: taskId,
      description: `Comentario eliminado de la tarea "${task.title}"`
    });

    return { success: true };
  }
}
