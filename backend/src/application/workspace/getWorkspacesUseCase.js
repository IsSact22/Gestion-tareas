export default class GetWorkspacesUseCase {
  constructor(workspaceRepository) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute(userId) {
    const workspaces = await this.workspaceRepository.findByUserId(userId);
    return workspaces;
  }
}
