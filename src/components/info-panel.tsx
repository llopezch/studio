import { Card, CardContent } from '@/components/ui/card';
import { Info, Clock } from 'lucide-react';

interface InfoPanelProps {
  source: string;
  lastUpdated: string;
}

export function InfoPanel({ source, lastUpdated }: InfoPanelProps) {
  return (
    <Card className="w-full max-w-4xl mt-12 bg-transparent border-none shadow-none">
      <CardContent className="py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-2 md:gap-6">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0" />
            <span>Fuente de datos: {source}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Última actualización: {lastUpdated}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
