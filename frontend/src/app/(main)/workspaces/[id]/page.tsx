/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Users, Folder, Calendar, Trello, UserPlus, Plus, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface Member {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: string;
}

interface Board {
  id: string;
  name: string;
  description?: string;
  color?: string;
  members: any[];
  createdAt: string;
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: Member[];
  boards: Board[];
  createdAt: string;
}

const BOARD_COLORS = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Púrpura', value: '#8B5CF6' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Naranja', value: '#F59E0B' },
  { name: 'Rojo', value: '#EF4444' },
];

export default function WorkspaceDetailPage() {
  const router = useRouter();
  const params = useParams(); 
  const workspaceId = params.id as string;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('member');
  const [boardFormData, setBoardFormData] = useState({
    name: '',
    description: '',
    color: BOARD_COLORS[0].value,
  });

  useEffect(() => {
    fetchWorkspaceDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const fetchWorkspaceDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/workspaces/${workspaceId}`);
      setWorkspace(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar workspace');
      router.push('/workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/workspaces/${workspaceId}/members`, {
        email: memberEmail,
        role: memberRole,
      });
      toast.success('Miembro agregado exitosamente');
      setIsAddMemberModalOpen(false);
      setMemberEmail('');
      setMemberRole('member');
      await fetchWorkspaceDetail();
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al agregar miembro');
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/boards', {
        ...boardFormData,
        workspaceId: workspaceId,
      });
      toast.success('Board creado exitosamente');
      setIsCreateBoardModalOpen(false);
      setBoardFormData({ name: '', description: '', color: BOARD_COLORS[0].value });
      await fetchWorkspaceDetail();
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear board');
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${memberName} del workspace?`)) {
      return;
    }
    try {
      await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
      toast.success('Miembro eliminado exitosamente');
      fetchWorkspaceDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar miembro');
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      member: 'bg-blue-100 text-blue-700',
      viewer: 'bg-gray-100 text-gray-700',
    };
    return styles[role as keyof typeof styles] || styles.viewer;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workspace) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-gray-600 mt-1">{workspace.description}</p>
          )}
        </div>
        <Button
          onClick={() => setIsCreateBoardModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Board
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card variant="bordered" className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Miembros</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{workspace.members.length}</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Boards</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{workspace.boards?.length || 0}</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trello className="w-6 h-6 md:w-7 md:h-7 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 md:p-6 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Creado</p>
              <p className="text-sm md:text-base font-semibold text-gray-900">
                {new Date(workspace.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Miembros */}
        <Card>
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 md:w-6 md:h-6" />
                Miembros ({workspace.members.length})
              </h2>
              <button 
                onClick={() => setIsAddMemberModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Agregar miembro"
              >
                <UserPlus className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              {workspace.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base text-gray-900 truncate">{member.user.name}</p>
                      <p className="text-xs md:text-sm text-gray-500 truncate">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 md:px-3 py-1 text-xs rounded-full font-medium ${getRoleBadge(member.role)}`}>
                      {member.role === 'admin' ? 'Admin' : member.role === 'member' ? 'Miembro' : 'Viewer'}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(member.user.id, member.user.name)}
                      className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group-hover:opacity-100"
                      title="Eliminar miembro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Boards */}
        <Card>
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Folder className="w-5 h-5 md:w-6 md:h-6" />
                Boards ({workspace.boards?.length || 0})
              </h2>
            </div>

            {workspace.boards && workspace.boards.length > 0 ? (
              <div className="space-y-3">
                {workspace.boards.map((board) => (
                  <div
                    key={board.id}
                    onClick={() => router.push(`/boards/${board.id}`)}
                    className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: board.color || '#8B5CF6' }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1 group-hover:text-purple-600 transition-colors truncate">
                          {board.name}
                        </h3>
                        {board.description && (
                          <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-2">
                            {board.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{board.members?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            <span>
                              {new Date(board.createdAt).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <Trello className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-sm md:text-base text-gray-500">No hay boards en este workspace</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modal Agregar Miembro */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => {
          setIsAddMemberModalOpen(false);
          setMemberEmail('');
          setMemberRole('member');
        }}
        title="Agregar Miembro al Workspace"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input
            label="Email del usuario"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value)}
            >
              <option value="member">Miembro</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button type="submit" className="w-full sm:flex-1">
              Agregar Miembro
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddMemberModalOpen(false);
                setMemberEmail('');
                setMemberRole('member');
              }}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Crear Board */}
      <Modal
        isOpen={isCreateBoardModalOpen}
        onClose={() => {
          setIsCreateBoardModalOpen(false);
          setBoardFormData({ name: '', description: '', color: BOARD_COLORS[0].value });
        }}
        title="Crear Nuevo Board"
      >
        <form onSubmit={handleCreateBoard} className="space-y-4">
          <Input
            label="Nombre del Board"
            type="text"
            placeholder="Ej: Sprint 2024"
            value={boardFormData.name}
            onChange={(e) => setBoardFormData({ ...boardFormData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Describe el propósito de este board..."
              value={boardFormData.description}
              onChange={(e) => setBoardFormData({ ...boardFormData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color del Board
            </label>
            <div className="grid grid-cols-5 gap-3">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setBoardFormData({ ...boardFormData, color: color.value })}
                  className={`w-full h-12 rounded-lg transition-all ${
                    boardFormData.color === color.value
                      ? 'ring-4 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button type="submit" className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700">
              Crear Board
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateBoardModalOpen(false);
                setBoardFormData({ name: '', description: '', color: BOARD_COLORS[0].value });
              }}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
