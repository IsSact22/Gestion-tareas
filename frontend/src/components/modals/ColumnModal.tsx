import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Column } from '@/services/columnService';
import { useColumnStore } from '@/store/columnStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  column?: Column | null;
  boardId: string;
}

export default function ColumnModal({ isOpen, onClose, column, boardId }: ColumnModalProps) {
  const { createColumn, updateColumn, isLoading } = useColumnStore();
  const [name, setName] = useState('');

  useEffect(() => {
    if (column) {
      setName(column.name);
    } else {
      setName('');
    }
  }, [column]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    if (column) {
      // Editar columna existente
      await updateColumn(column.id, { name });
    } else {
      // Crear nueva columna
      await createColumn({ name, boardId });
    }

    onClose();
    setName('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {column ? 'Editar Columna' : 'Nueva Columna'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-black hover:bg-indigo-500 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la columna *
            </label>
            <Input
              type="text"
              value={name}
              
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Por hacer, En progreso, Hecho"
              required
              autoFocus
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
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
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? 'Guardando...' : column ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
