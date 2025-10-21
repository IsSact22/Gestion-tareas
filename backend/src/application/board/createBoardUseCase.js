import AppError from '../../core/AppError.js';

export default class CreateBoardUseCase {
  constructor(boardRepository, workspaceRepository) {
    this.boardRepository = boardRepository;
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ name, description, workspaceId, userId }) {
    if (!name) {
      throw new AppError('Board name is required', 400);
    }

    // Verificar que el workspace exista
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Verificar que el usuario sea miembro del workspace
    const isOwner = workspace.owner._id.toString() === userId.toString();
    const isMember = workspace.members.some(m => m.user._id.toString() === userId.toString());

    if (!isOwner && !isMember) {
      throw new AppError('You must be a member of the workspace', 403);
    }

    const board = await this.boardRepository.create({
      name,
      description,
      workspace: workspaceId,
      members: [{ user: userId, role: 'admin' }],
      columns: []
    });

    return board;
  }
}
