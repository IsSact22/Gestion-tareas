'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Trello } from 'lucide-react';

export default function BoardsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Boards</h1>
          <p className="text-gray-600 mt-1">Visualiza y gestiona tus tableros</p>
        </div>
        <Button variant="primary" size="md">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Board
        </Button>
      </div>

      {/* Empty State */}
      <Card variant="bordered">
        <div className="text-center py-16">
          <Trello className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes boards
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer board para empezar a organizar tareas
          </p>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-2" />
            Crear Board
          </Button>
        </div>
      </Card>
    </div>
  );
}
