/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useBoardStore } from '@/store/boardStore';
import { Task } from '@/services/taskService';
import { Team } from '@/services/teamService';
import socketService from '@/services/socketService';
import { 
  Folder, 
  Trello, 
  CheckSquare, 
  Clock,
  TrendingUp,
  Users,
  Plus,
  ArrowRight,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { workspaces, isLoading, fetchWorkspaces } = useWorkspaceStore();
  const { boards, isLoading: boardsLoading, fetchBoards } = useBoardStore();
  const [teams, setTeams] = useState<Team[]>([]); 
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
    fetchBoards();
    // Cargar equipos
    const loadTeams = async () => {
      try {
        const teamsService = (await import('@/services/teamService')).default;
        const teams = await teamsService.getTeams();
        setTeams(teams);
      } catch (error) {
        console.error('Error al cargar equipos:', error);
      } finally {
        setTeamsLoading(false);
      }
    };
    loadTeams();
    // Cargar mis tareas
    const loadTasks = async () => {
      try {
        const taskService = (await import('@/services/taskService')).default;
        const tasks = await taskService.getMyTasks();
        setMyTasks(tasks);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      } finally {
        setTasksLoading(false);
      }
    };
    
    loadTasks();
  }, [fetchWorkspaces, fetchBoards]);

  // Unirse a todos los workspaces del usuario
  useEffect(() => {
    if (workspaces.length > 0) {
      workspaces.forEach(workspace => {
        socketService.joinWorkspace(workspace.id);
        console.log(`🏢 Uniéndose al workspace: ${workspace.name}`);
      });
    }
  }, [workspaces]);

  // --- COMPONENTES UI AUXILIARES PARA ESTE DISEÑO ---
  // Stat Card Component para el diseño Bento
  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, subtext, subIcon: SubIcon }: any) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgClass} bg-opacity-50`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        {SubIcon && (
          <div className="flex items-center text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            <SubIcon className="w-3 h-3 mr-1" />
            {subtext}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto md:space-y-8">
      
      {/* 1. Header Section con un toque más personal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            ¡Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name?.split(' ')[0] || 'Usuario'}</span>! 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Aquí tienes el resumen de tu actividad en <span className="font-semibold text-gray-700">AuraTask</span>.
          </p>
        </div>
        <div className="hidden md:block">
           <span className="text-sm text-gray-400 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
             {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </span>
        </div>
      </div>

      {/* 2. Stats Grid (Estilo Bento) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Workspaces" 
          value={isLoading ? '...' : workspaces.length} 
          icon={Folder} 
          colorClass="text-blue-600" 
          bgClass="bg-blue-100"
          subtext="Total"
          subIcon={Users}
        />
        <StatCard 
          title="Boards Activos" 
          value={boardsLoading ? '...' : boards.length} 
          icon={Trello} 
          colorClass="text-purple-600" 
          bgClass="bg-purple-100"
          subtext="Activos"
          subIcon={TrendingUp}
        />
        <StatCard 
          title="Tareas en Progreso" 
          value={tasksLoading ? '...' : myTasks.filter(t => t.status !== 'done').length} 
          icon={Clock} 
          colorClass="text-orange-600" 
          bgClass="bg-orange-100"
          subtext="Pendientes"
          subIcon={LayoutGrid}
        />
        <StatCard 
          title="Completadas" 
          value={tasksLoading ? '...' : myTasks.filter(t => t.status === 'done').length} 
          icon={CheckSquare} 
          colorClass="text-green-600" 
          bgClass="bg-green-100"
          subtext="Esta semana"
          subIcon={Sparkles}
        />
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Columna Izquierda (2/3 ancho): Workspaces & Boards */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Workspaces Section */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Folder className="w-5 h-5 text-gray-400" /> Workspaces Recientes
              </h2>
              <Link href="/workspaces">
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  Ver todos <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : workspaces.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Folder className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4 font-medium">No tienes workspaces aún</p>
                  <Link href="/workspaces">
                    <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                      <Plus className="w-4 h-4 mr-2" /> Crear Workspace
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workspaces.slice(0, 4).map((workspace) => (
                    <div
                      key={workspace.id}
                      onClick={() => router.push(`/workspaces/${workspace.id}`)}
                      className="group flex items-center p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-500 hover:shadow-md hover:bg-blue-50/30 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                         <span className="font-bold text-lg">{workspace.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">{workspace.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {workspace.members?.length || 0} miembros
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Boards Section */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Trello className="w-5 h-5 text-gray-400" /> Boards Recientes
              </h2>
              <Link href="/boards">
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  Ver todos <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {boardsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : boards.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Trello className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4 font-medium">No hay tableros creados</p>
                  <Link href="/boards">
                    <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200">
                      <Plus className="w-4 h-4 mr-2" /> Crear Board
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boards.slice(0, 6).map((board) => (
                    <div
                      key={board.id}
                      onClick={() => router.push(`/boards/${board.id}`)}
                      className="group relative overflow-hidden p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all cursor-pointer h-32 flex flex-col justify-between"
                    >
                      <div 
                        className="absolute top-0 right-0 w-24 h-24 bg-opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"
                        style={{ backgroundColor: board.color || '#8B5CF6' }}
                      />
                      
                      <div className="flex items-start justify-between relative z-10">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                          style={{ backgroundColor: board.color || '#8B5CF6' }}
                        >
                          <Trello className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="relative z-10">
                        <h4 className="font-bold text-gray-800 truncate pr-2">{board.name}</h4>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {board.workspace.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Columna Derecha (1/3 ancho): Tareas y Equipos */}
        <div className="space-y-6 md:space-y-8">
          
          {/* My Tasks - Estilo Lista Vertical Elegante */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Mis Tareas</h2>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-indigo-600">
                  Ver todas
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {tasksLoading ? (
                 <div className="flex justify-center py-8">
                   <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                 </div>
              ) : myTasks.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">¡Todo al día! 🎉</p>
                  <p className="text-xs text-gray-400 mt-1">No tienes tareas pendientes</p>
                </div>
              ) : (
                myTasks.slice(0, 5).map((task) => {
                  const board = task.board;
                  const boardId = typeof board === "string" ? board : board?.id;
                  if (!boardId) return null;
                  const boardColor = typeof board === "string" ? "#8B5CF6" : board?.color || "#8B5CF6";

                  // Lógica de colores de prioridad simplificada para clases Tailwind
                  const priorityColors = {
                    urgent: "bg-red-50 text-red-600 border-red-100",
                    high: "bg-orange-50 text-orange-600 border-orange-100",
                    medium: "bg-yellow-50 text-yellow-600 border-yellow-100",
                    low: "bg-gray-50 text-gray-600 border-gray-100"
                  };
                  const pColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.low;

                  return (
                    <div
                      key={task.id}
                      onClick={() => router.push(`/boards/${boardId}`)}
                      className="group flex flex-col p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                           className="w-2 h-2 mt-2 rounded-full flex-shrink-0"
                           style={{ backgroundColor: boardColor }} 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5 mb-2">
                             {task.description || "Sin descripción"}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${pColor}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-px bg-gray-100 mt-3 group-last:hidden" />
                    </div>
                  );
                })
              )}
            </div>
            
            {myTasks.length > 0 && (
              <Link href="/tasks">
                 <button className="w-full mt-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-200">
                    + Ver el resto de tareas
                 </button>
              </Link>
            )}
          </section>

          {/* Teams Section - Compacto */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Mis Equipos</h2>
              <Link href="/team">
                 <Plus className="w-5 h-5 text-gray-400 hover:text-indigo-600 cursor-pointer" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {teamsLoading ? (
                 <div className="h-20 bg-gray-50 animate-pulse rounded-xl"></div>
              ) : teams.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">Sin equipos</p>
                </div>
              ) : (
                teams.slice(0, 3).map((team: any) => (
                  <div
                    key={team.id}
                    onClick={() => router.push(`/team/${team.id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 cursor-pointer transition-all"
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{team.name}</p>
                      <p className="text-xs text-gray-500 truncate">Miembro del equipo</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-300" />
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}