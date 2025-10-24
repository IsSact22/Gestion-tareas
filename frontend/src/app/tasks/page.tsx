'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, CheckSquare } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
          <p className="text-gray-600 mt-1">Todas las tareas asignadas a ti</p>
        </div>
        <Button variant="primary" size="md">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Empty State */}
      <Card variant="bordered">
        <div className="text-center py-16">
          <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes tareas asignadas
          </h3>
          <p className="text-gray-600 mb-6">
            Las tareas que te asignen aparecerán aquí
          </p>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-2" />
            Crear Tarea
          </Button>
        </div>
      </Card>
    </div>
  );
}
