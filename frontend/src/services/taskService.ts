import api from '../lib/api';

export interface Task {
  id: string;
  _id: string;
  title: string;
  description?: string;
  column: string;
  board: string | { _id: string; name: string; color: string };
  position: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  }[];
  tags: string[];
  dueDate?: string;
  attachments: string[];
  comments: Comment[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  columnId: string;
  boardId: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string[];
  tags?: string[];
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'todo' | 'in_progress' | 'review' | 'done';
  assignedTo?: string[];
  tags?: string[];
  dueDate?: string;
}

export interface MoveTaskDto {
  taskId: string;
  fromColumnId: string;
  toColumnId: string;
  position: number;
}

class TaskService {
  /**
   * Obtener todas las tareas de un board
   */
  async getTasks(boardId: string): Promise<Task[]> {
    const response = await api.get(`/tasks?boardId=${boardId}`);
    return response.data.data;
  }

  /**
   * Obtener una tarea por ID
   */
  async getTaskById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  }

  /**
   * Crear una nueva tarea
   */
  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await api.post('/tasks', data);
    return response.data.data;
  }

  /**
   * Actualizar una tarea
   */
  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar una tarea
   */
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }

  /**
   * Mover una tarea a otra columna
   */
  async moveTask(data: MoveTaskDto): Promise<Task> {
    const response = await api.post(`/tasks/${data.taskId}/move`, {
      newColumnId: data.toColumnId,
      newPosition: data.position
    });
    return response.data.data;
  }

  /**
   * Agregar comentario a una tarea
   */
  async addComment(taskId: string, content: string): Promise<Comment> {
    const response = await api.post(`/tasks/${taskId}/comments`, { text: content });
    return response.data.data;
  }

  /**
   * Eliminar comentario
   */
  async deleteComment(taskId: string, commentId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
  }

  /**
   * Buscar tareas
   */
  async searchTasks(query: string): Promise<Task[]> {
    const response = await api.get(`/tasks/search?q=${query}`);
    return response.data.data;
  }

  /**
   * Obtener mis tareas (asignadas al usuario actual)
   */
  async getMyTasks(): Promise<Task[]> {
    const response = await api.get('/tasks/my-tasks');
    return response.data.data;
  }
}

export default new TaskService();
