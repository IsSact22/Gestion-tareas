import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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
  }, [boardId]);

  // Obtener tareas por columna
  const getTasksByColumn = (columnId: string) => {
    return tasks
      .filter((task) => task.column === columnId)
      .sort((a, b) => a.position - b.position);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t._id === activeId);
    const overTask = tasks.find((t) => t._id === overId);

    if (!activeTask) return;

    // Si se está arrastrando sobre otra tarea
    if (overTask) {
      const activeColumn = activeTask.column;
      const overColumn = overTask.column;

      if (activeColumn !== overColumn) {
        // Mover a otra columna
        const overColumnTasks = getTasksByColumn(overColumn);
        const overIndex = overColumnTasks.findIndex((t) => t._id === overId);

        // Actualizar localmente (optimistic update)
        const updatedTasks = tasks.map((task) => {
          if (task._id === activeId) {
            return { ...task, column: overColumn, position: overIndex };
          }
          return task;
        });

        useTaskStore.setState({ tasks: updatedTasks });
      }
    } else {
      // Si se está arrastrando sobre una columna vacía
      const overColumn = columns.find((c) => c._id === overId);
      if (overColumn && activeTask.column !== overId) {
        const updatedTasks = tasks.map((task) => {
          if (task._id === activeId) {
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

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t._id === activeId);
    if (!activeTask) return;

    // Determinar la columna de destino
    let targetColumnId = overId;
    const overTask = tasks.find((t) => t._id === overId);
    
    if (overTask) {
      targetColumnId = overTask.column;
    } else {
      // Verificar si overId es una columna
      const overColumn = columns.find((c) => c._id === overId);
      if (overColumn) {
        targetColumnId = overId;
      }
    }

    const sourceColumnId = activeTask.column;

    if (sourceColumnId === targetColumnId) {
      // Reordenar dentro de la misma columna
      const columnTasks = getTasksByColumn(targetColumnId);
      const oldIndex = columnTasks.findIndex((t) => t._id === activeId);
      const newIndex = overTask
        ? columnTasks.findIndex((t) => t._id === overId)
        : columnTasks.length;

      if (oldIndex !== newIndex) {
        const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
        
        // Actualizar posiciones
        const updatedTasks = tasks.map((task) => {
          const newPosition = reorderedTasks.findIndex((t) => t._id === task._id);
          if (newPosition !== -1) {
            return { ...task, position: newPosition };
          }
          return task;
        });

        useTaskStore.setState({ tasks: updatedTasks });
      }
    } else {
      // Mover a otra columna
      const targetColumnTasks = getTasksByColumn(targetColumnId);
      const newPosition = overTask
        ? targetColumnTasks.findIndex((t) => t._id === overId)
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
        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-6 p-6 min-h-full">
            {columns.map((column) => (
              <KanbanColumn
                key={column._id}
                column={column}
                tasks={getTasksByColumn(column._id)}
                onAddTask={() => onAddTask(column._id)}
                onEditColumn={() => onEditColumn(column)}
                onDeleteColumn={() => onDeleteColumn(column._id)}
                onTaskClick={onTaskClick}
              />
            ))}

            {/* Add Column Button */}
            <div className="flex-shrink-0 w-80">
              <button
                onClick={onAddColumn}
                className="w-full h-full min-h-[200px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2"
              >
                <Plus size={32} />
                <span className="font-medium">Agregar columna</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-90">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
