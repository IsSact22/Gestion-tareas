/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Send, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Comment } from '@/services/taskService';
import { useAuthStore } from '@/store/authStore';
import { useConfirm } from '@/hooks/useConfirm';
import Button from '@/components/ui/Button';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function CommentSection({
  comments,
  onAddComment,
  onDeleteComment,
  isLoading = false,
}: CommentSectionProps) {
  const { user } = useAuthStore();
  const { confirm, ConfirmDialog } = useConfirm();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
      toast.success('Comentario agregado');
    } catch (error: any) {
      console.error('Error al agregar comentario:', error);
      toast.error(error.response?.data?.message || 'Error al agregar comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = await confirm({
      title: '¿Eliminar comentario?',
      message: 'Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este comentario?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger',
    });

    if (!confirmed) return;
    
    try {
      await onDeleteComment(commentId);
      toast.success('Comentario eliminado');
    } catch (error: any) {
      console.error('Error al eliminar comentario:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar comentario';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Lista de comentarios */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {comment.user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={comment.user.avatar}
                    alt={comment.user?.name || 'Usuario'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Botón eliminar (solo si es el autor) */}
                  {user?.id === comment.user?.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar comentario"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulario para nuevo comentario */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            rows={2}
            disabled={isSubmitting || isLoading}
            className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={!newComment.trim() || isSubmitting || isLoading}
          className="self-end"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </Button>
      </form>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
