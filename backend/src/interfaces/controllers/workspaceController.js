import CreateWorkspaceUseCase from '../../application/workspace/createWorkspaceUseCase.js';
import GetWorkspacesUseCase from '../../application/workspace/getWorkspacesUseCase.js';
import UpdateWorkspaceUseCase from '../../application/workspace/updateWorkspaceUseCase.js';
import DeleteWorkspaceUseCase from '../../application/workspace/deleteWorkspaceUseCase.js';
import AddMemberUseCase from '../../application/workspace/addMemberUseCase.js';
import WorkspaceRepository from '../../infrastructure/database/mongo/workspaceRepository.js';
import BoardRepository from '../../infrastructure/database/mongo/boardRepository.js';
import UserRepository from '../../infrastructure/database/mongo/userRepository.js';

const workspaceRepository = new WorkspaceRepository();
const boardRepository = new BoardRepository();
const userRepository = new UserRepository();

const createWorkspaceUseCase = new CreateWorkspaceUseCase(workspaceRepository);
const getWorkspacesUseCase = new GetWorkspacesUseCase(workspaceRepository);
const updateWorkspaceUseCase = new UpdateWorkspaceUseCase(workspaceRepository);
const deleteWorkspaceUseCase = new DeleteWorkspaceUseCase(workspaceRepository, boardRepository);
const addMemberUseCase = new AddMemberUseCase(workspaceRepository, userRepository);

export async function createWorkspace(req, res, next) {
  try {
    const { name, description } = req.body;
    const workspace = await createWorkspaceUseCase.execute({
      name,
      description,
      userId: req.user._id
    });

    res.status(201).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
}

export async function getWorkspaces(req, res, next) {
  try {
    const workspaces = await getWorkspacesUseCase.execute(req.user._id);
    res.status(200).json({ success: true, data: workspaces });
  } catch (error) {
    next(error);
  }
}

export async function getWorkspaceById(req, res, next) {
  try {
    const workspace = await workspaceRepository.findById(req.params.id);
    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
}

export async function updateWorkspace(req, res, next) {
  try {
    const { name, description } = req.body;
    const workspace = await updateWorkspaceUseCase.execute({
      workspaceId: req.params.id,
      userId: req.user._id,
      name,
      description
    });

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
}

export async function deleteWorkspace(req, res, next) {
  try {
    const result = await deleteWorkspaceUseCase.execute({
      workspaceId: req.params.id,
      userId: req.user._id
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function addMember(req, res, next) {
  try {
    const { email, role } = req.body;
    const workspace = await addMemberUseCase.execute({
      workspaceId: req.params.id,
      userId: req.user._id,
      memberEmail: email,
      role
    });

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
}

export async function removeMember(req, res, next) {
  try {
    const { userId } = req.params;
    const workspace = await workspaceRepository.removeMember(req.params.id, userId);
    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
}
