import api from '../lib/api';

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

const teamService = {
  // Obtener todos los teams del usuario
  async getTeams(): Promise<Team[]> {
    try {
      const response = await api.get('/teams');
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener teams:', error);
      throw error;
    }
  },

  // Obtener un team específico
  async getTeamById(id: string): Promise<Team> {
    try {
      const response = await api.get(`/teams/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener team:', error);
      throw error;
    }
  },

  // Crear un nuevo team
  async createTeam(data: { name: string; description?: string }): Promise<Team> {
    try {
      const response = await api.post('/teams', data);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear team:', error);
      throw error;
    }
  },

  // Actualizar un team
  async updateTeam(id: string, data: { name?: string; description?: string }): Promise<Team> {
    try {
      const response = await api.put(`/teams/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar team:', error);
      throw error;
    }
  },

  // Eliminar un team
  async deleteTeam(id: string): Promise<void> {
    try {
      await api.delete(`/teams/${id}`);
    } catch (error) {
      console.error('Error al eliminar team:', error);
      throw error;
    }
  },

  // Obtener miembros de un team
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener miembros del team:', error);
      throw error;
    }
  },

  // Agregar un miembro a un team
  async addTeamMember(teamId: string, userId: string, role: string = 'member'): Promise<TeamMember> {
    try {
      const response = await api.post(`/teams/${teamId}/members`, { userId, role });
      return response.data.data;
    } catch (error) {
      console.error('Error al agregar miembro al team:', error);
      throw error;
    }
  },

  // Remover un miembro de un team
  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    try {
      await api.delete(`/teams/${teamId}/members`, { data: { userId } });
    } catch (error) {
      console.error('Error al remover miembro del team:', error);
      throw error;
    }
  },
};

export default teamService;
