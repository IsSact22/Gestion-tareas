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
    const board = await this.boardRepository.findById(task.board);
    if (!board) {
      throw new Error('Board no encontrado');
    }

    const isMember = board.members.some(
      (member) => member.user.toString() === userId.toString()
    );
    if (!isMember) {
      throw new Error('No tienes permiso para eliminar comentarios en este board');
    }

    // Encontrar el comentario
    const comment = task.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      throw new Error('Comentario no encontrado');
    }

    // Verificar que el usuario es el autor del comentario o admin del board
    const isAuthor = comment.user.toString() === userId.toString();
    const isAdmin = board.members.some(
      (member) => member.user.toString() === userId.toString() && member.role === 'admin'
    );

    if (!isAuthor && !isAdmin) {
      throw new Error('No tienes permiso para eliminar este comentario');
    }

    // Eliminar el comentario
    await this.taskRepository.deleteComment(taskId, commentId);

    // Registrar actividad
    await this.activityRepository.create({
      board: task.board,
      user: userId,
      type: 'comment_deleted',
      task: taskId,
      description: `Comentario eliminado de la tarea "${task.title}"`
    });

    return { success: true };
  }
}
