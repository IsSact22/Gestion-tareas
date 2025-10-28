'use client';

import { Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-30 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar tareas, boards, workspaces..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <NotificationBell />

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
            <p className="text-xs text-gray-500">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
