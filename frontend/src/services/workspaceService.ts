import api from '@/lib/api';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: 'admin' | 'member' | 'viewer';
    joinedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  description?: string;
}

export interface AddMemberDto {
  userId: string;
  role: 'admin' | 'member' | 'viewer';
}

class WorkspaceService {
  // Obtener todos los workspaces del usuario
  async getWorkspaces(): Promise<Workspace[]> {
    const response = await api.get('/workspaces');
    return response.data.data;
  }

  // Obtener un workspace por ID
  async getWorkspaceById(id: string): Promise<Workspace> {
    const response = await api.get(`/workspaces/${id}`);
    return response.data.data;
  }

  // Crear un nuevo workspace
  async createWorkspace(data: CreateWorkspaceDto): Promise<Workspace> {
    const response = await api.post('/workspaces', data);
    return response.data.data;
  }

  // Actualizar un workspace
  async updateWorkspace(id: string, data: UpdateWorkspaceDto): Promise<Workspace> {
    const response = await api.put(`/workspaces/${id}`, data);
    return response.data.data;
  }

  // Eliminar un workspace
  async deleteWorkspace(id: string): Promise<void> {
    await api.delete(`/workspaces/${id}`);
  }

  // Agregar miembro al workspace
  async addMember(workspaceId: string, data: AddMemberDto): Promise<Workspace> {
    const response = await api.post(`/workspaces/${workspaceId}/members`, data);
    return response.data.data;
  }

  // Eliminar miembro del workspace
  async removeMember(workspaceId: string, userId: string): Promise<Workspace> {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
    return response.data.data;
  }

  // Actualizar rol de miembro
  async updateMemberRole(workspaceId: string, userId: string, role: 'admin' | 'member' | 'viewer'): Promise<Workspace> {
    const response = await api.put(`/workspaces/${workspaceId}/members/${userId}`, { role });
    return response.data.data;
  }
}

export default new WorkspaceService();
