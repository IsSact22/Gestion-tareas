import GetBoardsUseCase from '../../application/board/getBoardsUseCase.js';
import GetBoardByIdUseCase from '../../application/board/getBoardByIdUseCase.js';
import UpdateBoardUseCase from '../../application/board/updateBoardUseCase.js';
import DeleteBoardUseCase from '../../application/board/deleteBoardUseCase.js';
import { emitToBoard, emitToWorkspace, getIO } from '../../socket/index.js';
import CreateBoardUseCase from '../../application/board/createBoardUseCase.js';
import BoardRepository from '../../infrastructure/database/prisma/BoardRepository.js';
import NotificationRepository from '../../infrastructure/database/prisma/NotificationRepository.js';
import WorkspaceRepository from '../../infrastructure/database/prisma/workspaceRepository.js';
import ColumnRepository from '../../infrastructure/database/prisma/ColumnRepository.js';
import TaskRepository from '../../infrastructure/database/prisma/TaskRepository.js';
import ActivityRepository from '../../infrastructure/database/prisma/ActivityRepository.js';
import UserRepository from '../../infrastructure/database/prisma/userRepository.js';

const boardRepository = new BoardRepository();
const notificationRepository = new NotificationRepository();
const workspaceRepository = new WorkspaceRepository();
const columnRepository = new ColumnRepository();
const taskRepository = new TaskRepository();
const activityRepository = new ActivityRepository();
const userRepository = new UserRepository();

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
      userId: req.user.id
    });

    // Emitir evento Socket.IO a todos los usuarios del workspace
    emitToWorkspace(workspaceId, 'board:updated', {
      board,
      userId: req.user.id,
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
      userId: req.user.id
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
      userId: req.user.id,
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
      userId: req.user.id,
      name,
      description,
      color
    });

    // Emitir evento Socket.IO al board y al workspace
    emitToBoard(board.id, 'board:created', {
      board,
      userId: req.user.id,
      timestamp: new Date()
    });

    emitToWorkspace(board.workspaceId, 'board:created', {
      board,
      userId: req.user.id,
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
      userId: req.user.id
    });

    // Emitir evento Socket.IO de eliminación
    if (board) {
      emitToWorkspace(board.workspaceId, 'board:deleted', {
        boardId: req.params.id,
        userId: req.user.id,
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
    
    const userId = user.id;
    const board = await boardRepository.addMember(req.params.id, userId, role);
    
    // Crear notificación para el usuario agregado
    const notification = await notificationRepository.create({
      user: userId,
      type: 'board_invitation',
      title: 'Te agregaron a un board',
      message: `Has sido agregado al board "${board.name}" como ${role === 'admin' ? 'administrador' : role === 'member' ? 'miembro' : 'visualizador'}`,
      data: {
        boardId: board.id,
        fromUser: req.user.id
      },
      link: `/boards/${board.id}`
    });

    // Emitir notificación en tiempo real al usuario
    const io = getIO();
    io.to(`user:${userId}`).emit('notification', notification);
    
    // Emitir actualización del board a todos los miembros
    io.to(`board:${board.id}`).emit('board:member-added', {
      boardId: board.id,
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
