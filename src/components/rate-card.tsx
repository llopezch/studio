import type { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RateCardProps {
  type: 'Compra' | 'Venta';
  rate: string;
  Icon: LucideIcon;
}

export function RateCard({ type, rate, Icon }: RateCardProps) {
  const isBuy = type === 'Compra';

  return (
    <Card
      className={cn(
        'w-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl text-left',
        isBuy ? 'bg-accent text-accent-foreground' : 'bg-card text-card-foreground'
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            'flex items-center justify-between text-lg font-medium',
            isBuy ? 'text-accent-foreground/80' : 'text-muted-foreground'
          )}
        >
          <span>{type}</span>
          <Icon className="h-6 w-6" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div
          className={cn(
            'text-5xl md:text-6xl font-extrabold tracking-tight',
            !isBuy && 'text-primary'
          )}
        >
          <span
            className={cn(
              'text-3xl md:text-4xl font-semibold align-top mr-1',
              isBuy ? 'text-accent-foreground/80' : 'text-muted-foreground'
            )}
          >
            S/
          </span>
          {rate}
        </div>
        <p
          className={cn(
            'text-sm mt-1',
            isBuy ? 'text-accent-foreground/80' : 'text-muted-foreground'
          )}
        >
          1 Dólar Americano (USD)
        </p>
      </CardContent>
    </Card>
  );
}
