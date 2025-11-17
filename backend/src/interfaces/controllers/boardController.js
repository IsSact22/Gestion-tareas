import GetBoardsUseCase from '../../application/board/getBoardsUseCase.js';
import GetBoardByIdUseCase from '../../application/board/getBoardByIdUseCase.js';
import UpdateBoardUseCase from '../../application/board/updateBoardUseCase.js';
import DeleteBoardUseCase from '../../application/board/deleteBoardUseCase.js';
import repositoryFactory from '../../infrastructure/database/repositoryFactory.js';
import { emitToBoard, emitToWorkspace, getIO } from '../../socket/index.js';
import CreateBoardUseCase from '../../application/board/createBoardUseCase.js';
import { toStringId } from '../../core/idUtils.js';

const boardRepository = repositoryFactory.getBoardRepository();
const notificationRepository = repositoryFactory.getNotificationRepository();
const workspaceRepository = repositoryFactory.getWorkspaceRepository();
const columnRepository = repositoryFactory.getColumnRepository();
const taskRepository = repositoryFactory.getTaskRepository();
const activityRepository = repositoryFactory.getActivityRepository();
const userRepository = repositoryFactory.getUserRepository();

const createBoardUseCase = new CreateBoardUseCase(boardRepository, workspaceRepository);
const getBoardsUseCase = new GetBoardsUseCase(boardRepository);
const getBoardByIdUseCase = new GetBoardByIdUseCase(boardRepository);
const updateBoardUseCase = new UpdateBoardUseCase(boardRepository);
const deleteBoardUseCase = new DeleteBoardUseCase(boardRepository, columnRepository, taskRepository, activityRepository);

export async function createBoard(req, res, next) {
  try {
    const { name, description, workspaceId, color } = req.body;
    const board = await createBoardUseCase.execute({
      name,
      description,
      workspaceId,
      color,
      userId: req.user._id
    });

    // Emitir evento Socket.IO a todos los usuarios del workspace
    emitToWorkspace(workspaceId, 'board:updated', {
      board,
      userId: req.user._id,
      timestamp: new Date()
    });

    res.status(201).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

export async function getBoards(req, res, next) {
  try {
    const { workspaceId } = req.query;
    const boards = await getBoardsUseCase.execute({
      workspaceId,
      userId: req.user._id
    });

    res.status(200).json({ success: true, data: boards });
  } catch (error) {
    next(error);
  }
}

export async function getBoardById(req, res, next) {
  try {
    const board = await getBoardByIdUseCase.execute({
      boardId: req.params.id,
      userId: req.user._id,
      userRole: req.user.role
    });

    res.status(200).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

export async function updateBoard(req, res, next) {
  try {
    const { name, description, color } = req.body;
    const board = await updateBoardUseCase.execute({
      boardId: req.params.id,
      userId: req.user._id,
      name,
      description,
      color
    });

    // Emitir evento Socket.IO al board y al workspace
    emitToBoard(toStringId(board.id || board._id), 'board:created', {
      board,
      userId: toStringId(req.user.id || req.user._id),
      timestamp: new Date()
    });

    emitToWorkspace(toStringId(board.workspaceId || board.workspace), 'board:created', {
      board,
      userId: toStringId(req.user.id || req.user._id),
      timestamp: new Date()
    });

    res.status(200).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

export async function deleteBoard(req, res, next) {
  try {
    // Obtener el board antes de eliminarlo para tener el workspaceId
    const board = await boardRepository.findById(req.params.id);
    
    const result = await deleteBoardUseCase.execute({
      boardId: req.params.id,
      userId: req.user._id
    });

    // Emitir evento Socket.IO de eliminación
    if (board) {
      emitToWorkspace(toStringId(board.workspaceId || board.workspace), 'board:deleted', {
        boardId: req.params.id,
        userId: toStringId(req.user.id || req.user._id),
        timestamp: new Date()
      });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function addMember(req, res, next) {
  try {
    const { email, role } = req.body;
    
    // Buscar usuario por email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    const userId = user._id;
    const board = await boardRepository.addMember(req.params.id, userId, role);
    
    // Crear notificación para el usuario agregado
    const notification = await notificationRepository.create({
      user: userId,
      type: 'board_invitation',
      title: 'Te agregaron a un board',
      message: `Has sido agregado al board "${board.name}" como ${role === 'admin' ? 'administrador' : role === 'member' ? 'miembro' : 'visualizador'}`,
      data: {
        boardId: board._id,
        fromUser: req.user._id
      },
      link: `/boards/${board._id}`
    });

    // Emitir notificación en tiempo real al usuario
    const io = getIO();
    io.to(`user:${userId}`).emit('notification', notification);
    
    // Emitir actualización del board a todos los miembros
    io.to(`board:${board._id}`).emit('board:member-added', {
      boardId: board._id,
      member: { user: userId, role }
    });
    
    res.status(200).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

export async function removeMember(req, res, next) {
  try {
    const { userId } = req.params;
    const board = await boardRepository.removeMember(req.params.id, userId);
    res.status(200).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

// Admin: Obtener TODOS los boards del sistema
export async function getAllBoardsAdmin(req, res, next) {
  try {
    const boards = await boardRepository.findAll();
    res.status(200).json({ success: true, data: boards });
  } catch (error) {
    next(error);
  }
}
