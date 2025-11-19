/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Search, Plus } from 'lucide-react';
import { useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Función para realizar la búsqueda
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0] || ''}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setSearchResults(data.data);
        console.log('🔍 Resultados de búsqueda:', data.data);
      } else {
        setSearchResults([]);
      }
      
    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Solo buscar con Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  // Limpiar resultados al hacer click fuera
  const handleClickOutside = useCallback(() => {
    setSearchResults([]);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search con resultados */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
            <input
              type="text"
              placeholder="Buscar usuarios.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Dropdown de resultados */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-80 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={handleClickOutside}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'member'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mensaje instructivo */}
          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 p-3 text-center text-sm text-gray-500">
              Presiona Enter para buscar &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="primary" 
            size="md" 
            className="flex items-center space-x-2"
            onClick={() => router.push('/tasks')}
          >
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