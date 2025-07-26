"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const days = Array.from({ length: 31 }, (_, i) => i + 1)

const mockRates = days.reduce((acc, day) => {
  acc[day] = {
    buy: (3.75 + (Math.random() - 0.5) * 0.1).toFixed(3),
    sell: (3.78 + (Math.random() - 0.5) * 0.1).toFixed(3),
  };
  return acc;
}, {} as Record<number, { buy: string, sell: string }>);


export function ExchangeRateCalendar() {
  const [date, setDate] = React.useState(new Date(2025, 6, 1))
  const [rateType, setRateType] = React.useState<"buy" | "sell">("buy")

  const monthName = date.toLocaleString('es-PE', { month: 'long' });
  const year = date.getFullYear();

  const handlePrevMonth = () => {
    setDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  const handleNextMonth = () => {
    setDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

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
        {Array.from({ length: new Date(date.getFullYear(), date.getMonth(), 1).getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
        
        {days.map((day) => (
          <div key={day} className="p-1">
            <div className={cn(
              "flex flex-col items-center justify-center h-16 rounded-md border text-sm",
              rateType === 'buy' ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            )}>
              <div className="font-semibold">{day}</div>
              <div className={cn("text-xs", rateType === 'buy' ? "text-green-700" : "text-red-700")}>
                {mockRates[day][rateType]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
