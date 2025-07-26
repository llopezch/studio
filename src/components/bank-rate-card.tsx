import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const BankLogo = ({ name, logoUrl }: { name: string, logoUrl: string }) => {
  return (
    <div className="w-24 h-10 flex items-center justify-center">
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        width={100}
        height={28}
        className="object-contain w-full h-full"
      />
    </div>
  );
};


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
  const isPositive = value >= 0;
  return (
    <div className={cn(
      "flex items-center text-xs",
      isPositive ? "text-green-600" : "text-red-600"
    )}>
      {isPositive ? '+' : ''}{value.toFixed(4)}
    </div>
  )
}

export function BankRateCard({ name, date, buy, sell, buyChange, sellChange, logoUrl }: BankRateCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BankLogo name={name} logoUrl={logoUrl} />
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="text-sm text-muted-foreground">Compra</div>
            <div className="font-bold text-lg text-red-600">{buy.toFixed(3)}</div>
            <RateChange value={buyChange} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Venta</div>
            <div className="font-bold text-lg text-green-600">{sell.toFixed(3)}</div>
            <RateChange value={sellChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
