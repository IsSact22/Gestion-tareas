export default class GetBoardsUseCase {
  constructor(boardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute({ workspaceId, userId }) {
    if (workspaceId) {
      return await this.boardRepository.findByWorkspaceId(workspaceId);
    }
    
    return await this.boardRepository.findByUserId(userId);
  }
}
