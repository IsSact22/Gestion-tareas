/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Lock, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si no está en modo edición, no hacer nada
    if (!isEditing) {
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      const updateData: any = {
        name: formData.name,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await api.put('/users/profile', updateData);
      setUser(response.data.data);
      toast.success('Perfil actualizado exitosamente');
      setIsEditing(false);
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      member: 'bg-blue-100 text-blue-700',
      viewer: 'bg-gray-100 text-gray-700',
    };
    
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${styles[role as keyof typeof styles]}`}>
        <Shield className="w-4 h-4" />
        {role === 'admin' ? 'Administrador' : role === 'member' ? 'Miembro' : 'Visualizador'}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">Administra tu información personal</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <Card className="mb-4 md:mb-6">
          {/* Avatar y Info del Usuario - Centrado */}
          <div className="flex flex-col items-center gap-4 md:gap-6 p-4 md:p-6 border-b border-gray-200 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{user?.name}</h2>
              <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-3 break-all">{user?.email}</p>
              <div className="flex justify-center">
                {getRoleBadge(user?.role || 'viewer')}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 text-center">
                  <User className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />
                  Nombre
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  required
                />
              </div>

              {/* Email (No editable) */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 text-center">
                  <Mail className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />
                  Email
                  <span className="ml-2 text-xs text-gray-500">(No editable)</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Cambiar Contraseña */}
            {isEditing && (
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 text-center" >
                  <Lock className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                  Cambiar Contraseña
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <Input
                    label="Nueva Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Dejar en blanco para no cambiar"
                    className="w-full"
                  />
                  <Input
                    label="Confirmar Contraseña"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirmar nueva contraseña"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Información del Rol */}
            <div className="border-t border-gray-200 pt-4 md:pt-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 text-center">
                <Shield className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                Información del Rol
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 md:p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Rol actual:</strong> 
                </p>
                <div className="flex justify-center mb-3">
                  {getRoleBadge(user?.role || 'viewer')}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {user?.role === 'admin' && 'Tienes acceso completo al sistema y puedes gestionar usuarios.'}
                  {user?.role === 'member' && 'Puedes colaborar en workspaces y boards, crear tareas y agregar comentarios.'}
                  {user?.role === 'viewer' && 'Solo puedes visualizar boards y tareas donde estés invitado.'}
                </p>
                <p className="text-xs text-gray-400">
                  * El rol solo puede ser modificado por un administrador
                </p>
              </div>
            </div>
          </form>

          {/* Botones - Centrados */}
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 md:pt-4 border-t border-gray-200 justify-center">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-6 md:px-8 bg-indigo-600 hover:bg-indigo-700"
                >
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button 
                    type="button" 
                    onClick={handleUpdateProfile}
                    className="w-full sm:w-auto px-6 md:px-8 bg-indigo-600 hover:bg-indigo-700"
                  >
                    Guardar Cambios
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        password: '',
                        confirmPassword: '',
                      });
                    }}
                    className="w-full sm:w-auto px-6 md:px-8"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Información Adicional - Centrada */}
        <Card>
          <div className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 text-center">Información de la Cuenta</h3>
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm max-w-md mx-auto">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Fecha de registro:</span>
                <span className="font-medium text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Última actualización:</span>
                <span className="font-medium text-gray-900">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">ID de usuario:</span>
                <span className="font-mono text-xs text-gray-500">{user?.id}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}