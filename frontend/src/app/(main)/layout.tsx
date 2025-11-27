'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/hooks/useSocket';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'react-hot-toast';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <Toaster position="top-right" />
      <Sidebar />
      
      {/* Contenedor principal que se ajusta al sidebar */}
      <div className={cn(
        'flex flex-col flex-1 transition-all duration-300 overflow-hidden',
        // En móvil: sin margen (sidebar es overlay)
        // En desktop: margen según estado del sidebar
        collapsed ? 'md:ml-20' : 'md:ml-72'
      )}>
        <Navbar />
        
        {/* Contenido de las páginas - Sin padding, las páginas manejan su propio espaciado */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuthStore();
  
  // Inicializar Socket.IO automáticamente
  useSocket();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <SidebarProvider>
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  );
}