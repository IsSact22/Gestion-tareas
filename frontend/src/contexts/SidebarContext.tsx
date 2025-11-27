'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Inicializamos en false (abierto) por defecto para evitar parpadeos en SSR
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // 1. Verificamos si hay una preferencia guardada por el usuario
    const savedState = localStorage.getItem('sidebar-collapsed');

    if (savedState !== null) {
      // Si el usuario ya eligió antes, respetamos su decisión
      setCollapsed(JSON.parse(savedState));
    } else {
      // 2. Si es la primera vez que entra, decidimos según el ancho de pantalla
      // Si es móvil (< 768px), lo cerramos por defecto. Si es desktop, abierto.
      const isMobile = window.innerWidth < 768;
      setCollapsed(isMobile);
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const newState = !prev;
      // Guardamos la nueva preferencia cada vez que el usuario hace clic
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}