import api from '../lib/api';

export interface Column {
  id: string;
  name: string;
  board: string;
  position: number;
  tasks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateColumnDto {
  name: string;
  boardId: string;
  position?: number;
}

export interface UpdateColumnDto {
  name?: string;
  position?: number;
}

class ColumnService {
  /**
   * Obtener todas las columnas de un board
   */
  async getColumns(boardId: string): Promise<Column[]> {
    const response = await api.get(`/columns?boardId=${boardId}`);
    return response.data.data;
  }

  /**
   * Obtener una columna por ID
   */
  async getColumnById(id: string): Promise<Column> {
    const response = await api.get(`/columns/${id}`);
    return response.data.data;
  }

  /**
   * Crear una nueva columna
   */
  async createColumn(data: CreateColumnDto): Promise<Column> {
    const response = await api.post('/columns', data);
    return response.data.data;
  }

  /**
   * Actualizar una columna
   */
  async updateColumn(id: string, data: UpdateColumnDto): Promise<Column> {
    const response = await api.put(`/columns/${id}`, data);
    return response.data.data;
  }

  /**
   * Eliminar una columna
   */
  async deleteColumn(id: string): Promise<void> {
    await api.delete(`/columns/${id}`);
  }

  /**
   * Reordenar columnas
   */
  async reorderColumns(boardId: string, columns: { id: string; position: number }[]): Promise<Column[]> {
    const response = await api.put(`/columns/reorder`, { boardId, columns });
    return response.data.data;
  }
}

export default new ColumnService();
