import AppError from '../../core/AppError.js';
import { toStringId } from '../../core/idUtils.js';

export default class AddMemberUseCase {
  constructor(workspaceRepository, userRepository) {
    this.workspaceRepository = workspaceRepository;
    this.userRepository = userRepository;
  }

  async execute({ workspaceId, userId, memberEmail, role = 'member', userRole }) {
    const workspace = await this.workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Verificar que el usuario sea el owner, admin del workspace, o admin del sistema
    const ownerId = toStringId(workspace.ownerId || workspace.owner?._id || workspace.owner);
    const userIdStr = toStringId(userId);
    
    const isOwner = ownerId === userIdStr;
    const userMember = workspace.members?.find(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === userIdStr;
    });
    const isWorkspaceAdmin = userMember && userMember.role === 'admin';
    const isSystemAdmin = userRole === 'admin';

    if (!isOwner && !isWorkspaceAdmin && !isSystemAdmin) {
      throw new AppError('Only owners and admins can add members', 403);
    }

    // Buscar usuario a agregar
    const newMember = await this.userRepository.findByEmail(memberEmail);
    if (!newMember) {
      throw new AppError('User not found', 404);
    }

    // Verificar que no sea ya miembro
    const newMemberId = toStringId(newMember.id || newMember._id);
    const alreadyMember = workspace.members?.some(m => {
      const memberId = toStringId(m.userId || m.user?._id || m.user);
      return memberId === newMemberId;
    });
    if (alreadyMember || ownerId === newMemberId) {
      throw new AppError('User is already a member', 400);
    }

    const updatedWorkspace = await this.workspaceRepository.addMember(
      workspaceId,
      newMemberId,
      role
    );

    return updatedWorkspace;
  }
}
