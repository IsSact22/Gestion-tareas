import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
} from '@dnd-kit/core';
import { useColumnStore } from '@/store/columnStore';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/services/taskService';
import { Column } from '@/services/columnService';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  boardId: string;
  onAddColumn: () => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

export default function KanbanBoard({
  boardId,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onTaskClick,
}: KanbanBoardProps) {
  const { columns, fetchColumns } = useColumnStore();
  const { tasks, fetchTasks, moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Configuración de sensores para soporte móvil y desktop
  // Solo PointerSensor para permitir scroll nativo en móvil
  const sensors = useSensors(
    // 1. Configuración para Mouse (Desktop)
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Arrastrar requiere mover el mouse 10px (evita clicks accidentales)
      },
    }),
    
    // 2. Configuración para Táctil (Móvil/Tablet)
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // CRUCIAL: Debes mantener presionado 250ms para "agarrar" la tarea.
        tolerance: 5, // Si mueves el dedo más de 5px durante esos 250ms, se cancela el arrastre y SE HACE SCROLL.
      },
    })
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchColumns(boardId);
        await fetchTasks(boardId);
        console.log('✅ Datos cargados:', { 
          columns: columns.length, 
          tasks: tasks.length 
        });
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
      }
    };
    
    loadData();
  }, [boardId, columns.length, fetchColumns, fetchTasks, tasks.length]);

  // Obtener tareas por columna
  const getTasksByColumn = (columnId: string) => {
    return tasks
      .filter((task) => task.column === columnId)
      .sort((a, b) => a.position - b.position);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
      setIsDragging(true);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // Si se está arrastrando sobre otra tarea
    if (overTask) {
      const activeColumn = activeTask.column;
      const overColumn = overTask.column;

      if (activeColumn !== overColumn) {
        // Mover a otra columna
        const overColumnTasks = getTasksByColumn(overColumn);
        const overIndex = overColumnTasks.findIndex((t) => t.id === overId);

        // Actualizar localmente (optimistic update)
        const updatedTasks = tasks.map((task) => {
          if (task.id === activeId) {
            return { ...task, column: overColumn, position: overIndex };
          }
          return task;
        });

        useTaskStore.setState({ tasks: updatedTasks });
      }
    } else {
      // Si se está arrastrando sobre una columna vacía
      const overColumn = columns.find((c) => c.id === overId);
      if (overColumn && activeTask.column !== overId) {
        const updatedTasks = tasks.map((task) => {
          if (task.id === activeId) {
            return { ...task, column: overId, position: 0 };
          }
          return task;
        });

        useTaskStore.setState({ tasks: updatedTasks });
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setIsDragging(false);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Determinar la columna de destino
    let targetColumnId = overId;
    const overTask = tasks.find((t) => t.id === overId);
    
    if (overTask) {
      targetColumnId = overTask.column;
    } else {
      // Verificar si overId es una columna
      const overColumn = columns.find((c) => c.id === overId);
      if (overColumn) {
        targetColumnId = overId;
      }
    }

    const sourceColumnId = activeTask.column;

    if (sourceColumnId === targetColumnId) {
      // Reordenar dentro de la misma columna
      const columnTasks = getTasksByColumn(targetColumnId);
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = overTask
        ? columnTasks.findIndex((t) => t.id === overId)
        : columnTasks.length;

      if (oldIndex !== newIndex) {
        // Llamar al backend para guardar el cambio
        await moveTask({
          taskId: activeId,
          fromColumnId: sourceColumnId,
          toColumnId: targetColumnId,
          position: newIndex,
        });
      }
    } else {
      // Mover a otra columna
      const targetColumnTasks = getTasksByColumn(targetColumnId);
      const newPosition = overTask
        ? targetColumnTasks.findIndex((t) => t.id === overId)
        : targetColumnTasks.length;

      // Llamar al backend para mover la tarea
      await moveTask({
        taskId: activeId,
        fromColumnId: sourceColumnId,
        toColumnId: targetColumnId,
        position: newPosition,
      });
    }
  };

  return (
  <div className="h-full flex flex-col">
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Área Scrollable Principal:
         - Mobile: snap-x manda el comportamiento de carrusel.
         - Desktop: scroll normal.
      */}
      <div 
        className={`flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar ${isDragging ? '' : 'snap-x snap-mandatory'} md:snap-none`}
        style={{ touchAction: 'pan-x pan-y' }}
      >
        
        {/* Contenedor de Columnas */}
        <div className="flex h-full p-4 gap-4 md:gap-6 items-start">
          
          {columns.map((column) => (
            <div 
               key={column.id} 
               className="flex-shrink-0 snap-center md:snap-align-none h-full"
            >
              {/* Ancho de Columna Responsive:
                 - Mobile: w-[85vw] (ocupa el 85% de la pantalla para ver que hay otra al lado).
                 - Tablet/Desktop: w-80 (tamaño fijo estándar).
              */}
              <div className="w-[85vw] md:w-80 h-full max-h-full">
                <KanbanColumn
                  column={column}
                  tasks={getTasksByColumn(column.id)}
                  onAddTask={() => onAddTask(column.id)}
                  onEditColumn={() => onEditColumn(column)}
                  onDeleteColumn={() => onDeleteColumn(column.id)}
                  onTaskClick={onTaskClick}
                />
              </div>
            </div>
          ))}

          {/* Botón Agregar Columna */}
          <div className="flex-shrink-0 snap-center md:snap-align-none pt-2">
            <button
              onClick={onAddColumn}
              className="w-[85vw] md:w-80 h-12 md:h-14 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all font-medium bg-white/50 backdrop-blur-sm"
            >
              <Plus size={20} />
              <span>Añadir sección</span>
            </button>
          </div>
          
          {/* Espaciador final para que no se corte el scroll en móvil */}
          <div className="w-4 flex-shrink-0 md:hidden" />
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTask ? (
          <div className="w-[85vw] md:w-80 cursor-grabbing rotate-2 scale-105 shadow-2xl">
            <TaskCard task={activeTask} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  </div>
);
}
