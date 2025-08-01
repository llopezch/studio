
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { HistoricalRateChartData } from "@/app/page"

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-black/90 p-2 rounded-md border border-border shadow-lg">
        <p className="font-bold text-foreground">1 PEN = {payload[0].value.toFixed(4)} USD</p>
        <p className="text-sm text-muted-foreground">{payload[0].payload.fullDateStr}</p>
      </div>
    )
  }
  return null
}

// Chart Component that handles rendering logic
const ChartComponent = ({ data }: { data: HistoricalRateChartData[] }) => {
  if (!data || data.length < 2) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
        No hay suficientes datos para mostrar el gráfico.
      </div>
    )
  }

  // Dynamically calculate Y-axis domain based on the visible data
  const yValues = data.map(item => item.value)
  const yMin = Math.min(...yValues)
  const yMax = Math.max(...yValues)
  const yPadding = (yMax - yMin) * 0.1 || 0.0001
  const yDomain: [number, number] = [yMin - yPadding, yMax + yPadding]

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPenUsd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval="equidistantPreserveStart"
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            domain={yDomain}
            axisLine={false}
            tickLine={false}
            tickCount={6}
            tickFormatter={(value) => typeof value === 'number' ? value.toFixed(3) : ""}
          />
          <Tooltip
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
            content={<CustomTooltip />}
          />
          <Area type="linear" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorPenUsd)" activeDot={{ r: 6 }} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Main component with Tabs for filtering data
export function HistoricalRateChart({ data }: { data: HistoricalRateChartData[] }) {
  const [timeRange, setTimeRange] = React.useState('week')

  const filteredData = React.useMemo(() => {
    const now = new Date()
    let daysToFilter: number;
    switch (timeRange) {
        case 'month':
            daysToFilter = 30;
            break;
        case '6months':
            daysToFilter = 180;
            break;
        case 'year':
            daysToFilter = 365;
            break;
        case 'week':
        default:
            daysToFilter = 7;
            break;
    }

    const pastDate = new Date();
    pastDate.setDate(now.getDate() - daysToFilter);

    return data.filter(item => {
        const itemDate = new Date(item.fullDate);
        return itemDate >= pastDate && itemDate <= now;
    });
  }, [data, timeRange])

  return (
    <Tabs value={timeRange} onValueChange={setTimeRange}>
      <TabsList className="bg-transparent p-0 justify-start h-auto rounded-none border-b mb-4">
        <TabsTrigger value="week" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">Semana</TabsTrigger>
        <TabsTrigger value="month" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">Mes</TabsTrigger>
        <TabsTrigger value="6months" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">6 Meses</TabsTrigger>
        <TabsTrigger value="year" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">1 Año</TabsTrigger>
      </TabsList>
      <TabsContent value={timeRange} forceMount>
         <ChartComponent data={filteredData} />
      </TabsContent>
    </Tabs>
  )
}
