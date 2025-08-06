
"use client"

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';
import type { RecentConversion } from '@/app/page';

interface RecentChangesCardProps {
    conversions: RecentConversion[];
}

export function RecentChangesCard({ conversions }: RecentChangesCardProps) {
    const [currentTime, setCurrentTime] = React.useState<string>("");

    React.useEffect(() => {
        const updateCurrentTime = () => {
            const time = new Date().toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'America/Lima'
            }).replace('24:', '00:');
            setCurrentTime(time);
        }
        
        updateCurrentTime();
        // Although the time is fetched on mount, you could set up an interval 
        // to update it every minute if real-time clock display is needed.
        // const intervalId = setInterval(updateCurrentTime, 60000);
        // return () => clearInterval(intervalId);

    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">Cambios Recientes (PEN/USD)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                {conversions.length > 0 ? (
                    <ul role="list" className="divide-y divide-border">
                        {conversions.map((conv) => {
                            const isPositive = conv.change >= 0;
                            return (
                                <li key={conv.id} className="px-6 py-3 flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground truncate">{currentTime || conv.time}</p>
                                    <div className="ml-4 text-right">
                                        <p className="font-semibold text-foreground">{conv.value.toFixed(4)}</p>
                                        <div className={`text-xs font-mono px-2 py-1 rounded-md inline-block ${isPositive ? 'bg-green-100/80 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
                                            {isPositive ? '+' : ''}{(conv.change.toFixed(5))}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground text-center p-6">No hay datos de conversiones recientes.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
