'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBoardStore } from '@/store/boardStore';
import { useColumnStore } from '@/store/columnStore';
import { useTaskStore } from '@/store/taskStore';
import { useBoardSocket } from '@/hooks/useSocket';
import socketService from '@/services/socketService';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import ColumnModal from '@/components/modals/ColumnModal';
import TaskModal from '@/components/modals/TaskModal';
import TaskDetailModal from '@/components/modals/TaskDetailModal';
import AddBoardMemberModal from '@/components/modals/AddBoardMemberModal';
import ManageMembersModal from '@/components/modals/ManageMembersModal';
import { Users, Settings, Star, UserPlus, MoreHorizontal, Share2, Filter, ChevronLeft } from 'lucide-react';
import { Column } from '@/services/columnService';
import { Task } from '@/services/taskService';

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params?.id 
    ? (typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '')
    : '';

  const { currentBoard, fetchBoardById, isLoading } = useBoardStore();
  const { fetchColumns, addColumn, removeColumn } = useColumnStore();
  const { fetchTasks, addTask, removeTask, updateTaskInList } = useTaskStore();

  // Conectar al board via Socket.IO
  useBoardSocket(boardId);

  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumnForTask, setSelectedColumnForTask] = useState<string | null>(null);

  // Cargar datos del board
  useEffect(() => {
    if (!boardId) {
      console.warn('⚠️ No boardId provided, redirecting to boards');
      router.push('/boards');
      return;
    }
    
    fetchBoardById(boardId);
    fetchColumns(boardId);
    fetchTasks(boardId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, router]);

  // Escuchar eventos de Socket.IO
  useEffect(() => {
    if (!boardId) return;

    // Columnas
    socketService.onColumnCreated(() => {
      console.log('📊 Columna creada');
      fetchColumns(boardId);
    });

    socketService.onColumnUpdated(() => {
      console.log('📝 Columna actualizada');
      fetchColumns(boardId);
    });

    socketService.onColumnDeleted((data) => {
      console.log('🗑️ Columna eliminada:', data);
      removeColumn(data.columnId);
    });

    // Tareas
    socketService.onTaskCreated((data) => {
      console.log('✨ Tarea creada:', data);
      addTask(data.task);
    });

    socketService.onTaskUpdated((data) => {
      console.log('📝 Tarea actualizada vía Socket.IO:', data);
      console.log('📝 Tarea recibida:', data.task);
      // Actualizar solo la tarea específica en lugar de recargar todas
      if (data.task && data.task.id) {
        updateTaskInList(data.task);
      } else {
        console.warn('⚠️ Tarea sin datos completos, recargando todas las tareas');
        fetchTasks(boardId);
      }
    });

    socketService.onTaskDeleted((data) => {
      console.log('🗑️ Tarea eliminada:', data);
      removeTask(data.taskId);
    });

    socketService.onTaskMoved((data) => {
      console.log('🔄 Tarea movida:', data);
      // Recargar tareas para reflejar el cambio de columna y posición
      fetchTasks(boardId);
    });

    // Usuarios
    socketService.onUserJoined((data) => {
      console.log('👤 Usuario se unió:', data.userEmail);
    });

    socketService.onUserLeft(() => {
      console.log('👋 Usuario salió');
    });

    return () => {
      socketService.off('column:created');
      socketService.off('column:updated');
      socketService.off('column:deleted');
      socketService.off('task:created');
      socketService.off('task:updated');
      socketService.off('task:deleted');
      socketService.off('task:moved');
      socketService.off('user:joined');
      socketService.off('user:left');
    };
  }, [boardId, fetchColumns, fetchTasks, addColumn, removeColumn, addTask, removeTask, updateTaskInList]);

  if (isLoading || !currentBoard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      
      {/* --- NUEVO HEADER PREMIUM --- */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 h-16 md:h-18 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
        
        {/* Izquierda: Navegación y Título */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button 
            onClick={() => router.push('/boards')}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver a mis tableros"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="h-6 w-px bg-gray-200 hidden md:block" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded bg-indigo-500 flex-shrink-0" 
                style={{ backgroundColor: currentBoard.color }} // Si tienes color en el board
              />
              <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate tracking-tight">
                {currentBoard.name}
              </h1>
              <button 
                className="text-gray-300 hover:text-yellow-400 transition-colors focus:outline-none"
                onClick={() => {/* Lógica de favorito */}}
              >
                <Star size={16} className={currentBoard.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
              </button>
            </div>
            {/* Descripción opcional pequeña */}
            {currentBoard.description && (
               <p className="text-xs text-gray-500 truncate hidden md:block mt-0.5">
                 {currentBoard.description}
               </p>
            )}
          </div>
        </div>

        {/* Derecha: Acciones y Miembros */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Avatares superpuestos (Avatar Stack) */}
          <div className="flex items-center -space-x-2 md:-space-x-3 overflow-hidden pl-2">
            {currentBoard.members?.slice(0, 4).map((member, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium shadow-sm z-0 hover:z-10 hover:scale-110 transition-transform cursor-default"
                title={member.user.name}
              >
                {member.user.name.charAt(0).toUpperCase()}
              </div>
            ))}
            <button
               onClick={() => setShowMemberModal(true)}
               className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all z-0 text-xs"
               title="Invitar nuevo miembro"
            >
              <UserPlus size={14} />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden md:block" />

          {/* Botonera de Acciones */}
          <div className="flex items-center gap-2">
             <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Filter size={16} />
                <span>Filtrar</span>
             </button>

             <button 
                onClick={() => setShowMemberModal(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 rounded-lg transition-all"
             >
                <Share2 size={16} />
                <span>Compartir</span>
             </button>

             <button 
                onClick={() => setShowManageMembersModal(true)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
             >
                <MoreHorizontal size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* --- KANBAN BOARD (Full Width/Height) --- */}
      <div className="flex-1 overflow-hidden relative w-full">
        <KanbanBoard
          boardId={boardId}
          onAddColumn={() => {
            setSelectedColumn(null);
            setShowColumnModal(true);
          }}
          onEditColumn={(column) => {
            setSelectedColumn(column);
            setShowColumnModal(true);
          }}
          onDeleteColumn={(columnId) => {
            if (confirm('¿Estás seguro de eliminar esta columna?')) {
              useColumnStore.getState().deleteColumn(columnId);
            }
          }}
          onAddTask={(columnId) => {
            setSelectedColumnForTask(columnId);
            setSelectedTask(null);
            setShowTaskModal(true);
          }}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setShowTaskDetailModal(true);
          }}
        />
      </div>

      {/* Modales */}
      <ColumnModal
        isOpen={showColumnModal}
        onClose={() => {
          setShowColumnModal(false);
          setSelectedColumn(null);
        }}
        column={selectedColumn}
        boardId={boardId}
      />

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
          setSelectedColumnForTask(null);
        }}
        task={selectedTask}
        boardId={boardId}
        columnId={selectedColumnForTask || undefined}
      />

      <AddBoardMemberModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        boardId={boardId}
      />

      <ManageMembersModal
        isOpen={showManageMembersModal}
        onClose={() => setShowManageMembersModal(false)}
        boardId={boardId}
      />

      {selectedTask && (
        <TaskDetailModal
          isOpen={showTaskDetailModal}
          onClose={() => {
            setShowTaskDetailModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onEdit={() => {
            setShowTaskDetailModal(false);
            setShowTaskModal(true);
          }}
        />
      )}
    </div>
  );
}
