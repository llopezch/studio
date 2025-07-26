import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BankRateCardProps {
  name: string;
  logo: string;
  date: string;
  buy: number;
  sell: number;
  buyChange: number;
  sellChange: number;
}

function RateChange({ value }: { value: number }) {
  const isPositive = value > 0;
  return (
    <div className={cn(
      "flex items-center text-xs",
      isPositive ? "text-green-600" : "text-red-600"
    )}>
      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
      <span>{isPositive ? '+' : ''}{value.toFixed(4)}</span>
    </div>
  )
}

export function BankRateCard({ name, logo, date, buy, sell, buyChange, sellChange }: BankRateCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src={logo} alt={`${name} logo`} width={80} height={24} className="object-contain" data-ai-hint="logo" />
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </div>
        <div className="flex gap-6 text-right">
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
