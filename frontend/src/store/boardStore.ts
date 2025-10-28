import { create } from 'zustand';
import boardService, { Board, CreateBoardDto, UpdateBoardDto } from '@/services/boardService';
import socketService from '@/services/socketService';
import toast from 'react-hot-toast';

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBoards: (workspaceId?: string) => Promise<void>;
  fetchBoardById: (id: string) => Promise<void>;
  createBoard: (data: CreateBoardDto) => Promise<Board | null>;
  updateBoard: (id: string, data: UpdateBoardDto) => Promise<Board | null>;
  deleteBoard: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<void>;
  setCurrentBoard: (board: Board | null) => void;
  clearError: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  currentBoard: null,
  isLoading: false,
  error: null,

  fetchBoards: async (workspaceId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const boards = await boardService.getBoards(workspaceId);
      set({ boards, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar boards';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  fetchBoardById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const board = await boardService.getBoardById(id);
      set({ currentBoard: board, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar board';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createBoard: async (data: CreateBoardDto) => {
    set({ isLoading: true, error: null });
    try {
      const newBoard = await boardService.createBoard(data);
      set((state) => ({
        boards: [...state.boards, newBoard],
        isLoading: false,
      }));
      
      // Emitir evento Socket.IO
      socketService.emitBoardUpdated(newBoard._id, newBoard, data.workspaceId);
      
      toast.success('Board creado exitosamente');
      return newBoard;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear board';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateBoard: async (id: string, data: UpdateBoardDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBoard = await boardService.updateBoard(id, data);
      set((state) => ({
        boards: state.boards.map((b) => (b._id === id ? updatedBoard : b)),
        currentBoard: state.currentBoard?._id === id ? updatedBoard : state.currentBoard,
        isLoading: false,
      }));
      
      // Emitir evento Socket.IO
      socketService.emitBoardUpdated(id, updatedBoard, updatedBoard.workspace._id);
      
      toast.success('Board actualizado exitosamente');
      return updatedBoard;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar board';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteBoard: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await boardService.deleteBoard(id);
      set((state) => ({
        boards: state.boards.filter((b) => b._id !== id),
        currentBoard: state.currentBoard?._id === id ? null : state.currentBoard,
        isLoading: false,
      }));
      toast.success('Board eliminado exitosamente');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar board';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  toggleFavorite: async (id: string) => {
    try {
      const updatedBoard = await boardService.toggleFavorite(id);
      set((state) => ({
        boards: state.boards.map((b) => (b._id === id ? updatedBoard : b)),
        currentBoard: state.currentBoard?._id === id ? updatedBoard : state.currentBoard,
      }));
      toast.success(updatedBoard.isFavorite ? 'Agregado a favoritos' : 'Removido de favoritos');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar favorito';
      toast.error(errorMessage);
    }
  },

  setCurrentBoard: (board: Board | null) => {
    set({ currentBoard: board });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Escuchar eventos de Socket.IO para actualizar boards en tiempo real
socketService.on('board:member-added', (data: { boardId: string; member: any }) => {
  console.log('🔔 Nuevo miembro agregado al board:', data);
  
  // Recargar la lista de boards para mostrar el nuevo board
  const state = useBoardStore.getState();
  state.fetchBoards();
  
  // Si estamos viendo ese board, recargarlo
  if (state.currentBoard?._id === data.boardId) {
    state.fetchBoardById(data.boardId);
  }
});
