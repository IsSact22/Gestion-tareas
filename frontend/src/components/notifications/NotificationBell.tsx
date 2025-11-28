/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Trash2, 
  X, 
  Check, 
  CheckCircle2, 
  UserPlus, 
  MessageSquare, 
  Layout, 
  Briefcase 
} from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils'; // Asegúrate de tener esta utilidad (o usa clases normales)

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification 
  } = useNotificationStore();

  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();
    
    // Polling opcional para mantener actualizado sin socket por ahora (cada 60s)
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount, fetchNotifications]);

  // Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) await markAsRead(notification.id);
    if (notification.link) router.push(notification.link);
    setIsOpen(false);
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  // Iconos Modernos y Colores
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'board_invitation':
        return { icon: Layout, color: 'text-purple-600', bg: 'bg-purple-100' };
      case 'workspace_invitation':
        return { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'task_assigned':
        return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' };
      case 'task_comment':
        return { icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'task_mention':
        return { icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-100' };
      default:
        return { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de Campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2.5 rounded-xl transition-all duration-200 outline-none",
          isOpen ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        )}
      >
        <Bell size={20} className={cn("transition-transform", isOpen && "scale-110")} />
        
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* Dropdown Panel con Animación */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl shadow-indigo-100/50 border border-gray-100 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
               <h3 className="font-bold text-gray-800">Notificaciones</h3>
               {unreadCount > 0 && (
                 <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                   {unreadCount}
                 </span>
               )}
            </div>
            
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                  title="Marcar todas como leídas"
                >
                  <Check size={14} />
                  <span className="hidden sm:inline">Leídas</span>
                </button>
              )}
            </div>
          </div>

          {/* Lista de Notificaciones */}
          <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                   <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-900 font-medium">Estás al día</p>
                <p className="text-sm text-gray-400 mt-1 max-w-[200px]">
                  No tienes notificaciones nuevas por el momento.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => {
                  const style = getNotificationStyle(notification.type);
                  const Icon = style.icon;

                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "group relative p-4 hover:bg-gray-50/80 cursor-pointer transition-all border-l-4",
                        !notification.read ? "border-indigo-500 bg-indigo-50/30" : "border-transparent"
                      )}
                    >
                      <div className="flex gap-3.5">
                        {/* Icono Temático */}
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", 
                          style.bg, style.color
                        )}>
                          <Icon size={18} />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                             <p className={cn("text-sm leading-snug", !notification.read ? "font-semibold text-gray-900" : "text-gray-700")}>
                               {notification.title}
                             </p>
                             <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 ml-1">
                               {formatDistanceToNow(new Date(notification.createdAt), {
                                 addSuffix: false,
                                 locale: es,
                               })}
                             </span>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          {notification.data?.fromUser && (
                            <div className="flex items-center gap-1 mt-2">
                               <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600">
                                  {notification.data.fromUser.name.charAt(0)}
                               </div>
                               <span className="text-xs text-gray-400 font-medium truncate">
                                 {notification.data.fromUser.name}
                               </span>
                            </div>
                          )}
                        </div>

                        {/* Botón Borrar (Hover only desktop) */}
                        <button
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                          className="absolute right-2 bottom-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all md:translate-x-2 group-hover:translate-x-0"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-center">
            <button
              onClick={() => {
                router.push('/notifications');
                setIsOpen(false);
              }}
              className="text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              Ver historial completo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}