import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class CreateBoardUseCase {
  constructor(boardRepository, workspaceRepository) {
    this.boardRepository = boardRepository;
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ name, description, workspaceId, color, userId }) {
    if (!name) {
      throw new AppError('Board name is required', 400);
    }

    // Verificar que el workspace exista
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Verificar que el usuario sea miembro del workspace
    // Compatibilidad MongoDB (owner._id) y Prisma (ownerId)
    const ownerId = toStringId(workspace.ownerId || workspace.owner?._id || workspace.owner);
    const userIdStr = toStringId(userId);
    
    const isOwner = ownerId === userIdStr;
    const isMember = workspace.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });

    if (!isOwner && !isMember) {
      throw new AppError('You must be a member of the workspace', 403);
    }

    const board = await this.boardRepository.create({
      name,
      description,
      workspace: workspaceId,
      color,
      members: [{ user: userId, role: 'admin' }],
      columns: []
    });

    return board;
  }
}
