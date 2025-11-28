/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Trello, Users, Eye, Calendar, UserPlus, ArrowLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import AssignMembersModal from '@/components/admin/AssignMembersModal';
import Button from '@/components/ui/Button';

interface Board {
  archived: any;
  id: string;
  name: string;
  description?: string;
  color: string;
  workspace: {
    id: string;
    name: string;
  };
  members: Array<{
    user: {
      id: string;
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

      // const getRoleBadge = (role: string) => {
      //   const styles = {
      //     admin: 'bg-purple-100 text-purple-700',
      //     member: 'bg-blue-100 text-blue-700',
      //     viewer: 'bg-gray-100 text-gray-700',
      //   };
        
      //   return (
      //     <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role as keyof typeof styles]}`}>
      //       {role}
      //     </span>
      //   );
      // };

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
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
       {/* Header Centrado */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="text-center flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Gestión de Boards</h1>
          <p className="text-sm md:text-base text-gray-600">Vista general de todas los boards del sistema</p>
        </div>
      <div className="w-0 md:w-24"></div>
    </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total Boards</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Trello className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Activos</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Archivados</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-600">{stats.archived}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {boards.map((board) => (
          <Card
            key={board.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/boards/${board.id}`)}
          >
            <div
              className="h-24 md:h-32 rounded-t-lg"
              style={{ backgroundColor: board.color || '#8B5CF6' }}
            >
              <div className="p-3 md:p-4 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                <h3 
                  className="text-lg md:text-xl font-bold text-white line-clamp-2 leading-tight pr-8 break-words"
                  title={board.name} 
                >
                  {board.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBoard(board);
                      setIsMembersModalOpen(true);
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                    title="Gestionar miembros"
                  >
                    <UserPlus className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-4">
              {/* Description */}
              {board.description && (
                <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">
                  {board.description}
                </p>
              )}

              {/* Workspace */}
              <div className="mb-2 md:mb-3 pb-2 md:pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Workspace</p>
                <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                  {typeof board.workspace === 'string' ? board.workspace : board.workspace.name}
                </p>
              </div>

              {/* Members */}
              <div className="mb-2 md:mb-3">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <p className="text-xs text-gray-500">Miembros</p>
                  <span className="text-xs font-medium text-gray-700">
                    {board.members.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                  <div className="flex -space-x-2">
                    {board.members.slice(0, 5).map((member, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                        title={member.user.name}
                      >
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {board.members.length > 5 && (
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
                        +{board.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin */}
              <div className="mb-2 md:mb-3">
                <p className="text-xs text-gray-500 mb-1">Administrador</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {board.members
                    .filter((m) => m.role === 'admin')
                    .slice(0, 2)
                    .map((admin, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                          {admin.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-700 truncate max-w-[100px]">{admin.user.name}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 md:pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className="hidden sm:inline">Creado:</span>
                  <span>{new Date(board.createdAt).toLocaleDateString('es-ES')}</span>
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
          resourceId={selectedBoard.id}
          resourceName={selectedBoard.name}
          currentMembers={selectedBoard.members}
          onMembersUpdated={fetchBoards}
        />
      )}
    </div>
  );
}
