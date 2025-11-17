'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { CheckSquare, AlertCircle, Clock, CheckCircle2, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/lib/api';
import QuickTaskActions from '@/components/admin/QuickTaskActions';

interface Task {
  id: string;
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  board: {
    _id: string;
    name: string;
  };
  column: {
    _id: string;
    name: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
  };
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTasksPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  // Verificar que el usuario sea admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      toast.error('No tienes permisos para acceder a esta página');
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Cargar todas las tareas (necesitamos un endpoint especial para admin)
  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tasks/admin/all');
      const tasksData = response.data.data;
      setTasks(tasksData);
      
      // Calcular estadísticas
      setStats({
        total: tasksData.length,
        todo: tasksData.filter((t: Task) => t.status === 'todo').length,
        inProgress: tasksData.filter((t: Task) => t.status === 'in-progress').length,
        done: tasksData.filter((t: Task) => t.status === 'done').length,
        high: tasksData.filter((t: Task) => t.priority === 'high').length,
        medium: tasksData.filter((t: Task) => t.priority === 'medium').length,
        low: tasksData.filter((t: Task) => t.priority === 'low').length,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar tareas');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'todo': 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'done': 'bg-green-100 text-green-700',
    };
    
    const labels = {
      'todo': 'Por hacer',
      'in-progress': 'En progreso',
      'done': 'Completada',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // Filtrar tareas
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Tareas</h1>
        <p className="text-gray-600">Vista general de todas las tareas del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Por hacer</p>
              <p className="text-2xl font-bold text-gray-600">{stats.todo}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">En progreso</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.done}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Priority Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Prioridad Alta</p>
              <p className="text-2xl font-bold text-red-600">{stats.high}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Prioridad Media</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Prioridad Baja</p>
              <p className="text-2xl font-bold text-green-600">{stats.low}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Estado
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="todo">Por hacer</option>
              <option value="in-progress">En progreso</option>
              <option value="done">Completadas</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Prioridad
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarea
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Board
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignado a
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr
                  key={task._id || task.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    const boardId = typeof task.board === 'string' ? task.board : task.board._id;
                    router.push(`/boards/${boardId}`);
                  }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {typeof task.board === 'string' ? task.board : task.board.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {typeof task.column === 'string' ? task.column : task.column.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(task.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(task.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.assignedTo && task.assignedTo.name ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {task.assignedTo.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {task.assignedTo.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <QuickTaskActions
                      taskId={task._id}
                      currentStatus={task.status}
                      currentPriority={task.priority}
                      onUpdate={fetchAllTasks}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <Card className="p-12 text-center mt-6">
          <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay tareas</h3>
          <p className="text-gray-600">
            {filterStatus !== 'all' || filterPriority !== 'all'
              ? 'No se encontraron tareas con los filtros seleccionados'
              : 'Aún no se han creado tareas en el sistema'}
          </p>
        </Card>
      )}
    </div>
  );
}
