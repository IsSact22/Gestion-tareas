'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();

  // Detectamos si estamos viendo un tablero específico (ej: /boards/123)
  // Si es así, activamos el "Modo Pantalla Completa"
  const isBoardView = pathname.startsWith('/boards/') && pathname.split('/').length > 2;

  return (
    <main 
      className={cn(
        "min-h-screen bg-gray-50 transition-all duration-300 ease-in-out",
        // Margen izquierdo para el Sidebar (se mantiene igual)
        collapsed ? "md:ml-20" : "md:ml-72",
        
        // --- AQUÍ ESTÁ EL TRUCO ---
        isBoardView 
          ? "p-0 h-screen overflow-hidden flex flex-col" // MODO BOARD: Sin padding, altura fija 100vh
          : "pt-20 px-4 pb-20 md:pt-8 md:px-8 md:pb-8"   // MODO NORMAL: Con márgenes y padding
      )}
    >
      <div className={cn(
        "w-full h-full",
        // Solo limitamos el ancho si NO estamos en un tablero
        !isBoardView && "max-w-7xl mx-auto"
      )}>
        {children}
      </div>
    </main>
  );
}