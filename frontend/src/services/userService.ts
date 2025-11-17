import api from '../lib/api';

export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
}

class UserService {
  /**
   * Buscar usuario por email
   */
  async searchByEmail(email: string): Promise<User | null> {
    try {
      const response = await api.get(`/users/search?q=${email}`);
      const users = response.data.data;
      // Buscar el usuario exacto por email
      const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
      return user || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data;
  }

  /**
   * Actualizar perfil
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/users/profile', data);
    return response.data.data;
  }
}

export default new UserService();
