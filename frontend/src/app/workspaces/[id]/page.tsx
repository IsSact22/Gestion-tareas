'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function WorkspaceDetailPage() {
  const router = useRouter();
  const params = useParams(); 
  const workspaceId = params.id as string;

  useEffect(() => {
    // Redirigir al dashboard del workspace (si existe) o a la lista de boards
    router.push(`/boards?workspace=${workspaceId}`);
  }, [workspaceId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirigiendo...</p>
    </div>
  );
}
