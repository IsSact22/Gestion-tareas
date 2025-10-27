import { create } from 'zustand';
import taskService, { Task, CreateTaskDto, UpdateTaskDto, MoveTaskDto, Comment } from '@/services/taskService';
import socketService from '@/services/socketService';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: (boardId: string) => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  createTask: (data: CreateTaskDto) => Promise<Task | null>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (data: MoveTaskDto) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  deleteComment: (taskId: string, commentId: string) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  setCurrentTask: (task: Task | null) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Cargando tareas para board:', boardId);
      const tasks = await taskService.getTasks(boardId);
      console.log('✅ Tareas cargadas:', tasks.length, tasks);
      set({ tasks, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar tareas';
      console.error('❌ Error al cargar tareas:', error);
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  fetchTaskById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await taskService.getTaskById(id);
      set({ currentTask: task, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar tarea';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createTask: async (data: CreateTaskDto) => {
    set({ isLoading: true, error: null });
    try {
      console.log('📝 Creando tarea:', data);
      const newTask = await taskService.createTask(data);
      console.log('✅ Tarea creada:', newTask);
      
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));

      // Emitir evento Socket.IO
      socketService.emitTaskCreated(data.boardId, newTask);

      toast.success('Tarea creada exitosamente');
      return newTask;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear tarea';
      console.error('❌ Error al crear tarea:', error);
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateTask: async (id: string, data: UpdateTaskDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskService.updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === id ? updatedTask : task)),
        currentTask: state.currentTask?._id === id ? updatedTask : state.currentTask,
        isLoading: false,
      }));

      // Emitir evento Socket.IO
      const task = get().tasks.find(t => t._id === id);
      if (task) {
        socketService.emitTaskUpdated(task.board, updatedTask);
      }

      toast.success('Tarea actualizada exitosamente');
      return updatedTask;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar tarea';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = get().tasks.find(t => t._id === id);
      await taskService.deleteTask(id);
      
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
        isLoading: false,
      }));

      // Emitir evento Socket.IO
      if (task) {
        socketService.emitTaskDeleted(task.board, id);
      }

      toast.success('Tarea eliminada exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar tarea';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  moveTask: async (data: MoveTaskDto) => {
    try {
      const movedTask = await taskService.moveTask(data);
      
      set((state) => ({
        tasks: state.tasks.map((task) => 
          task._id === data.taskId ? movedTask : task
        ),
      }));

      // Emitir evento Socket.IO
      const task = get().tasks.find(t => t._id === data.taskId);
      if (task) {
        socketService.emitTaskMoved(
          task.board,
          data.taskId,
          data.fromColumnId,
          data.toColumnId,
          data.position
        );
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al mover tarea';
      toast.error(errorMessage);
      // Revertir el cambio optimista si falla
      get().fetchTasks(get().tasks[0]?.board || '');
    }
  },

  addComment: async (taskId: string, content: string) => {
    try {
      const newComment = await taskService.addComment(taskId, content);
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId
            ? { ...task, comments: [...task.comments, newComment] }
            : task
        ),
        currentTask: state.currentTask?._id === taskId
          ? { ...state.currentTask, comments: [...state.currentTask.comments, newComment] }
          : state.currentTask,
      }));

      toast.success('Comentario agregado');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al agregar comentario';
      toast.error(errorMessage);
    }
  },

  deleteComment: async (taskId: string, commentId: string) => {
    try {
      await taskService.deleteComment(taskId, commentId);
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId
            ? { ...task, comments: task.comments.filter(c => c._id !== commentId) }
            : task
        ),
        currentTask: state.currentTask?._id === taskId
          ? { ...state.currentTask, comments: state.currentTask.comments.filter(c => c._id !== commentId) }
          : state.currentTask,
      }));

      toast.success('Comentario eliminado');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar comentario';
      toast.error(errorMessage);
    }
  },

  setTasks: (tasks: Task[]) => set({ tasks }),
  
  addTask: (task: Task) => {
    set((state) => ({
      tasks: [...state.tasks, task]
    }));
  },

  removeTask: (id: string) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id)
    }));
  },

  setCurrentTask: (task: Task | null) => set({ currentTask: task }),

  clearTasks: () => set({ tasks: [], currentTask: null, error: null }),
}));
