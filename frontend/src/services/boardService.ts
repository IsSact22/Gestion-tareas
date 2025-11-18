/* eslint-disable import/no-anonymous-default-export */
import api from '@/lib/api';

export interface Board {
  id: string;
  name: string;
  description?: string;
  workspace: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    user: {
      id: string;
      avatar: string | Blob | undefined;
      name: string;
      email: string;
    };
    role: 'admin' | 'member' | 'viewer';
    joinedAt: string;
  }>;
  color?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardDto {
  name: string;
  description?: string;
  workspaceId: string;
  color?: string;
}

export interface UpdateBoardDto {
  name?: string;
  description?: string;
  color?: string;
  isFavorite?: boolean;
}

class BoardService {
  // Obtener todos los boards del usuario
  async getBoards(workspaceId?: string): Promise<Board[]> {
    const params = workspaceId ? { workspaceId } : {};
    const response = await api.get('/boards', { params });
    return response.data.data;
  }

  // Obtener un board por ID
  async getBoardById(id: string): Promise<Board> {
    const response = await api.get(`/boards/${id}`);
    return response.data.data;
  }

  // Crear un nuevo board
  async createBoard(data: CreateBoardDto): Promise<Board> {
    const response = await api.post('/boards', data);
    return response.data.data;
  }

  // Actualizar un board
  async updateBoard(id: string, data: UpdateBoardDto): Promise<Board> {
    const response = await api.put(`/boards/${id}`, data);
    return response.data.data;
  }

  // Eliminar un board
  async deleteBoard(id: string): Promise<void> {
    await api.delete(`/boards/${id}`);
  }

  // Marcar/desmarcar como favorito
  async toggleFavorite(id: string): Promise<Board> {
    const response = await api.post(`/boards/${id}/favorite`);
    return response.data.data;
  }

  // Agregar miembro al board
  async addMember(boardId: string, email: string, role: 'admin' | 'member' | 'viewer'): Promise<Board> {
    const response = await api.post(`/boards/${boardId}/members`, { email, role });
    return response.data.data;
  }

  // Eliminar miembro del board
  async removeMember(boardId: string, userId: string): Promise<Board> {
    const response = await api.delete(`/boards/${boardId}/members/${userId}`);
    return response.data.data;
  }
}

export default new BoardService();
