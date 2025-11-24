/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Users, Search, Shield, Mail, Calendar, Trello, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore'; // Corregir ruta del import de useAuthStore

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
  createdAt: string;
  _count?: {
    workspaces: number;
    boards: number;
    tasks: number;
  };
}

export default function TeamPage() {
  const router = useRouter();
  const { user } = useAuthStore(); // Obtener el usuario actual
  const isAdmin = user?.role === 'admin'; // Calcular isAdmin basado en el rol del usuario
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    members: 0,
    viewers: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      const usersData = response.data.data;
      setUsers(usersData);
      
      // Calcular estadísticas
      setStats({
        total: usersData.length,
        admins: usersData.filter((u: User) => u.role === 'admin').length,
        members: usersData.filter((u: User) => u.role === 'member').length,
        viewers: usersData.filter((u: User) => u.role === 'viewer').length,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      member: 'bg-blue-100 text-blue-700',
      viewer: 'bg-gray-100 text-gray-700',
    };
    return styles[role as keyof typeof styles] || styles.viewer;
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      member: 'Miembro',
      viewer: 'Visualizador',
    };
    return labels[role as keyof typeof labels] || role;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-1.5 md:p-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Equipo</h1>
            <p className="text-sm md:text-base text-gray-600">Gestiona los miembros de tu organización</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card variant="bordered" className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Admins</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-600">{stats.admins}</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Miembros</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.members}</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Viewers</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-600">{stats.viewers}</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {isAdmin && (
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="member">Miembros</option>
            <option value="viewer">Visualizadores</option>
          </select>
        )}
      </div>

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg md:text-xl font-bold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-1 truncate">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-3">
                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <span className={`inline-block px-2 md:px-3 py-1 text-xs rounded-full font-medium ${getRoleBadge(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>

              {user._count && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Trello className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-gray-900">{user._count.boards || 0}</p>
                    <p className="text-xs text-gray-500">Boards</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <CheckSquare className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-gray-900">{user._count.tasks || 0}</p>
                    <p className="text-xs text-gray-500">Tareas</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'short' })}
                    </p>
                    <p className="text-xs text-gray-500">Registro</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="bordered">
          <div className="text-center py-12 md:py-16">
            <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              No se encontraron usuarios
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Intenta con otros filtros de búsqueda
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
