'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Trello, Users, Eye, Calendar, UserPlus } from 'lucide-react';
import Card from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/lib/api';
import AssignMembersModal from '@/components/admin/AssignMembersModal';

interface Board {
  id: string;
  _id: string;
  name: string;
  description?: string;
  color: string;
  workspace: {
    _id: string;
    name: string;
  };
  members: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
    };
    role: 'admin' | 'member' | 'viewer';
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBoardsPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
  });
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  // Verificar que el usuario sea admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      toast.error('No tienes permisos para acceder a esta página');
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Cargar boards
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/boards/admin/all');
      const boardsData = response.data.data;
      setBoards(boardsData);
      
      // Calcular estadísticas
      setStats({
        total: boardsData.length,
        active: boardsData.filter((b: Board) => !b.archived).length,
        archived: boardsData.filter((b: Board) => b.archived).length,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar boards');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      member: 'bg-blue-100 text-blue-700',
      viewer: 'bg-gray-100 text-gray-700',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role as keyof typeof styles]}`}>
        {role}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Boards</h1>
        <p className="text-gray-600">Vista general de todos los boards del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Boards</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Trello className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Activos</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Archivados</p>
              <p className="text-3xl font-bold text-gray-600">{stats.archived}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <Card
            key={board._id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/boards/${board._id}`)}
          >
            <div
              className="h-32 rounded-t-lg"
              style={{ backgroundColor: board.color || '#8B5CF6' }}
            >
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white">{board.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBoard(board);
                      setIsMembersModalOpen(true);
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    title="Gestionar miembros"
                  >
                    <UserPlus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              {/* Description */}
              {board.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {board.description}
                </p>
              )}

              {/* Workspace */}
              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Workspace</p>
                <p className="text-sm font-medium text-gray-900">
                  {typeof board.workspace === 'string' ? board.workspace : board.workspace.name}
                </p>
              </div>

              {/* Members */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Miembros</p>
                  <span className="text-xs font-medium text-gray-700">
                    {board.members.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div className="flex -space-x-2">
                    {board.members.slice(0, 5).map((member, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                        title={member.user.name}
                      >
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {board.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
                        +{board.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Administrador</p>
                <div className="flex items-center gap-2">
                  {board.members
                    .filter((m) => m.role === 'admin')
                    .slice(0, 2)
                    .map((admin, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                          {admin.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-700">{admin.user.name}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                <div>
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Creado: {new Date(board.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {boards.length === 0 && (
        <Card className="p-12 text-center">
          <Trello className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay boards</h3>
          <p className="text-gray-600">
            Aún no se han creado boards en el sistema
          </p>
        </Card>
      )}

      {/* Members Modal */}
      {selectedBoard && (
        <AssignMembersModal
          isOpen={isMembersModalOpen}
          onClose={() => {
            setIsMembersModalOpen(false);
            setSelectedBoard(null);
          }}
          resourceType="board"
          resourceId={selectedBoard._id}
          resourceName={selectedBoard.name}
          currentMembers={selectedBoard.members}
          onMembersUpdated={fetchBoards}
        />
      )}
    </div>
  );
}
