'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useBoardStore } from '@/store/boardStore';
import { Task } from '@/services/taskService';
import socketService from '@/services/socketService';
import Card from '@/components/ui/Card';
import { 
  Folder, 
  Trello, 
  CheckSquare, 
  Clock,
  TrendingUp,
  Users,
  Plus,
  ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { workspaces, isLoading, fetchWorkspaces } = useWorkspaceStore();
  const { boards, isLoading: boardsLoading, fetchBoards } = useBoardStore();
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
    fetchBoards();
    
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

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Hola, {user?.name || 'Usuario'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Aquí tienes un resumen de tus proyectos y tareas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="bordered" className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Workspaces</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {isLoading ? '...' : workspaces.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span>Espacios de trabajo</span>
          </div>
        </Card>

        <Card variant="bordered" className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Boards</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {boardsLoading ? '...' : boards.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trello className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Tableros activos</span>
          </div>
        </Card>

        <Card variant="bordered" className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tareas Activas</p>
              <p className="text-3xl font-bold text-gray-900">
                {tasksLoading ? '...' : myTasks.filter(t => t.status !== 'done').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>En progreso</span>
          </div>
        </Card>

        <Card variant="bordered" className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-3xl font-bold text-gray-900">
                {tasksLoading ? '...' : myTasks.filter(t => t.status === 'done').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Esta semana</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workspaces */}
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Workspaces Recientes</h2>
            <Link href="/workspaces">
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : workspaces.length === 0 ? (
              <div className="text-center py-8">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No tienes workspaces aún</p>
                <Link href="/workspaces">
                  <Button variant="primary" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Workspace
                  </Button>
                </Link>
              </div>
            ) : (
              workspaces.slice(0, 3).map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={() => router.push(`/workspaces/${workspace.id}`)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Folder className="w-5 h-5 text-blue-600" />  
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{workspace.name}</p>
                      <p className="text-sm text-gray-500">
                        {workspace.members?.length || 0} miembros
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Boards */}
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Boards Recientes</h2>
            <Link href="/boards">
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {boardsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : boards.length === 0 ? (
              <div className="text-center py-8">
                <Trello className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No tienes boards aún</p>
                <Link href="/boards">
                  <Button variant="primary" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Board
                  </Button>
                </Link>
              </div>
            ) : (
              boards.slice(0, 3).map((board) => (
                <div
                  key={board.id}
                  onClick={() => router.push(`/boards/${board.id}`)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: board.color || '#8B5CF6' }}
                    >
                      <Trello className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{board.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {board.workspace.name}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

     {/* My Tasks */}
      <Card variant="bordered">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Mis Tareas</h2>
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {boardsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : boards.length === 0 ? (
            // CASO 1: NO HAY BOARDS
            <div className="text-center py-8">
              <Trello className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No tienes boards aún</p>
              <Link href="/boards">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Board
                </Button>
              </Link>
            </div>
          ) : myTasks.length === 0 ? (
            // CASO 2: HAY BOARDS PERO NO HAY TAREAS (NUEVA CONDICIÓN AQUÍ)
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No tienes tareas asignadas</p>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Crear Tarea
              </Button>
            </div>
          ) : (
            // CASO 3: HAY TAREAS (RENDERIZADO DE LISTA)
            myTasks.slice(0, 3).map((task) => {
              const board = task.board;
              const boardId = typeof board === "string" ? board : board?.id;

              if (!boardId) return null;

              const boardName = typeof board === "string" ? "Board" : board?.name || "Sin tablero";
              const boardColor = typeof board === "string" ? "#8B5CF6" : board?.color || "#8B5CF6";

              return (
                <div
                  key={task.id}
                  onClick={() => router.push(`/boards/${boardId}`)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: boardColor }}
                    >
                      <Trello className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        {task.description || "Sin descripción"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            task.priority === "urgent"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "high"
                              ? "bg-orange-100 text-orange-700"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-[150px]">
                          {boardName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Team Activity */}
      <Card variant="bordered">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Actividad del Equipo</h2>
          <Button variant="ghost" size="sm">
            Ver todo
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Empty State */}
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No hay actividad reciente</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
