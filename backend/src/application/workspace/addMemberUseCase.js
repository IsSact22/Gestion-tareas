import AppError from '../../core/AppError.js';

export default class AddMemberUseCase {
  constructor(workspaceRepository, userRepository) {
    this.workspaceRepository = workspaceRepository;
    this.userRepository = userRepository;
  }

  async execute({ workspaceId, userId, memberEmail, role = 'member' }) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Verificar que el usuario sea el owner o admin
    const isOwner = workspace.owner._id.toString() === userId.toString();
    const userMember = workspace.members.find(m => m.user._id.toString() === userId.toString());
    const isAdmin = userMember && userMember.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('Only owners and admins can add members', 403);
    }

    // Buscar usuario a agregar
    const newMember = await this.userRepository.findByEmail(memberEmail);
    if (!newMember) {
      throw new AppError('User not found', 404);
    }

    // Verificar que no sea ya miembro
    const alreadyMember = workspace.members.some(
      m => m.user._id.toString() === newMember._id.toString()
    );
    if (alreadyMember || workspace.owner._id.toString() === newMember._id.toString()) {
      throw new AppError('User is already a member', 400);
    }

    const updatedWorkspace = await this.workspaceRepository.addMember(
      workspaceId,
      newMember._id,
      role
    );

    return updatedWorkspace;
  }
}
