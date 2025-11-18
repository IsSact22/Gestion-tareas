/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

type SocketCallback = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Conectar al servidor Socket.IO
   */
  connect(token: string) {
    if (this.socket?.connected) {
      console.log('✅ Socket.IO ya está conectado');
      return;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventListeners();
  }

  /**
   * Configurar listeners de eventos del socket
   */
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Conectado a Socket.IO:', this.socket?.id);
      this.reconnectAttempts = 0;
      toast.success('Conectado en tiempo real', { duration: 2000 });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Desconectado de Socket.IO:', reason);
      if (reason === 'io server disconnect') {
        // El servidor desconectó, intentar reconectar manualmente
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('No se pudo conectar al servidor en tiempo real');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconectado después de ${attemptNumber} intentos`);
      toast.success('Reconectado', { duration: 2000 });
    });
  }

  /**
   * Desconectar del servidor
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('👋 Socket.IO desconectado');
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // ==================== WORKSPACE METHODS ====================
  
  joinWorkspace(workspaceId: string) {
    this.socket?.emit('join:workspace', workspaceId);
  }

  leaveWorkspace(workspaceId: string) {
    this.socket?.emit('leave:workspace', workspaceId);
  }

  onWorkspaceUpdated(callback: SocketCallback) {
    this.socket?.on('workspace:updated', callback);
  }

  // ==================== BOARD METHODS ====================
  
  joinBoard(boardId: string) {
    this.socket?.emit('join:board', boardId);
    console.log(`📋 Uniéndose al board: ${boardId}`);
  }

  leaveBoard(boardId: string) {
    this.socket?.emit('leave:board', boardId);
    console.log(`👋 Saliendo del board: ${boardId}`);
  }

  emitBoardUpdated(boardId: string, board: any, workspaceId?: string) {
    this.socket?.emit('board:updated', { boardId, board, workspaceId });
  }

  onBoardUpdated(callback: SocketCallback) {
    this.socket?.on('board:updated', callback);
  }

  onUserJoined(callback: SocketCallback) {
    this.socket?.on('user:joined', callback);
  }

  onUserLeft(callback: SocketCallback) {
    this.socket?.on('user:left', callback);
  }

  // ==================== TASK METHODS ====================
  
  emitTaskCreated(boardId: string, task: any) {
    this.socket?.emit('task:created', { boardId, task });
  }

  emitTaskUpdated(boardId: string, task: any) {
    this.socket?.emit('task:updated', { boardId, task, taskId: task._id });
  }

  emitTaskDeleted(boardId: string, taskId: string) {
    this.socket?.emit('task:deleted', { boardId, taskId });
  }

  emitTaskMoved(boardId: string, taskId: string, fromColumnId: string, toColumnId: string, position: number) {
    this.socket?.emit('task:moved', { boardId, taskId, fromColumnId, toColumnId, position });
  }

  onTaskCreated(callback: SocketCallback) {
    this.socket?.on('task:created', callback);
  }

  onTaskUpdated(callback: SocketCallback) {
    this.socket?.on('task:updated', callback);
  }

  onTaskDeleted(callback: SocketCallback) {
    this.socket?.on('task:deleted', callback);
  }

  onTaskMoved(callback: SocketCallback) {
    this.socket?.on('task:moved', callback);
  }

  // ==================== COLUMN METHODS ====================
  
  emitColumnCreated(boardId: string, column: any) {
    this.socket?.emit('column:created', { boardId, column });
  }

  emitColumnUpdated(boardId: string, column: any) {
    this.socket?.emit('column:updated', { boardId, column, columnId: column._id });
  }

  emitColumnDeleted(boardId: string, columnId: string) {
    this.socket?.emit('column:deleted', { boardId, columnId });
  }

  emitColumnReordered(boardId: string, columns: any[]) {
    this.socket?.emit('column:reordered', { boardId, columns });
  }

  onColumnCreated(callback: SocketCallback) {
    this.socket?.on('column:created', callback);
  }

  onColumnUpdated(callback: SocketCallback) {
    this.socket?.on('column:updated', callback);
  }

  onColumnDeleted(callback: SocketCallback) {
    this.socket?.on('column:deleted', callback);
  }

  onColumnReordered(callback: SocketCallback) {
    this.socket?.on('column:reordered', callback);
  }

  // ==================== TYPING INDICATOR ====================
  
  emitTypingStart(boardId: string, taskId?: string) {
    this.socket?.emit('typing:start', { boardId, taskId });
  }

  emitTypingStop(boardId: string, taskId?: string) {
    this.socket?.emit('typing:stop', { boardId, taskId });
  }

  onTypingStart(callback: SocketCallback) {
    this.socket?.on('typing:start', callback);
  }

  onTypingStop(callback: SocketCallback) {
    this.socket?.on('typing:stop', callback);
  }

  // ==================== CLEANUP ====================
  
  /**
   * Escuchar cualquier evento personalizado
   */
  on(event: string, callback: SocketCallback) {
    this.socket?.on(event, callback);
  }

  /**
   * Remover todos los listeners de un evento
   */
  off(event: string) {
    this.socket?.off(event);
  }

  /**
   * Remover todos los listeners
   */
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();
