
"use client"

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';
import type { RecentConversion } from '@/app/page';

interface RecentChangesCardProps {
    conversions: RecentConversion[];
}

const formatUpdateTime = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        // Format to show Day, Month, Hour, and Minute in Peru's time zone
        return new Intl.DateTimeFormat('es-PE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/Lima',
        }).format(date).replace('.', '');
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Fecha inválida";
    }
}

export function RecentChangesCard({ conversions }: RecentChangesCardProps) {

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
                                    <p className="text-sm font-medium text-muted-foreground truncate w-28 capitalize">
                                        {formatUpdateTime(conv.time)}
                                    </p>
                                    <div className="ml-4 text-right">
                                        <p className="font-semibold text-foreground">{conv.value.toFixed(5)}</p>
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
