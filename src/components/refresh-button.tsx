
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function RefreshButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-[hsl(var(--header-background))]"
      onClick={() => router.refresh()}
    >
      <RefreshCw className="mr-2" />
      Actualizar
    </Button>
  );
}
