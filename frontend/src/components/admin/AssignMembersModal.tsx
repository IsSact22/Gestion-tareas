'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Users, X, Plus, Search } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Member {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: 'admin' | 'member' | 'viewer';
}

interface AssignMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: 'board' | 'workspace';
  resourceId: string;
  resourceName: string;
  currentMembers: Member[];
  onMembersUpdated: () => void;
}

export default function AssignMembersModal({
  isOpen,
  onClose,
  resourceType,
  resourceId,
  resourceName,
  currentMembers,
  onMembersUpdated,
}: AssignMembersModalProps) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
    }
  }, [isOpen]);

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/users');
      setAllUsers(response.data.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    }
  };

  const handleAddMember = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Buscar el email del usuario
      const user = allUsers.find(u => u._id === userId);
      if (!user) {
        toast.error('Usuario no encontrado');
        return;
      }

      const endpoint = resourceType === 'board' 
        ? `/boards/${resourceId}/members`
        : `/workspaces/${resourceId}/members`;

      await api.post(endpoint, {
        email: user.email,
        role: selectedRole,
      });

      toast.success('Miembro agregado exitosamente');
      await onMembersUpdated();
      onClose(); // Cerrar el modal para que se recargue con datos frescos
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al agregar miembro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este miembro?')) return;

    try {
      setIsLoading(true);
      const endpoint = resourceType === 'board'
        ? `/boards/${resourceId}/members/${userId}`
        : `/workspaces/${resourceId}/members/${userId}`;

      await api.delete(endpoint);

      toast.success('Miembro eliminado exitosamente');
      onMembersUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar miembro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'admin' | 'member' | 'viewer') => {
    try {
      setIsLoading(true);
      const endpoint = resourceType === 'board'
        ? `/boards/${resourceId}/members/${userId}`
        : `/workspaces/${resourceId}/members/${userId}`;

      await api.put(endpoint, { role: newRole });

      toast.success('Rol actualizado exitosamente');
      onMembersUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar rol');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    const isMember = currentMembers.some((m) => m.user._id === user._id);
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return !isMember && matchesSearch;
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      member: 'bg-blue-100 text-blue-700',
      viewer: 'bg-gray-100 text-gray-700',
    };
    return styles[role as keyof typeof styles] || styles.viewer;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Gestionar Miembros - ${resourceName}`}>
      <div className="space-y-6">
        {/* Current Members */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Miembros Actuales ({currentMembers.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {currentMembers.map((member) => (
              <div
                key={member.user._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.user.name}</p>
                    <p className="text-sm text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getRoleBadge(member.role)}`}
                    value={member.role}
                    onChange={(e) => handleChangeRole(member.user._id, e.target.value as any)}
                    disabled={isLoading}
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    onClick={() => handleRemoveMember(member.user._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={isLoading}
                    title="Eliminar miembro"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Member */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Agregar Nuevo Miembro
          </h3>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol a asignar
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {/* Available Users */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {searchQuery ? 'No se encontraron usuarios' : 'Todos los usuarios ya son miembros'}
              </p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddMember(user._id)}
                    disabled={isLoading}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
