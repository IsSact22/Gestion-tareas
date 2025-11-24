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

// Menús según el rol del usuario
const getMenuItemsByRole = (role: string) => {
  const baseItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['admin', 'member', 'viewer'] },
    { icon: Folder, label: 'Workspaces', href: '/workspaces', roles: [ 'member', 'viewer'] },
    { icon: Trello, label: 'Boards', href: '/boards', roles: ['member', 'viewer'] },
    { icon: CheckSquare, label: 'My Tasks', href: '/tasks', roles: ['member', 'viewer'] },
  ];

  const adminItems = [
    { icon: UserCog, label: 'Manage Users', href: '/admin/users', roles: ['admin'], section: 'admin' },
    { icon: Folder, label: 'All Workspaces', href: '/admin/workspaces', roles: ['admin'], section: 'admin' },
    { icon: Trello, label: 'All Boards', href: '/admin/boards', roles: ['admin'], section: 'admin' },
    { icon: CheckSquare, label: 'All Tasks', href: '/admin/tasks', roles: ['admin'], section: 'admin' },
    { icon: Users, label: 'Team', href: '/team', roles: ['admin', 'member'] },
  ];

  const settingsItems = [
    { icon: User, label: 'My Profile', href: '/profile', roles: ['admin', 'member', 'viewer'] },
  ];

  const allItems = [...baseItems, ...adminItems, ...settingsItems];
  
  return allItems.filter(item => item.roles.includes(role));
};

export default function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  // Obtener menús según el rol del usuario
  const menuItems = useMemo(() => {
    return getMenuItemsByRole(user?.role || 'viewer');
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Overlay para móvil - solo visible cuando sidebar está abierto en móvil */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity',
          !collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={toggleCollapsed}
      />
      
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40',
          // Móvil: collapsed=true (cerrado), collapsed=false (abierto)
          // Desktop: collapsed=true (colapsado 80px), collapsed=false (expandido 256px)
          collapsed 
            ? '-translate-x-full md:translate-x-0 md:w-20' 
            : 'translate-x-0 w-64'
        )}
      >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center space-x-2">
             <Image 
                src="/logo/logo-aura.svg" 
                alt="AuraTasks Logo" 
                width={60} 
                height={60}
                className="w-12 h-12"
              />
            <span className="font-bold text-gray-900">AuraTask</span>
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center justify-center">
            <Image 
              src="/logo/logo-aura.svg" 
              alt="AuraTask Logo" 
              width={32} 
              height={32}
              className="w-12 h-12"
            />
          </Link>
        )}
        {/* Botón de colapsar - solo visible en desktop */}
        <button
          onClick={toggleCollapsed}
          className="hidden md:block p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                // Cerrar sidebar en móvil al hacer clic en un link
                if (window.innerWidth < 768) {
                  toggleCollapsed();
                }
              }}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Usuario'}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'email@example.com'}
                  </p>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user?.role === 'member' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {user?.role === 'admin' ? 'Admin' : 
                     user?.role === 'member' ? 'Member' : 'Viewer'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
    </>
  );
}
