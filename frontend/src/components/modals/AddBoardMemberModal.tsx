/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { X, UserPlus, Search } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import boardService from '@/services/boardService';
import userService, { User } from '@/services/userService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface AddBoardMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
}

const ROLES = [
  { value: 'admin', label: 'Admin', description: 'Puede gestionar todo el board' },
  { value: 'member', label: 'Miembro', description: 'Puede crear y editar' },
  { value: 'viewer', label: 'Visualizador', description: 'Solo puede ver' },
];

export default function AddBoardMemberModal({ isOpen, onClose, boardId }: AddBoardMemberModalProps) {
  const { fetchBoardById, currentBoard } = useBoardStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<User | null>(null);

  const handleSearchUser = async () => {
    if (!email.trim()) {
      toast.error('Por favor ingresa un email');
      return;
    }

    setIsSearching(true);
    try {
      const user = await userService.searchByEmail(email);
      if (user) {
        // Verificar si el usuario ya es miembro del board
        const isAlreadyMember = currentBoard?.members?.some(
          (member) => member.user.id === user.id
        );

        if (isAlreadyMember) {
          toast.error(`${user.name} ya es miembro de este board`);
          setFoundUser(null);
          return;
        }

        setFoundUser(user);
        toast.success(`Usuario encontrado: ${user.name}`);
      } else {
        toast.error('Usuario no encontrado');
        setFoundUser(null);
      }
    } catch (error) {
      toast.error('Error al buscar usuario');
      setFoundUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foundUser) {
      toast.error('Primero busca un usuario válido');
      return;
    }

    // Verificar nuevamente antes de enviar
    const isAlreadyMember = currentBoard?.members?.some(
      (member) => member.user.id === foundUser.id
    );

    if (isAlreadyMember) {
      toast.error(`${foundUser.name} ya es miembro de este board`);
      return;
    }

    setIsLoading(true);
    try {
      await boardService.addMember(boardId, foundUser.email, role);
      
      // Recargar el board para mostrar el nuevo miembro
      await fetchBoardById(boardId);
      
      toast.success(`${foundUser.name} agregado exitosamente al board`);
      onClose();
      setEmail('');
      setRole('member');
      setFoundUser(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al agregar miembro';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlus size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Agregar Miembro</h2>
              <p className="text-sm text-gray-600">Invita a alguien a este board</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email del usuario *
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFoundUser(null);
                }}
                placeholder="usuario@ejemplo.com"
                required
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchUser();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleSearchUser}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isSearching || !email.trim()}
                variant="secondary"
              >
                <Search size={18} />
              </Button>
            </div>
            
            {/* Usuario encontrado */}
            {foundUser && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                  {foundUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{foundUser.name}</p>
                  <p className="text-sm text-gray-600">{foundUser.email}</p>
                </div>
                <div className="text-green-600">✓</div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              {foundUser ? 'Usuario listo para agregar' : 'Busca el usuario por email'}
            </p>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rol en el board 
            </label>
            <div className="space-y-2">
              {ROLES.map((roleOption) => (
                <label
                  key={roleOption.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    role === roleOption.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={roleOption.value}
                    checked={role === roleOption.value}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{roleOption.label}</div>
                    <div className="text-sm text-gray-600">{roleOption.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-indigo-800">
              💡 <strong>Nota:</strong> Los miembros del workspace ya tienen acceso a este board. 
              Solo agrega miembros adicionales si necesitas dar acceso a usuarios fuera del workspace.
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading || !foundUser}
            >
              {isLoading ? 'Agregando...' : 'Agregar Miembro'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
