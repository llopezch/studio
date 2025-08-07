
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { SunatData } from "@/app/page"
import { toDateKey } from "@/app/page"


interface ExchangeRateCalendarProps {
  rates: SunatData;
  startDate?: string | null;
}

export function ExchangeRateCalendar({ rates, startDate }: ExchangeRateCalendarProps) {
  const [displayDate, setDisplayDate] = React.useState<Date | null>(null)
  const [rateType, setRateType] = React.useState<"buy" | "sell">("buy")
  
  React.useEffect(() => {
    // This code runs only on the client, after the initial render,
    // to ensure the initial date is always the current date.
    // This avoids hydration mismatch errors and aligns with user expectation.
    const initialDate = new Date();
    initialDate.setUTCHours(0, 0, 0, 0);
    setDisplayDate(initialDate);
  }, []); // Empty dependency array ensures this runs only once on client mount.
  
  if (!displayDate) {
    // Render a skeleton or loading state on the server and initial client render
    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-7 w-7" />
                </div>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
                <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
            </div>
            <div className="grid grid-cols-7 mt-2">
                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="p-1">
                        <Skeleton className="h-16 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
  }

  const todayInLima = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));
  todayInLima.setUTCHours(0, 0, 0, 0);
  const todayKey = toDateKey(todayInLima);

  const monthName = displayDate.toLocaleString('es-PE', { month: 'long', timeZone: 'UTC' });
  const year = displayDate.getUTCFullYear();

  const handlePrevMonth = () => {
    setDisplayDate(d => {
      if (!d) return null;
      const newDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1));
      return newDate;
    });
  }

  const handleNextMonth = () => {
    setDisplayDate(d => {
       if (!d) return null;
       const newDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
       return newDate;
    });
  }

  const firstDayOfMonth = new Date(displayDate.getUTCFullYear(), displayDate.getUTCMonth(), 1).getUTCDay();
  const daysInMonth = new Date(displayDate.getUTCFullYear(), displayDate.getUTCMonth() + 1, 0).getUTCDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <RadioGroup defaultValue="buy" onValueChange={(v) => setRateType(v as "buy" | "sell")} className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="buy" id="buy" />
            <Label htmlFor="buy" className="text-sm">Compra</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sell" id="sell" />
            <Label htmlFor="sell" className="text-sm">Venta</Label>
          </div>
        </RadioGroup>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize">{monthName} {year}</span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
        <div>Dom</div>
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
      </div>
      <div className="grid grid-cols-7 mt-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        
        {days.map((day) => {
          const currentDate = new Date(Date.UTC(displayDate.getUTCFullYear(), displayDate.getUTCMonth(), day));
          const dateKey = toDateKey(currentDate);
          const rateData = rates[dateKey];
          const isToday = dateKey === todayKey;
          
          const hasData = !!rateData;

          return (
            <div key={day} className="p-1">
              <div className={cn(
                "flex flex-col items-center justify-center h-16 rounded-md border text-sm relative",
                isToday && "ring-2 ring-primary dark:ring-primary/50",
                !hasData && "border-dashed",
                hasData && rateType === 'buy' && "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/20",
                hasData && rateType === 'sell' && "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/20"
              )}>
                <div className={cn("font-semibold", !hasData && "text-muted-foreground")}>
                  {day}
                </div>
                {hasData && (
                  <div className={cn(
                    "text-xs font-bold",
                    rateType === 'buy' ? "text-green-700 dark:text-green-400" : "text-destructive"
                  )}>
                    {rateData[rateType].toFixed(3)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
