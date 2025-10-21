import AppError from '../../core/AppError.js';

export default class DeleteWorkspaceUseCase {
  constructor(workspaceRepository, boardRepository) {
    this.workspaceRepository = workspaceRepository;
    this.boardRepository = boardRepository;
  }

  async execute({ workspaceId, userId }) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Verificar que el usuario sea el owner
    if (workspace.owner._id.toString() !== userId.toString()) {
      throw new AppError('Only the owner can delete this workspace', 403);
    }

    // Eliminar todos los boards del workspace
    const boards = await this.boardRepository.findByWorkspaceId(workspaceId);
    for (const board of boards) {
      await this.boardRepository.delete(board._id);
    }

    // Eliminar workspace
    await this.workspaceRepository.delete(workspaceId);

    return { message: 'Workspace deleted successfully' };
  }
}
