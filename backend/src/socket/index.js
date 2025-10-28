import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

let io;

// Middleware de autenticación para Socket.IO
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Aplicar middleware de autenticación
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`✅ Usuario conectado: ${socket.userId} (${socket.id})`);

    // Unir al usuario a su room personal para notificaciones
    socket.join(`user:${socket.userId}`);
    console.log(`👤 Usuario ${socket.userId} unido a su room personal`);

    // ==================== WORKSPACE EVENTS ====================
    socket.on('join:workspace', (workspaceId) => {
      socket.join(`workspace:${workspaceId}`);
      console.log(`👤 Usuario ${socket.userId} se unió al workspace ${workspaceId}`);
    });

    socket.on('leave:workspace', (workspaceId) => {
      socket.leave(`workspace:${workspaceId}`);
      console.log(`👋 Usuario ${socket.userId} salió del workspace ${workspaceId}`);
    });

    // ==================== BOARD EVENTS ====================
    socket.on('join:board', (boardId) => {
      socket.join(`board:${boardId}`);
      console.log(`📋 Usuario ${socket.userId} se unió al board ${boardId}`);
      
      // Notificar a otros usuarios que alguien se unió
      socket.to(`board:${boardId}`).emit('user:joined', {
        userId: socket.userId,
        userEmail: socket.userEmail,
        timestamp: new Date()
      });
    });

    socket.on('leave:board', (boardId) => {
      socket.leave(`board:${boardId}`);
      console.log(`👋 Usuario ${socket.userId} salió del board ${boardId}`);
      
      // Notificar a otros usuarios que alguien salió
      socket.to(`board:${boardId}`).emit('user:left', {
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // ==================== TASK EVENTS ====================
    socket.on('task:created', (data) => {
      console.log(`✨ Tarea creada en board ${data.boardId}`);
      socket.to(`board:${data.boardId}`).emit('task:created', {
        task: data.task,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    socket.on('task:updated', (data) => {
      console.log(`📝 Tarea actualizada: ${data.taskId}`);
      socket.to(`board:${data.boardId}`).emit('task:updated', {
        task: data.task,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    socket.on('task:deleted', (data) => {
      console.log(`🗑️ Tarea eliminada: ${data.taskId}`);
      socket.to(`board:${data.boardId}`).emit('task:deleted', {
        taskId: data.taskId,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    socket.on('task:moved', (data) => {
      console.log(`🔄 Tarea movida: ${data.taskId}`);
      socket.to(`board:${data.boardId}`).emit('task:moved', {
        taskId: data.taskId,
        fromColumnId: data.fromColumnId,
        toColumnId: data.toColumnId,
        position: data.position,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // ==================== COLUMN EVENTS ====================
    socket.on('column:created', (data) => {
      console.log(`📊 Columna creada en board ${data.boardId}`);
      socket.to(`board:${data.boardId}`).emit('column:created', {
        column: data.column,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    socket.on('column:updated', (data) => {
      console.log(`📝 Columna actualizada: ${data.columnId}`);
      socket.to(`board:${data.boardId}`).emit('column:updated', {
        column: data.column,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    socket.on('column:deleted', (data) => {
      console.log(`🗑️ Columna eliminada: ${data.columnId}`);
      socket.to(`board:${data.boardId}`).emit('column:deleted', {
        columnId: data.columnId,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    socket.on('column:reordered', (data) => {
      console.log(`🔄 Columnas reordenadas en board ${data.boardId}`);
      socket.to(`board:${data.boardId}`).emit('column:reordered', {
        columns: data.columns,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // ==================== BOARD EVENTS ====================
    socket.on('board:updated', (data) => {
      console.log(`📋 Board actualizado: ${data.boardId}`);
      socket.to(`board:${data.boardId}`).emit('board:updated', {
        board: data.board,
        userId: socket.userId,
        timestamp: new Date()
      });
      
      // También notificar al workspace
      if (data.workspaceId) {
        socket.to(`workspace:${data.workspaceId}`).emit('board:updated', {
          board: data.board,
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });

    // ==================== WORKSPACE EVENTS ====================
    socket.on('workspace:updated', (data) => {
      console.log(`🏢 Workspace actualizado: ${data.workspaceId}`);
      socket.to(`workspace:${data.workspaceId}`).emit('workspace:updated', {
        workspace: data.workspace,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // ==================== TYPING INDICATOR ====================
    socket.on('typing:start', (data) => {
      socket.to(`board:${data.boardId}`).emit('typing:start', {
        userId: socket.userId,
        userEmail: socket.userEmail,
        taskId: data.taskId
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`board:${data.boardId}`).emit('typing:stop', {
        userId: socket.userId,
        taskId: data.taskId
      });
    });

    // ==================== DISCONNECT ====================
    socket.on('disconnect', () => {
      console.log(`❌ Usuario desconectado: ${socket.userId} (${socket.id})`);
    });
  });

  return io;
}

// Función helper para emitir eventos desde otros módulos
function emitToBoard(boardId, event, data) {
  if (io) {
    io.to(`board:${boardId}`).emit(event, data);
  }
}

function emitToWorkspace(workspaceId, event, data) {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit(event, data);
  }
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado');
  }
  return io;
}

export {
  initializeSocket,
  emitToBoard,
  emitToWorkspace,
  getIO
};
