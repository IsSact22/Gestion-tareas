'use client';

import { useEffect, useState } from 'react';
import { Trello, Plus, MoreVertical, Edit, Trash2, Star, Users, Folder } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useRouter } from 'next/navigation';
import socketService from '@/services/socketService';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Toaster } from 'react-hot-toast';

const BOARD_COLORS = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Púrpura', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Naranja', value: '#F59E0B' },
  { name: 'Rojo', value: '#EF4444' },
];

export default function BoardsPage() {
  const router = useRouter();
  const { boards, isLoading, fetchBoards, createBoard, updateBoard, deleteBoard, toggleFavorite } = useBoardStore();
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspaceId: '',
    color: BOARD_COLORS[0].value,
  });

  useEffect(() => {
    fetchBoards();
    fetchWorkspaces();
  }, [fetchBoards, fetchWorkspaces]);

  // Unirse a todos los workspaces y escuchar eventos
  useEffect(() => {
    if (workspaces.length > 0) {
      // Unirse a todos los workspaces
      workspaces.forEach(workspace => {
        socketService.joinWorkspace(workspace._id);
        console.log(`🏢 Uniéndose al workspace: ${workspace.name}`);
      });
    }

    // Escuchar actualizaciones de boards en tiempo real
    socketService.onBoardUpdated((data) => {
      console.log('📋 Board actualizado en tiempo real:', data);
      // Refrescar la lista de boards
      fetchBoards();
    });

    // Escuchar eliminaciones de boards
    socketService.on('board:deleted', (data) => {
      console.log('🗑️ Board eliminado en tiempo real:', data);
      fetchBoards();
    });

    // Cleanup
    return () => {
      socketService.off('board:updated');
      socketService.off('board:deleted');
    };
  }, [workspaces, fetchBoards]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createBoard(formData);
    if (result) {
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', workspaceId: '', color: BOARD_COLORS[0].value });
    }
  };

  const handleEditBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBoard) {
      const result = await updateBoard(selectedBoard._id, {
        name: formData.name,
        description: formData.description,
        color: formData.color,
      });
      if (result) {
        setIsEditModalOpen(false);
        setSelectedBoard(null);
        setFormData({ name: '', description: '', workspaceId: '', color: BOARD_COLORS[0].value });
      }
    }
  };

  const handleDeleteBoard = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este board? Esta acción no se puede deshacer.')) {
      await deleteBoard(id);
      setShowDropdown(null);
    }
  };

  const openEditModal = (board: any) => {
    setSelectedBoard(board);
    setFormData({
      name: board.name,
      description: board.description || '',
      workspaceId: board.workspace._id,
      color: board.color || BOARD_COLORS[0].value,
    });
    setIsEditModalOpen(true);
    setShowDropdown(null);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    await toggleFavorite(boardId);
  };

  if (isLoading && boards.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Boards</h1>
          <p className="text-gray-600">Visualiza y gestiona tus tableros Kanban</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Board</span>
        </button>
      </div>

      {boards.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trello className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay boards aún
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer board para empezar a organizar tus tareas
          </p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Board</span>
          </button>
        </div>
      ) : (
        /* Boards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <div
              key={board._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Board Color Header */}
              <div 
                className="h-24 relative"
                style={{ backgroundColor: board.color || '#8B5CF6' }}
                onClick={() => router.push(`/boards/${board._id}`)}
              >
                <button
                  onClick={(e) => handleToggleFavorite(e, board._id)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Star 
                    className={`w-5 h-5 ${board.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`}
                  />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="flex-1"
                    onClick={() => router.push(`/boards/${board._id}`)}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {board.name}
                    </h3>
                    {board.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {board.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(showDropdown === board._id ? null : board._id);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {showDropdown === board._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button
                          onClick={() => openEditModal(board)}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBoard(board._id)}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <Folder className="w-4 h-4" />
                    <span className="truncate max-w-[120px]">{board.workspace.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{board.members?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ name: '', description: '', workspaceId: '', color: BOARD_COLORS[0].value });
        }}
        title="Crear Nuevo Board"
      >
        <form onSubmit={handleCreateBoard} className="space-y-6">
          <Input
            label="Nombre del Board"
            type="text"
            placeholder="Ej: Sprint 2024"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={formData.workspaceId}
              onChange={(e) => setFormData({ ...formData, workspaceId: e.target.value })}
              required
            >
              <option value="">Selecciona un workspace</option>
              {workspaces.map((workspace) => (
                <option key={workspace._id} value={workspace._id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Describe el propósito de este board..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color del Board
            </label>
            <div className="grid grid-cols-6 gap-3">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-12 h-12 rounded-lg transition-all ${
                    formData.color === color.value
                      ? 'ring-4 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creando...' : 'Crear Board'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({ name: '', description: '', workspaceId: '', color: BOARD_COLORS[0].value });
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Board Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBoard(null);
          setFormData({ name: '', description: '', workspaceId: '', color: BOARD_COLORS[0].value });
        }}
        title="Editar Board"
      >
        <form onSubmit={handleEditBoard} className="space-y-6">
          <Input
            label="Nombre del Board"
            type="text"
            placeholder="Ej: Sprint 2024"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Describe el propósito de este board..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color del Board
            </label>
            <div className="grid grid-cols-6 gap-3">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-12 h-12 rounded-lg transition-all ${
                    formData.color === color.value
                      ? 'ring-4 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedBoard(null);
                setFormData({ name: '', description: '', workspaceId: '', color: BOARD_COLORS[0].value });
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
