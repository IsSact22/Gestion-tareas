/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useBoardStore } from '@/store/boardStore';
import { Task } from '@/services/taskService';
import taskService from '@/services/taskService';
// Eliminamos Card genérico para usar diseño custom
import Button from '@/components/ui/Button';
import { 
  CheckSquare, 
  Calendar, 
  ArrowRight, 
  Clock, 
  PlayCircle, 
  CheckCircle2,
  ListFilter,
  Layout
} from 'lucide-react';

const priorityColors = {
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  medium: 'bg-blue-50 text-blue-600 border-blue-100',
  high: 'bg-orange-50 text-orange-600 border-orange-100',
  urgent: 'bg-red-50 text-red-600 border-red-100',
};

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
};

const statusLabels = {
  todo: 'Por hacer',
  'in-progress': 'En progreso',
  done: 'Completado',
};

const statusColors = {
  todo: 'text-slate-500 bg-slate-100',
  'in-progress': 'text-blue-600 bg-blue-100',
  done: 'text-green-600 bg-green-100',
};

const statusIcons = {
  todo: Clock,
  'in-progress': PlayCircle,
  done: CheckCircle2,
};

export default function TasksPage() {
  const router = useRouter();
  const { fetchBoards } = useBoardStore();
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMyTasks = async () => {
      setIsLoading(true);
      try {
        await fetchBoards();
        const tasks = await taskService.getMyTasks();
        setMyTasks(tasks);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMyTasks();
  }, [fetchBoards]);

  const handleStatusChange = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      setMyTasks(prevTasks =>
        prevTasks.map(task =>
          (task.id) === taskId ? { ...task, status: newStatus } : task
        )
      );
      toast.success(`Estado actualizado a "${statusLabels[newStatus]}"`);
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const filteredTasks = myTasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const tasksByStatus = {
    todo: myTasks.filter(t => t.status === 'todo').length,
    'in-progress': myTasks.filter(t => t.status === 'in-progress').length,
    done: myTasks.filter(t => t.status === 'done').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // Componente interno para Stats
  const StatBox = ({ label, count, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{count}</p>
      </div>
      <div className={`w-12 h-12 ${bgClass} rounded-2xl flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
          <p className="text-gray-600 mt-1">Gestiona y organiza tus pendientes diarios</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => router.push('/boards')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
        >
          <Layout className="w-4 h-4 mr-2" />
          Ver Tableros
        </Button>
      </div>

      {/* Stats Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatBox 
          label="Por hacer" 
          count={tasksByStatus.todo} 
          icon={Clock} 
          colorClass="text-gray-700" 
          bgClass="bg-gray-100" 
        />
        <StatBox 
          label="En progreso" 
          count={tasksByStatus['in-progress']} 
          icon={PlayCircle} 
          colorClass="text-blue-600" 
          bgClass="bg-blue-50" 
        />
        <StatBox 
          label="Completadas" 
          count={tasksByStatus.done} 
          icon={CheckCircle2} 
          colorClass="text-green-600" 
          bgClass="bg-green-50" 
        />
      </div>

      {/* Filters & Content Wrapper */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
        
        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'Todas', count: myTasks.length },
              { id: 'todo', label: 'Por hacer', count: tasksByStatus.todo },
              { id: 'in-progress', label: 'En curso', count: tasksByStatus['in-progress'] },
              { id: 'done', label: 'Listas', count: tasksByStatus.done },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {tab.label} <span className="ml-1 opacity-60 text-xs">({tab.count})</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center text-sm text-gray-400">
             <ListFilter className="w-4 h-4 mr-2" />
             <span>Filtrando por: <span className="font-medium text-gray-600">{filter === 'all' ? 'Todas' : statusLabels[filter as keyof typeof statusLabels]}</span></span>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  
                  {/* Left: Status Indicator (Visual) */}
                  <div className={`hidden md:flex w-12 h-12 rounded-2xl items-center justify-center flex-shrink-0 ${statusColors[task.status]} bg-opacity-50`}>
                      {(() => {
                        const Icon = statusIcons[task.status];
                        return <Icon size={20} />;
                      })()}
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 min-w-0">
                    {/* CAMBIO AQUÍ: Usamos items-start en lugar de items-center para que si el título tiene 2 líneas, el badge se quede arriba */}
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 mb-2">
                      {/* CAMBIO PRINCIPAL AQUÍ: Reemplazamos 'truncate' por 'line-clamp-2' */}
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-2 flex-1 pr-2">
                        {task.title}
                      </h3>
                      
                      {/* Badge de prioridad (flex-shrink-0 para que no se aplaste) */}
                      <span className={`flex-shrink-0 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide rounded-full border ${priorityColors[task.priority]} mt-1`}>
                        {priorityLabels[task.priority]}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {task.description || "Sin descripción adicional."}
                    </p>

                    {/* ... (Resto del Metadata Footer y Actions igual que antes) ... */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                          <Calendar size={14} />
                          <span>{new Date(task.dueDate).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                      
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex gap-1.5">
                          {task.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-md bg-purple-50 text-purple-600 font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions (Sin cambios aquí) */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 w-full md:w-auto">
                    <div className="flex bg-gray-50 p-1 rounded-lg">
                      {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map((status) => {
                          const Icon = statusIcons[status];
                          const isActive = task.status === status;
                          return (
                            <button
                              key={status}
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, status); }}
                              className={`p-1.5 rounded-md transition-all ${isActive ? 'bg-white shadow text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                              title={statusLabels[status]}
                            >
                              <Icon size={16} />
                            </button>
                          )
                      })}
                    </div>

                    <button 
                      onClick={() => {
                        const boardId = typeof task.board === 'string' ? task.board : task.board?.id;
                        if (boardId) router.push(`/boards/${boardId}`);
                        else toast.error('No se puede acceder al board');
                      }}
                      disabled={!task.board}
                      className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      <span>Ver Board</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Moderno */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <CheckSquare className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Todo limpio por aquí</h3>
            <p className="text-gray-500 max-w-sm mb-8">
              No hay tareas en esta categoría. ¡Disfruta de tu tiempo libre o crea nuevas tareas en tus tableros!
            </p>
            <Button 
              variant="primary" 
              onClick={() => router.push('/boards')}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-8"
            >
              Ir a mis Boards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}