import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/services/taskService';
import { Clock, MessageSquare, Paperclip, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
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

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

    return (
      
        // card de tarea 
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Título */}
      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Descripción */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {/* Prioridad */}
        <span className={`px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>

        {/* Iconos de información */}
        <div className="flex items-center gap-3">
          {/* Usuarios asignados */}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{task.assignedTo.length}</span>
            </div>
          )}

          {/* Comentarios */}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
                <span>{task.comments.length}</span>
                
            </div>
          )}

          {/* Adjuntos */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip size={14} />
              <span>{task.attachments.length}</span>
            </div>
          )}

          {/* Fecha de vencimiento */}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{new Date(task.dueDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Avatares de usuarios asignados */}
      {task.assignedTo && task.assignedTo.length > 0 && (
        <div className="flex -space-x-2 mt-3">
          {task.assignedTo.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {task.assignedTo.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium border-2 border-white">
              +{task.assignedTo.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
