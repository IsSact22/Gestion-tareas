/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, Star, Users, Folder, LayoutGrid } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useRouter } from 'next/navigation';
import socketService from '@/services/socketService';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const BOARD_COLORS = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Púrpura', value: '#8B5CF6' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Naranja', value: '#F59E0B' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Cian', value: '#06B6D4' },
  { name: 'Amarillo', value: '#FBBF24' },
  { name: 'Morado', value: '#AC24FBFF'},
  { name: 'Rojo oscuro', value: '#7E0313FF'},
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
      workspaces.forEach(workspace => {
        socketService.joinWorkspace(workspace.id);
      });
    }

    socketService.onBoardUpdated(() => fetchBoards());
    socketService.on('board:deleted', () => fetchBoards());

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
      fetchBoards();
    }
  };

  const handleEditBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBoard) {
      const result = await updateBoard(selectedBoard.id, {
        name: formData.name,
        description: formData.description,
        color: formData.color,
      });
      if (result) {
        setIsEditModalOpen(false);
        setSelectedBoard(null);
        setFormData({ name: '', description: '', workspaceId: '', color: BOARD_COLORS[0].value });
        fetchBoards();
      }
    }
  };

  const handleDeleteBoard = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este board?')) {
      await deleteBoard(id);
      setShowDropdown(null);
    }
  };

  const openEditModal = (board: any) => {
    setSelectedBoard(board);
    setFormData({
      name: board.name,
      description: board.description || '',
      workspaceId: board.workspace.id,
      color: board.color || BOARD_COLORS[0].value,
    });
    setIsEditModalOpen(true);
    setShowDropdown(null);
  };

  if (isLoading && boards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
           <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-gray-500 font-medium">Cargando tus tableros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Tableros</h1>
          <p className="text-gray-600 mt-1">Organiza tus proyectos visualmente</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Crear Board</span>
        </button>
      </div>

      {boards.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
            <LayoutGrid className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Está muy vacío aquí</h3>
          <p className="text-gray-500 mb-8 max-w-md text-center">
            Crea tu primer tablero Kanban para empezar a organizar tus tareas y colaborar con tu equipo.
          </p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Crear primer Board</span>
          </button>
        </div>
      ) : (
        /* Grid Bento */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => router.push(`/boards/${board.id}`)}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-[280px]"
            >
              {/* Board Color Header Area */}
              <div 
                className="h-32 relative transition-all group-hover:h-36"
                style={{ backgroundColor: board.color || '#8B5CF6' }}
              >
                {/* Overlay sutil para profundidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleFavorite(board.id);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all hover:scale-110"
                  title={board.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Star className={`w-5 h-5 transition-all ${board.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white hover:text-yellow-200'}`} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate pr-2">
                        {board.name}
                      </h3>
                      
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowDropdown(showDropdown === board.id ? null : board.id); }}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {showDropdown === board.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditModal(board); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" /> Editar
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteBoard(board.id); }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                   </div>

                   <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">
                     {board.description || "Sin descripción"}
                   </p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400 mt-2">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                    <Folder className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[80px]">{board.workspace.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{board.members?.length || 0} miembros</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS: Mantenemos la estructura funcional pero mejoramos estilos de inputs si es posible */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ name: '', description: '', workspaceId: '', color: BOARD_COLORS[0].value });
        }}
        title="Crear Nuevo Board"
      >
        <form onSubmit={handleCreateBoard} className="space-y-5">
          <Input
            label="Nombre del Board"
            type="text"
            placeholder="Ej: Lanzamiento Web"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="rounded-xl border-gray-200 focus:ring-purple-500"
          />
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Workspace</label>
            <select
              className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              value={formData.workspaceId}
              onChange={(e) => setFormData({ ...formData, workspaceId: e.target.value })}
              required
            >
              <option value="">Selecciona un espacio...</option>
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <textarea
              className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="¿De qué trata este proyecto?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Color de portada</label>
            <div className="flex gap-3 flex-wrap">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-10 h-10 rounded-full transition-all shadow-sm ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl bg-gray-900 hover:bg-black text-white py-3">
              {isLoading ? 'Creando...' : 'Crear Board'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal (Reutilizando estilos) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBoard(null);
          setFormData({ name: '', description: '', workspaceId: '', color: BOARD_COLORS[0].value });
        }}
        title="Editar Board"
      >
        <form onSubmit={handleEditBoard} className="space-y-5">
          <Input
            label="Nombre del Board"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="rounded-xl"
          />
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Color</label>
            <div className="flex gap-3 flex-wrap">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-10 h-10 rounded-full transition-all ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl bg-gray-900 hover:bg-black text-white">
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}