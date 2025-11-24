'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  // En móvil empieza cerrado (collapsed=true), en desktop abierto (collapsed=false)
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    // Detectar si es desktop al montar
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    setCollapsed(!isDesktop); // Desktop: false (abierto), Móvil: true (cerrado)
  }, []);

  const toggleCollapsed = () => setCollapsed(prev => !prev);

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
