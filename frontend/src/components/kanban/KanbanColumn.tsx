import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from '@/services/columnService';
import { Task } from '@/services/taskService';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'; // Cambié MoreVertical a MoreHorizontal para un look más moderno
import { useState } from 'react';
import { cn } from '@/lib/utils'; // O usa clases condicionales estándar si no tienes cn

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
    // CAMBIO IMPORTANTE: Quitamos w-72 fixed. Ahora es w-full h-full para llenar el contenedor padre del Board
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm">
      
      {/* 1. Header (Fijo) */}
      <div className="p-4 pb-2 flex items-center justify-between flex-shrink-0 group">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" /> {/* Indicador de color opcional */}
          <h3 className="font-bold text-gray-700 truncate text-sm uppercase tracking-wide">
            {column.name}
          </h3>
          <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200/80 text-gray-600 flex-shrink-0">
            {tasks.length}
          </span>
        </div>

        {/* Menu Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-gray-600 transition-all opacity-0 group-hover:opacity-100 md:opacity-0" // En móvil siempre visible si quieres, o maneja la opacidad
            style={{ opacity: showMenu ? 1 : undefined }} // Mantener visible si el menú está abierto
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => { onEditColumn(); setShowMenu(false); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
                >
                  <Edit size={14} /> Editar
                </button>
                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={() => { onDeleteColumn(); setShowMenu(false); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Tasks Area (Scrollable) */}
      {/* Usamos flex-1 y overflow-y-auto para que SOLO esto haga scroll */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto px-3 py-2 space-y-3 custom-scrollbar min-h-0", // min-h-0 es clave para flexbox scroll
          isOver && "bg-indigo-50/30 ring-2 ring-inset ring-indigo-400/30 rounded-lg transition-all"
        )}
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
          <div className="h-24 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl m-1">
            <span className="text-xs font-medium">Vacío</span>
          </div>
        )}
      </div>

      {/* 3. Footer (Fijo) */}
      <div className="p-3 pt-2 mt-auto flex-shrink-0">
        <button
          onClick={onAddTask}
          className="w-full py-2.5 px-3 bg-transparent hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 text-sm font-medium group"
        >
          <div className="w-5 h-5 rounded-full bg-gray-200 group-hover:bg-indigo-100 text-gray-500 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
             <Plus size={12} />
          </div>
          <span>Añadir tarea</span>
        </button>
      </div>
    </div>
  );
}