
"use client"

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as React from "react"

interface ChartData {
  date: string;
  value: number;
  fullDate: Date;
}

interface ExchangeRateChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-black/90 p-2 rounded-md border border-border shadow-lg">
        <p className="font-bold text-foreground">{payload[0].value.toFixed(3)}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    );
  }

  return null;
};

// Helper function to get optimized ticks for the chart
const getTicks = (data: ChartData[], numTicks: number = 5): string[] => {
    if (!data || data.length === 0) {
        return [];
    }
    const ticks: string[] = [];
    const dataLength = data.length;
    // Calculate the step, ensuring we don't divide by zero
    const step = dataLength > 1 ? Math.floor((dataLength -1) / (numTicks - 1)) : dataLength;

    if (step <= 0) {
      return data.map(d => d.date);
    }
    
    for (let i = 0; i < dataLength; i += step) {
        ticks.push(data[i].date);
    }

    // Ensure the last tick is always included if it wasn't already
    const lastDate = data[dataLength - 1].date;
    if (!ticks.includes(lastDate)) {
        // Replace the second to last tick with the last one to avoid clutter
        if (ticks.length >= numTicks) {
           ticks[ticks.length -1] = lastDate;
        } else {
           ticks.push(lastDate);
        }
    }
    
    return ticks;
};


const ChartComponent = ({ data, timeRange }: { data: any[], timeRange: 'week' | 'month' }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
                No hay suficientes datos para mostrar el gráfico.
            </div>
        )
    }

    const visibleTicks = getTicks(data, timeRange === 'month' ? 5 : 4);

    return (
    <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false}
                    ticks={visibleTicks}
                    interval="preserveStartEnd"
                />
                <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontSize: 12 }} 
                    domain={['dataMin - 0.01', 'dataMax + 0.01']} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => typeof value === 'number' ? value.toFixed(3) : value}
                />
                <Tooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<CustomTooltip />}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6 }}/>
            </AreaChart>
        </ResponsiveContainer>
    </div>
)};


export function ExchangeRateChart({ data }: ExchangeRateChartProps) {
  const now = new Date();
  
  const weeklyData = data.filter(item => {
    const itemDate = item.fullDate;
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    return itemDate >= sevenDaysAgo && itemDate <= now;
  });

  const monthlyData = data.filter(item => {
    const itemDate = item.fullDate;
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    return itemDate >= thirtyDaysAgo && itemDate <= now;
  });

  return (
    <Tabs defaultValue="week">
      <TabsList className="bg-transparent p-0 justify-start h-auto rounded-none border-b">
        <TabsTrigger value="week" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">Última Semana</TabsTrigger>
        <TabsTrigger value="month" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">Último Mes</TabsTrigger>
      </TabsList>
      <TabsContent value="week">
        <ChartComponent data={weeklyData} timeRange="week" />
      </TabsContent>
      <TabsContent value="month">
        <ChartComponent data={monthlyData} timeRange="month" />
      </TabsContent>
    </Tabs>
  )
}
