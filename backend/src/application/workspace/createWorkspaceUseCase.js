import AppError from '../../core/AppError.js';

export default class CreateWorkspaceUseCase {
  constructor(workspaceRepository) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ name, description, userId }) {
    if (!name) {
      throw new AppError('Workspace name is required', 400);
    }

    const workspace = await this.workspaceRepository.create({
      name,
      description,
      owner: userId,
      members: [
        {
          user: userId,
          role: 'admin',
          joinedAt: new Date()
        }
      ]
    });

    return workspace;
  }
}
