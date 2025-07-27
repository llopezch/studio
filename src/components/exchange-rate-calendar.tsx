
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const mockRates = Array.from({ length: 31 }, (_, i) => i + 1).reduce((acc, day) => {
  acc[day] = {
    buy: (3.75 + (Math.random() - 0.5) * 0.1).toFixed(3),
    sell: (3.78 + (Math.random() - 0.5) * 0.1).toFixed(3),
  };
  return acc;
}, {} as Record<number, { buy: string, sell: string }>);


export function ExchangeRateCalendar() {
  const [displayDate, setDisplayDate] = React.useState(new Date())
  const [rateType, setRateType] = React.useState<"buy" | "sell">("buy")
  
  const today = new Date();

  const monthName = displayDate.toLocaleString('es-PE', { month: 'long' });
  const year = displayDate.getFullYear();

  const handlePrevMonth = () => {
    setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  const handleNextMonth = () => {
    setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
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
        {Array.from({ length: new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
        
        {days.map((day) => {
          const isToday = today.getFullYear() === displayDate.getFullYear() &&
                          today.getMonth() === displayDate.getMonth() &&
                          today.getDate() === day;
          return (
            <div key={day} className="p-1">
              <div className={cn(
                "flex flex-col items-center justify-center h-16 rounded-md border text-sm relative",
                rateType === 'buy' ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/20" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/20",
                isToday && "ring-2 ring-primary"
              )}>
                <div className="font-semibold">{day}</div>
                <div className={cn("text-xs", rateType === 'buy' ? "text-green-700 dark:text-green-400" : "text-destructive")}>
                  {mockRates[day][rateType]}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
