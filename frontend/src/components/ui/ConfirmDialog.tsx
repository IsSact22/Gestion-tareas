import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

const variantConfig = {
  danger: {
    icon: XCircle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    confirmButton: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    confirmButton: 'primary' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    confirmButton: 'primary' as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    confirmButton: 'primary' as const,
  },
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={config.confirmButton} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
