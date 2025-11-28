/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Folder, 
  Trello, 
  CheckSquare, 
  Users, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCog,
  User
} from 'lucide-react';
import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';

// Configuración de menús
const allItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: [ 'member', 'viewer'] },
  { icon: Folder, label: 'Workspaces', href: '/workspaces', roles: [ 'member', 'viewer'] },
  { icon: Trello, label: 'Boards', href: '/boards', roles: [ 'member', 'viewer'] },
  { icon: CheckSquare, label: 'Mis Tareas', href: '/tasks', roles: [ 'member', 'viewer'] },
  { icon: Users, label: 'Equipo', href: '/team', roles: [ 'admin','member'] },
  { icon: User, label: 'Mi Perfil', href: '/profile', roles: [ 'admin','member', 'viewer'] },
  // Sección Admin
  { icon: UserCog, label: 'Admin Usuarios', href: '/admin/users', roles: ['admin'] },
  { icon: Folder, label: 'Admin Workspaces', href: '/admin/workspaces', roles: ['admin'] },
  { icon: Trello, label: 'Admin Boards', href: '/admin/boards', roles: ['admin'] },
  { icon: CheckSquare, label: 'Admin Tareas', href: '/admin/tasks', roles: ['admin'] },
];

export default function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const menuItems = useMemo(() => {
    return allItems.filter(item => item.roles.includes(user?.role || 'viewer'));
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Overlay para móvil */}
      <div
        className={cn(
          'fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300',
          !collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={toggleCollapsed}
      />
      
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-slate-50 border-r border-gray-200/60 z-40 transition-all duration-300 ease-in-out flex flex-col',
          collapsed 
            ? '-translate-x-full md:translate-x-0 md:w-20' 
            : 'translate-x-0 w-72'
        )}
      >
        {/* === HEADER & LOGO === */}
        <div className={cn(
          "h-20 flex items-center transition-all relative",
          collapsed ? "justify-center" : "justify-between px-6"
        )}>
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
             <div className="relative w-10 h-10 flex-shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
               <Image 
                  src="https://drive.google.com/uc?export=view&id=1LOsbQcwaCFfTrprLrr-8yCE1CDP15LHM" 
                  alt="AuraTasks Logo" 
                  width={28} 
                  height={28}
                  className="object-contain"
                />
             </div>
             {!collapsed && (
               <span className="font-bold text-xl text-gray-800 tracking-tight whitespace-nowrap">
                 Aura<span className="text-indigo-600">Task</span>
               </span>
             )}
          </Link>

          {/* === BOTÓN DE COLAPSAR (CORREGIDO) === */}
          {/* Este botón ahora siempre existe, pero cambia de posición/estilo según el estado */}
          <button
            onClick={toggleCollapsed}
            className={cn(
              "hidden md:flex items-center justify-center transition-all duration-300 z-50",
              collapsed 
                ? "absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md text-gray-500 hover:text-indigo-600 hover:scale-110" // Estilo "burbuja" cuando está cerrado
                : "p-1.5 rounded-lg text-gray-400 hover:bg-white hover:text-gray-600 hover:shadow-sm border border-transparent hover:border-gray-100" // Estilo normal cuando está abierto
            )}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-200 mx-6 mb-4 opacity-50" />

        {/* === NAVEGACIÓN === */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) toggleCollapsed();
                }}
                className={cn(
                  'group flex items-center px-3 py-3 rounded-xl transition-all duration-200 ease-in-out',
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm border border-gray-100/50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/60',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                  )} 
                />
                
                {!collapsed && (
                  <span className={cn(
                    "ml-3 font-medium text-sm",
                    isActive ? "font-semibold" : ""
                  )}>
                    {item.label}
                  </span>
                )}
                
                {/* Indicador activo (Puntito) */}
                {!collapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* === SECCIÓN USUARIO === */}
        <div className="p-4 mt-auto">
          <div className={cn(
            "rounded-2xl bg-white border border-gray-100 shadow-sm transition-all overflow-hidden",
            collapsed ? "p-2 bg-transparent border-0 shadow-none items-center flex flex-col gap-2" : "p-3"
          )}>
            
            <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3 mb-3")}>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-inner flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {user?.name?.split(' ')[0] || 'Usuario'}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate font-medium">
                    {user?.role === 'admin' ? 'Admin' : user?.role === 'member' ? 'Miembro' : 'Viewer'}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center transition-colors rounded-lg",
                !collapsed 
                  ? "w-full px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 justify-center" 
                  : "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50"
              )}
              title="Cerrar Sesión"
            >
              <LogOut className={cn("w-4 h-4", !collapsed && "mr-2")} />
              {!collapsed && "Cerrar Sesión"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}