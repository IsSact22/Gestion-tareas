/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { X, Users, Trash2, Shield, Eye, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBoardStore } from '@/store/boardStore';
import { useConfirm } from '@/hooks/useConfirm';
import boardService from '@/services/boardService';
import Button from '@/components/ui/Button';

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
}

const roleIcons = {
  admin: Shield,
  member: UserCog,
  viewer: Eye,
};

const roleLabels = {
  admin: 'Admin',
  member: 'Miembro',
  viewer: 'Visualizador',
};

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  member: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800',
};

export default function ManageMembersModal({ isOpen, onClose, boardId }: ManageMembersModalProps) {
  const { currentBoard, fetchBoardById } = useBoardStore();
  const { confirm, ConfirmDialog } = useConfirm();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    const confirmed = await confirm({
      title: '¿Eliminar miembro?',
      message: `¿Estás seguro de que deseas eliminar a ${memberName} del board? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger',
    });

    if (!confirmed) return;

    setIsDeleting(memberId);
    try {
      await boardService.removeMember(boardId, memberId);
      await fetchBoardById(boardId);
      toast.success(`${memberName} eliminado del board`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar miembro';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isOpen || !currentBoard) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gestionar Miembros</h2>
              <p className="text-sm text-gray-600">
                {currentBoard.members?.length || 0} miembro(s) en este board
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {currentBoard.members?.map((member) => {
              const RoleIcon = roleIcons[member.role];
              return (
                <div
                  key={`${member.user.id}-${member.role}`}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-medium">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{member.user.name}</h3>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                  </div>

                  {/* Role Badge */}
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${roleColors[member.role]}`}>
                    <RoleIcon size={14} />
                    {roleLabels[member.role]}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveMember(member.user.id, member.user.name)}
                    disabled={isDeleting === member.user.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar miembro"
                  >
                    {isDeleting === member.user.id ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {currentBoard.members?.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay miembros en este board</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 ">
          <Button variant="secondary" onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700">
            Cerrar
          </Button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
