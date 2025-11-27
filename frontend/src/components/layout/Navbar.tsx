/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Search, Plus, Menu, X, ChevronRight, User } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import Button from '@/components/ui/Button';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils'; // Asegúrate de tener esta utilidad, si no, usa clases normales

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Para controlar mensaje "no encontrado"
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { toggleCollapsed } = useSidebar();

  // Función para realizar la búsqueda
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Nota: Idealmente mover esta URL a una variable de entorno
      const token = document.cookie.split('token=')[1]?.split(';')[0] || '';
      
      const response = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Error en la búsqueda');
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setSearchResults(data.data);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  // Click Outside optimizado
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        setHasSearched(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    // Sticky header con efecto glass
    <header className="sticky top-0 z-30 h-20 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all">
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        
        {/* Toggle Móvil */}
        <button
          onClick={toggleCollapsed}
          className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Barra de Búsqueda */}
        <div className="flex-1 max-w-2xl relative" ref={searchContainerRef}>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
               <Search className="w-5 h-5" />
            </div>
            
            <input
              type="text"
              placeholder="Buscar usuarios (Presiona Enter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full pl-12 pr-10 py-3 bg-gray-100/50 border-transparent text-gray-800 rounded-2xl focus:bg-white border focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none placeholder:text-gray-400 font-medium"
            />
            
            {/* Indicadores Derecha (Loading o X) */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              ) : searchQuery ? (
                <button 
                  onClick={clearSearch}
                  className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Dropdown de Resultados con Animación */}
          {(searchResults.length > 0 || (hasSearched && !isSearching && searchResults.length === 0)) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-indigo-100/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              
              {searchResults.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Resultados encontrados
                  </div>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="group flex items-center gap-4 p-4 hover:bg-indigo-50/50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                      onClick={() => {
                        console.log('Usuario seleccionado:', user); // Aquí podrías redirigir al perfil
                        clearSearch();
                      }}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                        {user.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-700">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>

                      {/* Rol Tag */}
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-medium border",
                        user.role === 'admin' 
                          ? "bg-purple-50 text-purple-700 border-purple-100" 
                          : user.role === 'member'
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      )}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'member' ? 'Miembro' : 'Viewer'}
                      </span>
                      
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400" />
                    </div>
                  ))}
                </div>
              ) : (
                // Estado Vacío
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium">Sin resultados</p>
                  <p className="text-sm text-gray-500 mt-1">
                    No encontramos usuarios que coincidan con &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Acciones Derecha */}
        <div className="flex items-center gap-3 md:gap-4 pl-4">
          
          <Button 
            variant="primary" 
            onClick={() => router.push('/tasks')}
            className="hidden md:flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 border-0 h-11 px-5"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Tarea</span>
          </Button>

          {/* Botón Flotante Móvil (Icono solo) */}
          <button 
             onClick={() => router.push('/tasks')}
             className="md:hidden w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
          >
             <Plus className="w-5 h-5" />
          </button>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block" />
          
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}