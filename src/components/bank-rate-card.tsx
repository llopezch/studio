
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface BankRateCardProps {
  name: string;
  date: string;
  buy: number;
  sell: number;
  buyChange: number;
  sellChange: number;
  logoUrl: string;
}

function RateChange({ value }: { value: number }) {
  const isNegative = value < 0;
  const isPositive = value >= 0; // Se considera 0 como positivo (verde)

  const Icon = isPositive ? ArrowUp : ArrowDown;
  
  return (
    <div className={cn(
      "flex items-center text-xs font-semibold gap-1 px-2 py-1 rounded-full",
      isPositive && "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
      isNegative && "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-destructive"
    )}>
      <Icon className="h-3 w-3" />
      <span>{isPositive ? '+' : ''}{(value || 0).toFixed(4)}</span>
    </div>
  )
}

export function BankRateCard({ name, date, buy, sell, buyChange, sellChange, logoUrl }: BankRateCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-10 relative flex items-center justify-center">
            <Image 
              src={logoUrl} 
              alt={`${name} logo`} 
              layout="fill" 
              objectFit="contain"
              unoptimized 
            />
          </div>
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </div>
        <div className="flex gap-6 text-left sm:text-right w-full sm:w-auto justify-around sm:justify-end">
          <div>
            <div className="text-sm text-muted-foreground">Compra</div>
            <div className="font-bold text-lg">{buy.toFixed(3)}</div>
            <RateChange value={buyChange} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Venta</div>
            <div className="font-bold text-lg">{sell.toFixed(3)}</div>
            <RateChange value={sellChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
