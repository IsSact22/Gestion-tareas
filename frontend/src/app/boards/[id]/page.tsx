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
import { ArrowLeft, Users, Settings, Star, Home, UserPlus } from 'lucide-react';
import { Column } from '@/services/columnService';
import { Task } from '@/services/taskService';

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const { currentBoard, fetchBoardById, isLoading } = useBoardStore();
  const { fetchColumns, addColumn, removeColumn } = useColumnStore();
  const { fetchTasks, addTask, removeTask, updateTaskInList } = useTaskStore();

  // Conectar al board via Socket.IO
  const socket = useBoardSocket(boardId);

  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumnForTask, setSelectedColumnForTask] = useState<string | null>(null);

  useEffect(() => {
    if (boardId) {
      fetchBoardById(boardId);
      fetchColumns(boardId);
      fetchTasks(boardId);
    }
  }, [boardId, fetchBoardById, fetchColumns, fetchTasks]);

  // Escuchar eventos de Socket.IO
  useEffect(() => {
    // Columnas
    socketService.onColumnCreated((data) => {
      console.log('📊 Columna creada:', data);
      fetchColumns(boardId);
    });

    socketService.onColumnUpdated((data) => {
      console.log('📝 Columna actualizada:', data);
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

    socketService.onUserLeft((data) => {
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/boards')}
              className="p-2 hover:bg-gray-500 text-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
                      </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-500 text-gray-700 rounded-lg transition-colors"
            >
              <Home size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {currentBoard.name}
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Star size={18} className="text-gray-400 hover:text-yellow-500" />
                </button>
              </h1>
              {currentBoard.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {currentBoard.description}
                </p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Members */}
            <div className="flex -space-x-2">
              {currentBoard.members?.slice(0, 5).map((member, index) => (
                <div
                  key={`${member.user.id}-${index}`}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white"
                  title={member.user.name}
                >
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {currentBoard.members && currentBoard.members.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium border-2 border-white">
                  +{currentBoard.members.length - 5}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowMemberModal(true)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                title="Invitar miembro"
              >
                <UserPlus size={18} />
                <span>Invitar</span>
              </button>
              
              <button 
                onClick={() => setShowManageMembersModal(true)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                title="Gestionar miembros"
              >
                <Users size={18} />
                <span>Gestionar</span>
              </button>
            </div>

            <button className="p-2 hover:bg-gray-500 text-gray-700 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
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
