/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import workspaceService, { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto } from '@/services/workspaceService';
import socketService from '@/services/socketService';
import toast from 'react-hot-toast';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWorkspaces: () => Promise<void>;
  fetchWorkspaceById: (id: string) => Promise<void>;
  createWorkspace: (data: CreateWorkspaceDto) => Promise<Workspace | null>;
  updateWorkspace: (id: string, data: UpdateWorkspaceDto) => Promise<Workspace | null>;
  deleteWorkspace: (id: string) => Promise<boolean>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  clearError: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const workspaces = await workspaceService.getWorkspaces();
      set({ workspaces, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar workspaces';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  fetchWorkspaceById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const workspace = await workspaceService.getWorkspaceById(id);
      set({ currentWorkspace: workspace, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar workspace';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createWorkspace: async (data: CreateWorkspaceDto) => {
    set({ isLoading: true, error: null });
    try {
      const newWorkspace = await workspaceService.createWorkspace(data);
      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
        isLoading: false,
      }));
      toast.success('Workspace creado exitosamente');
      return newWorkspace;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear workspace';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateWorkspace: async (id: string, data: UpdateWorkspaceDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedWorkspace = await workspaceService.updateWorkspace(id, data);
      set((state) => ({
        workspaces: state.workspaces.map((w) =>
          w.id === id ? updatedWorkspace : w
        ),
        currentWorkspace: state.currentWorkspace?.id === id ? updatedWorkspace : state.currentWorkspace,
        isLoading: false,
      }));
      toast.success('Workspace actualizado exitosamente');
      return updatedWorkspace;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar workspace';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteWorkspace: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await workspaceService.deleteWorkspace(id);
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w.id !== id),
        currentWorkspace: state.currentWorkspace?.id === id ? null : state.currentWorkspace,
        isLoading: false,
      }));
      toast.success('Workspace eliminado exitosamente');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar workspace';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  setCurrentWorkspace: (workspace: Workspace | null) => {
    set({ currentWorkspace: workspace });
  },

  clearError: () => {
    set({ error: null });
  },
}));
