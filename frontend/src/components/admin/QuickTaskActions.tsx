/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface QuickTaskActionsProps {
  taskId: string;
  currentStatus: 'todo' | 'in-progress' | 'done';
  currentPriority: 'low' | 'medium' | 'high';
  onUpdate: () => void;
}

export default function QuickTaskActions({
  taskId,
  currentStatus,
  currentPriority,
  onUpdate,
}: QuickTaskActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: 'todo' | 'in-progress' | 'done') => {
    if (newStatus === currentStatus) return;

    try {
      setIsUpdating(true);
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Estado actualizado');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar estado');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority: 'low' | 'medium' | 'high') => {
    if (newPriority === currentPriority) return;

    try {
      setIsUpdating(true);
      await api.put(`/tasks/${taskId}`, { priority: newPriority });
      toast.success('Prioridad actualizada');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar prioridad');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      setIsUpdating(true);
      await api.delete(`/tasks/${taskId}`);
      toast.success('Tarea eliminada');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar tarea');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {/* Status Quick Actions */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleStatusChange('todo')}
          disabled={isUpdating}
          className={`p-1.5 rounded transition-colors ${
            currentStatus === 'todo'
              ? 'bg-gray-200 text-gray-700'
              : 'text-gray-500 hover:bg-gray-200'
          }`}
          title="Por hacer"
        >
          <Clock className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleStatusChange('in-progress')}
          disabled={isUpdating}
          className={`p-1.5 rounded transition-colors ${
            currentStatus === 'in-progress'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-blue-100'
          }`}
          title="En progreso"
        >
          <AlertCircle className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleStatusChange('done')}
          disabled={isUpdating}
          className={`p-1.5 rounded transition-colors ${
            currentStatus === 'done'
              ? 'bg-green-100 text-green-700'
              : 'text-gray-500 hover:bg-green-100'
          }`}
          title="Completada"
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

      {/* Priority Quick Actions */}
      <select
        value={currentPriority}
        onChange={(e) => handlePriorityChange(e.target.value as any)}
        disabled={isUpdating}
        className={`px-2 py-1 text-xs font-medium rounded border-0 cursor-pointer ${
          currentPriority === 'high'
            ? 'bg-red-100 text-red-700'
            : currentPriority === 'medium'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-green-100 text-green-700'
        }`}
      >
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={isUpdating}
        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Eliminar tarea"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
