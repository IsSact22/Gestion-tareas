'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { UserCog, Plus, Edit, Trash2, Shield, User as UserIcon, Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/lib/api';

interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
  createdAt: string;
}

export default function ManageUsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member' as 'admin' | 'member' | 'viewer',
  });

  // Verificar que el usuario sea admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      toast.error('No tienes permisos para acceder a esta página');
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Cargar usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Usuario creado exitosamente');
      setIsCreateModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'member' });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const updateData: any = {
        name: formData.name,
        role: formData.role,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.put(`/users/${selectedUser._id}`, updateData);
      toast.success('Usuario actualizado exitosamente');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setFormData({ name: '', email: '', password: '', role: 'member' });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      member: 'bg-blue-100 text-blue-700',
      viewer: 'bg-gray-100 text-gray-700',
    };
    
    const icons = {
      admin: Shield,
      member: UserIcon,
      viewer: Eye,
    };

    const Icon = icons[role as keyof typeof icons];
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[role as keyof typeof styles]}`}>
        <Icon className="w-4 h-4" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Crear Usuario
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user._id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ name: '', email: '', password: '', role: 'member' });
        }}
        title="Crear Nuevo Usuario"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Input
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              required
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Crear Usuario
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({ name: '', email: '', password: '', role: 'member' });
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
          setFormData({ name: '', email: '', password: '', role: 'member' });
        }}
        title="Editar Usuario"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
          
          <Input
            label="Nueva Contraseña (opcional)"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Dejar en blanco para no cambiar"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              required
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Guardar Cambios
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
                setFormData({ name: '', email: '', password: '', role: 'member' });
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
