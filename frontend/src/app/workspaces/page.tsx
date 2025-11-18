'use client';

import { useEffect, useState } from 'react';
import { Folder, Plus, Users, Calendar, MoreVertical, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Toaster } from 'react-hot-toast';

export default function WorkspacesPage() {
  const router = useRouter();
  const { workspaces, isLoading, fetchWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspaceStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createWorkspace(formData);
    if (result) {
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '' });
    }
  };

  const handleEditWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWorkspace) {
      const result = await updateWorkspace(selectedWorkspace.id, formData);
      if (result) {
        setIsEditModalOpen(false);
        setSelectedWorkspace(null);
        setFormData({ name: '', description: '' });
      }
    }
  };

  const handleDeleteWorkspace = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este workspace? Esta acción no se puede deshacer.')) {
      await deleteWorkspace(id);
      setShowDropdown(null);
    }
  };

  const openEditModal = (workspace: any) => {
    setSelectedWorkspace(workspace);
    setFormData({
      name: workspace.name,
      description: workspace.description || '',
    });
    setIsEditModalOpen(true);
    setShowDropdown(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading && workspaces.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando workspaces...</p>
        </div>
      </div>
    );
  }

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
                    <p className="text-gray-600">Organiza tus proyectos en espacios de trabajo</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Workspace</span>
                </button>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
                    >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span>Volver al Dashboard</span>
                    </button>
            </div>

            {/* Empty State */}
            {workspaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-300 py-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                        <Folder className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        No hay workspaces aún
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Crea tu primer workspace para comenzar a organizar tus proyectos.
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Crear Workspace</span>
                    </button>
                </div>
            ) : (
                /* Workspaces Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {workspaces.map((workspace) => (
                        <div
                            key={workspace.id}
                            onClick={() => router.push(`/workspaces/${workspace.id}`)}
                            className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer relative"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                                        <Folder className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        {workspace.name}
                                    </h3>
                                    {workspace.description && (
                                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                            {workspace.description}
                                        </p>
                                    )}
                                </div>

                                {/* Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDropdown(
                                                showDropdown === workspace.id ? null : workspace.id
                                            );
                                        }}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5 text-gray-500" />
                                    </button>

                                    {showDropdown === workspace.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 animate-fadeIn">
                                            <button
                                                onClick={() => openEditModal(workspace)}
                                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span>Editar</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWorkspace(workspace.id)}
                                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Eliminar</span>
                                            </button>
                                        </div>
                                    )}  
                                </div>
                            </div>

                            {/* Footer info */}
                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{workspace.members?.length || 0} miembros</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(workspace.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setFormData({ name: "", description: "" });
                }}
                title="Crear Nuevo Workspace"
            >
                <form onSubmit={handleCreateWorkspace} className="space-y-6">
                    <Input
                        label="Nombre del Workspace"
                        type="text"
                        placeholder="Ej: Proyecto Marketing"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción (opcional)
                        </label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            rows={4}
                            placeholder="Describe el propósito de este workspace..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Creando..." : "Crear Workspace"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setFormData({ name: "", description: "" });
                            }}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedWorkspace(null);
                    setFormData({ name: "", description: "" });
                }}
                title="Editar Workspace"
            >
                <form onSubmit={handleEditWorkspace} className="space-y-6">
                    <Input
                        label="Nombre del Workspace"
                        type="text"
                        placeholder="Ej: Proyecto Marketing"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción (opcional)
                        </label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            rows={4}
                            placeholder="Describe el propósito de este workspace..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setSelectedWorkspace(null);
                                setFormData({ name: "", description: "" });
                            }}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
