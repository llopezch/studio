
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function RefreshButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-header"
      onClick={() => router.refresh()}
    >
      <RefreshCw className="mr-1.5" />
      Actualizar
    </Button>
  );
}

    