/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import columnService, { Column, CreateColumnDto, UpdateColumnDto } from '@/services/columnService';
import socketService from '@/services/socketService';
import toast from 'react-hot-toast';

interface ColumnState {
  columns: Column[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchColumns: (boardId: string) => Promise<void>;
  createColumn: (data: CreateColumnDto) => Promise<Column | null>;
  updateColumn: (id: string, data: UpdateColumnDto) => Promise<Column | null>;
  deleteColumn: (id: string) => Promise<void>;
  reorderColumns: (boardId: string, columns: { id: string; position: number }[]) => Promise<void>;
  setColumns: (columns: Column[]) => void;
  addColumn: (column: Column) => void;
  removeColumn: (id: string) => void;
  clearColumns: () => void;
}

export const useColumnStore = create<ColumnState>((set, get) => ({
  columns: [],
  isLoading: false,
  error: null,

  fetchColumns: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Cargando columnas para board:', boardId);
      const columns = await columnService.getColumns(boardId);
      console.log('✅ Columnas cargadas:', columns.length, columns);
      set({ columns, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar columnas';
      console.error('❌ Error al cargar columnas:', error);
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createColumn: async (data: CreateColumnDto) => {
    set({ isLoading: true, error: null });
    try {
      const newColumn = await columnService.createColumn(data);
      set((state) => ({
        columns: [...state.columns, newColumn],
        isLoading: false,
      }));

      // Emitir evento Socket.IO
      socketService.emitColumnCreated(data.boardId, newColumn);

      toast.success('Columna creada exitosamente');
      return newColumn;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear columna';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateColumn: async (id: string, data: UpdateColumnDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedColumn = await columnService.updateColumn(id, data);
      set((state) => ({
        columns: state.columns.map((col) => (col.id === id ? updatedColumn : col)),
        isLoading: false,
      }));

      // Emitir evento Socket.IO
      const column = get().columns.find(c => c.id === id);
      if (column) {
        socketService.emitColumnUpdated(column.board, updatedColumn);
      }

      toast.success('Columna actualizada exitosamente');
      return updatedColumn;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar columna';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteColumn: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const column = get().columns.find(c => c.id === id);
      await columnService.deleteColumn(id);
      
      set((state) => ({
        columns: state.columns.filter((col) => col.id !== id),
        isLoading: false,
      }));

      // Emitir evento Socket.IO
      if (column) {
        socketService.emitColumnDeleted(column.board, id);
      }

      toast.success('Columna eliminada exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar columna';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  reorderColumns: async (boardId: string, columnsOrder: { id: string; position: number }[]) => {
    try {
      const reorderedColumns = await columnService.reorderColumns(boardId, columnsOrder);
      set({ columns: reorderedColumns });

      // Emitir evento Socket.IO
      socketService.emitColumnReordered(boardId, reorderedColumns);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al reordenar columnas';
      toast.error(errorMessage);
    }
  },

  setColumns: (columns: Column[]) => set({ columns }),
  
  addColumn: (column: Column) => {
    set((state) => ({
      columns: [...state.columns, column]
    }));
  },

  removeColumn: (id: string) => {
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== id)
    }));
  },

  clearColumns: () => set({ columns: [], error: null }),
}));
