import { useEffect } from 'react';
import socketService from '@/services/socketService';
// import { useAuthStore } from '@/store/authStore';

/**
 * Hook para inicializar Socket.IO automáticamente
 * TEMPORALMENTE DESHABILITADO - Vercel no soporta WebSockets
 */
export function useSocket() {
  // const { token, isAuthenticated } = useAuthStore();
  // const connectionAttempted = useRef(false);

  useEffect(() => {
    // SOCKET.IO DESHABILITADO TEMPORALMENTE
    // Vercel no soporta WebSockets - se necesita Railway, Render, etc.
    
    /* if (isAuthenticated && token && !connectionAttempted.current) {
      connectionAttempted.current = true;
      console.log('🔌 Intentando conectar Socket.IO con token:', token.substring(0, 20) + '...');
      
      // Conectar al socket
      socketService.connect(token);

      // Cleanup al desmontar
      return () => {
        // No desconectamos aquí para mantener la conexión activa
        // socketService.disconnect();
      };
    } */
  }, []);

  return socketService;
}

/**
 * Hook para unirse automáticamente a un board
 */
export function useBoardSocket(boardId: string | null) {
  const socket = useSocket();

  useEffect(() => {
    if (boardId && socket.isConnected()) {
      socket.joinBoard(boardId);

      return () => {
        socket.leaveBoard(boardId);
      };
    }
  }, [boardId, socket]);

  return socket;
}

/**
 * Hook para unirse automáticamente a un workspace
 */
export function useWorkspaceSocket(workspaceId: string | null) {
  const socket = useSocket();

  useEffect(() => {
    if (workspaceId && socket.isConnected()) {
      socket.joinWorkspace(workspaceId);

      return () => {
        socket.leaveWorkspace(workspaceId);
      };
    }
  }, [workspaceId, socket]);

  return socket;
}
