
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SunatData {
  [key: string]: {
    buy: number;
    sell: number;
  }
}

interface ExchangeRateCalendarProps {
  rates: SunatData;
}

export function ExchangeRateCalendar({ rates }: ExchangeRateCalendarProps) {
  const [displayDate, setDisplayDate] = React.useState(new Date())
  const [rateType, setRateType] = React.useState<"buy" | "sell">("buy")
  
  const today = new Date();
  // Set time to 00:00:00 to compare dates only
  today.setHours(0, 0, 0, 0);


  const monthName = displayDate.toLocaleString('es-PE', { month: 'long' });
  const year = displayDate.getFullYear();

  const handlePrevMonth = () => {
    setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  const handleNextMonth = () => {
    setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay();
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
        {/* Placeholder for empty days */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        
        {days.map((day) => {
          const currentDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
          const dateKey = currentDate.toISOString().split('T')[0];
          const rateData = rates[dateKey];

          const isToday = today.getTime() === currentDate.getTime();
          
          if (!rateData) {
            return (
              <div key={day} className="p-1">
                <div className={cn(
                  "flex flex-col items-center justify-center h-16 rounded-md border border-dashed text-sm relative",
                   isToday && "ring-2 ring-primary"
                )}>
                  <div className="font-semibold text-muted-foreground">{day}</div>
                </div>
              </div>
            )
          }

          return (
            <div key={day} className="p-1">
              <div className={cn(
                "flex flex-col items-center justify-center h-16 rounded-md border text-sm relative",
                rateType === 'buy' ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/20" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/20",
                isToday && "ring-2 ring-primary"
              )}>
                <div className="font-semibold">{day}</div>
                <div className={cn("text-xs font-bold", rateType === 'buy' ? "text-green-700 dark:text-green-400" : "text-destructive")}>
                  {rateData[rateType].toFixed(3)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
