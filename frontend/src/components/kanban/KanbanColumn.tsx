import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from '@/services/columnService';
import { Task } from '@/services/taskService';
import TaskCard from './TaskCard';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: () => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onTaskClick: (task: Task) => void;
}

export default function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onTaskClick,
}: KanbanColumnProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{column.name}</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
              {tasks.length}
            </span>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <MoreVertical size={18} className="text-gray-600" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => {
                      onEditColumn();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Editar columna
                  </button>
                  <button
                    onClick={() => {
                      onDeleteColumn();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Eliminar columna
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tasks Container */}
        <div
          ref={setNodeRef}
          className={`flex-1 overflow-y-auto space-y-3 min-h-[200px] ${
            isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg' : ''
          }`}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))}
          </SortableContext>

          {tasks.length === 0 && !isOver && (
            <div className="text-center text-gray-400 text-sm py-8">
              No hay tareas
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          className="mt-4 w-full py-2 px-4 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Agregar tarea</span>
        </button>
      </div>
    </div>
  );
}
