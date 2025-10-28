'use client';

import { Search, Plus } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tareas, boards, workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="primary" size="md" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Nueva Tarea</span>
          </Button>

          {/* Notifications */}
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
