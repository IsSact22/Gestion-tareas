import AppError from '../../core/AppError.js';

export default class UpdateWorkspaceUseCase {
  constructor(workspaceRepository) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ workspaceId, userId, name, description }) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Verificar que el usuario sea el owner
    const ownerId = workspace.ownerId || workspace.owner?._id || workspace.owner;
    
    if (ownerId !== userId) {
      throw new AppError('Only the owner can update this workspace', 403);
    }

    const updatedWorkspace = await this.workspaceRepository.update(workspaceId, {
      name: name || workspace.name,
      description: description !== undefined ? description : workspace.description
    });

    return updatedWorkspace;
  }
}
