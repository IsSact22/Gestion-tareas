/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Folder, Users, Trello, Calendar, UserPlus, ArrowLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/lib/api';
import AssignMembersModal from '@/components/admin/AssignMembersModal';
import Button from '@/components/ui/Button';

interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: 'admin' | 'member' | 'viewer';
  }>;
  boards: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminWorkspacesPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalMembers: 0,
    totalBoards: 0,
  });
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  // Verificar que el usuario sea admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      toast.error('No tienes permisos para acceder a esta página');
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Cargar workspaces
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/workspaces/admin/all');
      const workspacesData = response.data.data;
      setWorkspaces(workspacesData);
      
      // Calcular estadísticas
      const totalMembers = workspacesData.reduce(
        (acc: number, ws: Workspace) => acc + ws.members.length,
        0
      );
      const totalBoards = workspacesData.reduce(
        (acc: number, ws: Workspace) => acc + (ws.boards?.length || 0),
        0
      );
      
      setStats({
        total: workspacesData.length,
        totalMembers,
        totalBoards,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header Centrado */}
      <div className="mb-8 flex items-center justify-between">

      <Button
          type="button"
          variant="primary"
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Regresar
        </Button>


        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Workspaces</h1>
          <p className="text-gray-600">Vista general de todos los workspaces del sistema</p>
        </div>
      <div className="w-24"></div>
    </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Workspaces</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Miembros</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalMembers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Boards</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalBoards}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Trello className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Workspaces List */}
      <div className="space-y-4">
        {workspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/workspaces/${workspace.id}`)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Folder className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {workspace.name}
                    </h3>
                    {workspace.description && (
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {workspace.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWorkspace(workspace);
                    setIsMembersModalOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Gestionar miembros"
                >
                  <UserPlus className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Owner */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Propietario</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                      {workspace.owner.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {workspace.owner.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {workspace.owner.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Members */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Miembros</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-2xl font-bold text-gray-900">
                      {workspace.members.length}
                    </span>
                    <div className="flex -space-x-2 ml-2">
                      {workspace.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                          title={member.user.name}
                        >
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {workspace.members.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
                          +{workspace.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Boards */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Boards</p>
                  <div className="flex items-center gap-2">
                    <Trello className="w-4 h-4 text-gray-400" />
                    <span className="text-2xl font-bold text-gray-900">
                      {workspace.boards?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Created */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Fecha de creación</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {new Date(workspace.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {workspaces.length === 0 && (
        <Card className="p-12 text-center">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay workspaces</h3>
          <p className="text-gray-600">
            Aún no se han creado workspaces en el sistema
          </p>
        </Card>
      )}

      {/* Members Modal */}
      {selectedWorkspace && (
        <AssignMembersModal
          isOpen={isMembersModalOpen}
          onClose={() => {
            setIsMembersModalOpen(false);
            setSelectedWorkspace(null);
          }}
          resourceType="workspace"
          resourceId={selectedWorkspace.id}
          resourceName={selectedWorkspace.name}
          currentMembers={selectedWorkspace.members}
          onMembersUpdated={fetchWorkspaces}
        />
      )}
    </div>
  );
}
