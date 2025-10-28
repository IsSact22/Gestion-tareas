import { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, User } from 'lucide-react';
import { Task } from '@/services/taskService';
import { useTaskStore } from '@/store/taskStore';
import { useColumnStore } from '@/store/columnStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  boardId: string;
  columnId?: string;
}

const PRIORITIES = [
  { value: 'low', label: 'Baja', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Media', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' },
];

export default function TaskModal({ isOpen, onClose, task, boardId, columnId }: TaskModalProps) {
  const { createTask, updateTask, isLoading } = useTaskStore();
  const { columns } = useColumnStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    columnId: columnId || '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    tags: [] as string[],
    dueDate: '',
  });
  
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        columnId: task.column,
        priority: task.priority,
        tags: task.tags || [],
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        columnId: columnId || '',
        priority: 'medium',
        tags: [],
        dueDate: '',
      });
    }
  }, [task, columnId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.columnId) return;

    if (task) {
      // Editar tarea existente
      await updateTask(task._id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        tags: formData.tags,
        dueDate: formData.dueDate || undefined,
      });
    } else {
      // Crear nueva tarea
      await createTask({
        title: formData.title,
        description: formData.description,
        columnId: formData.columnId,
        boardId,
        priority: formData.priority,
        tags: formData.tags,
        dueDate: formData.dueDate || undefined,
      });
    }

    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Implementar autenticación"
              required
              autoFocus
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe la tarea..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Columna */}
          {!task && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Columna *
              </label>
              <select
                value={formData.columnId}
                onChange={(e) => setFormData({ ...formData, columnId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona una columna</option>
                {columns.map((column) => (
                  <option key={column._id} value={column._id}>
                    {column.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <AlertCircle size={16} />
              Prioridad
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.value as any })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.priority === priority.value
                      ? `${priority.color} ring-2 ring-offset-2 ring-blue-500`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag size={16} />
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Agregar etiqueta"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="secondary"
              >
                Agregar
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-purple-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Fecha de vencimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Fecha de vencimiento
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.columnId}
            >
              {isLoading ? 'Guardando...' : task ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
