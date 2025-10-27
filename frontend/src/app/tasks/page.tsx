'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBoardStore } from '@/store/boardStore';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/services/taskService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, CheckSquare, Calendar, AlertCircle, Folder, ArrowRight } from 'lucide-react';

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
};

const statusLabels = {
  todo: 'Por hacer',
  in_progress: 'En progreso',
  review: 'En revisión',
  done: 'Completado',
};

export default function TasksPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { boards, fetchBoards } = useBoardStore();
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMyTasks = async () => {
      setIsLoading(true);
      try {
        // Cargar todos los boards del usuario
        await fetchBoards();
        
        // Aquí deberías hacer una petición al backend para obtener
        // solo las tareas asignadas al usuario actual
        // Por ahora, simulamos con un array vacío
        setMyTasks([]);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMyTasks();
  }, [fetchBoards]);

  const filteredTasks = myTasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const tasksByStatus = {
    todo: myTasks.filter(t => t.status === 'todo').length,
    in_progress: myTasks.filter(t => t.status === 'in_progress').length,
    review: myTasks.filter(t => t.status === 'review').length,
    done: myTasks.filter(t => t.status === 'done').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
          <p className="text-gray-600 mt-1">
            Todas las tareas asignadas a ti en todos los boards
          </p>
        </div>
        <Button 
          variant="primary" 
          size="md"
          onClick={() => router.push('/boards')}
        >
          <Folder className="w-4 h-4 mr-2" />
          Ver Boards
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Por hacer</p>
              <p className="text-2xl font-bold text-gray-900">{tasksByStatus.todo}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En progreso</p>
              <p className="text-2xl font-bold text-blue-600">{tasksByStatus.in_progress}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En revisión</p>
              <p className="text-2xl font-bold text-orange-600">{tasksByStatus.review}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{tasksByStatus.done}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas ({myTasks.length})
        </button>
        <button
          onClick={() => setFilter('todo')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'todo'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Por hacer ({tasksByStatus.todo})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'in_progress'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          En progreso ({tasksByStatus.in_progress})
        </button>
        <button
          onClick={() => setFilter('done')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'done'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completadas ({tasksByStatus.done})
        </button>
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card 
              key={task._id} 
              variant="bordered" 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/boards/${task.board}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}>
                      {priorityLabels[task.priority]}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {statusLabels[task.status]}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(task.dueDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex gap-1">
                        {task.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowRight size={20} className="text-gray-400" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card variant="bordered">
          <div className="text-center py-16">
            <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes tareas asignadas
            </h3>
            <p className="text-gray-600 mb-6">
              Las tareas que te asignen en los boards aparecerán aquí
            </p>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => router.push('/boards')}
            >
              <Folder className="w-4 h-4 mr-2" />
              Ir a Boards
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
