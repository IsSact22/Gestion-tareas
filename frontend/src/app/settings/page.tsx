'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Mail, Lock, Bell, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuración guardada', {
      duration: 3000,
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Gestiona tu cuenta y preferencias</p>
      </div>

      {/* Profile Settings */}
      <Card variant="bordered">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Perfil
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={<User className="w-5 h-5" />}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail className="w-5 h-5" />}
          />
          <Button type="submit" variant="primary" size="md">
            Guardar Cambios
          </Button>
        </form>
      </Card>

      {/* Password */}
      <Card variant="bordered">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Contraseña
        </h2>
        <div className="space-y-4">
          <Input
            label="Contraseña Actual"
            type="password"
            icon={<Lock className="w-5 h-5" />}
          />
          <Input
            label="Nueva Contraseña"
            type="password"
            icon={<Lock className="w-5 h-5" />}
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            icon={<Lock className="w-5 h-5" />}
          />
          <Button variant="primary" size="md">
            Cambiar Contraseña
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card variant="bordered">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notificaciones
        </h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Notificaciones por email</span>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Notificaciones push</span>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Actualizaciones de tareas</span>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
          </label>
        </div>
      </Card>

      {/* Appearance */}
      <Card variant="bordered">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Apariencia
        </h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Modo oscuro</span>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Sidebar compacto</span>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
          </label>
        </div>
      </Card>
    </div>
  );
}
