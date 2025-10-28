import { useState } from 'react';
import { X, Calendar, Tag, AlertCircle, User, MessageSquare, Edit2, Trash2, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { Task } from '@/services/taskService';
import { useTaskStore } from '@/store/taskStore';
import Button from '@/components/ui/Button';
import CommentSection from '@/components/task/CommentSection';
import taskService from '@/services/taskService';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onEdit: () => void;
}

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

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  review: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
};

const statusLabels = {
  todo: 'Por hacer',
  in_progress: 'En progreso',
  review: 'En revisión',
  done: 'Completada',
};

const statusIcons = {
  todo: Clock,
  in_progress: PlayCircle,
  review: AlertCircle,
  done: CheckCircle2,
};

export default function TaskDetailModal({ isOpen, onClose, task, onEdit }: TaskDetailModalProps) {
  const { deleteTask, updateTask } = useTaskStore();
  const [comments, setComments] = useState(task.comments || []);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task.status);

  const handleAddComment = async (content: string) => {
    setIsLoadingComments(true);
    try {
      const newComment = await taskService.addComment(task._id, content);
      setComments([...comments, newComment]);
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      throw error;
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsLoadingComments(true);
    try {
      await taskService.deleteComment(task._id, commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw error;
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await deleteTask(task._id);
      onClose();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const handleStatusChange = async (newStatus: 'todo' | 'in_progress' | 'review' | 'done') => {
    try {
      await updateTask(task._id, { status: newStatus });
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {task.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Editar tarea"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              title="Eliminar tarea"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Estado de la tarea */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Estado</h3>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map((status) => {
                const Icon = statusIcons[status];
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      currentStatus === status
                        ? `${statusColors[status]} ring-2 ring-offset-2 ring-blue-500`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{statusLabels[status]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descripción */}
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Descripción</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Prioridad */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <AlertCircle size={16} />
                Prioridad
              </h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}>
                {priorityLabels[task.priority]}
              </span>
            </div>

            {/* Fecha de vencimiento */}
            {task.dueDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Fecha de vencimiento
                </h3>
                <p className="text-gray-900">
                  {new Date(task.dueDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Etiquetas */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag size={16} />
                Etiquetas
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Usuarios asignados */}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User size={16} />
                Asignado a
              </h3>
              <div className="space-y-2">
                {task.assignedTo.map((user) => (
                  <div key={user._id} className="flex items-center gap-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comentarios */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <MessageSquare size={16} />
              Comentarios ({comments.length})
            </h3>
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              isLoading={isLoadingComments}
            />
          </div>

          {/* Información de creación */}
          <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
            <p>
              Creado por <span className="font-medium">{task.createdBy.name}</span> el{' '}
              {new Date(task.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {task.updatedAt !== task.createdAt && (
              <p className="mt-1">
                Última actualización:{' '}
                {new Date(task.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
