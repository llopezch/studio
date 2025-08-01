
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
import type { PenUsdChartData } from "@/app/page"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const fullDate = data.fullDate;
    const time = fullDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const date = fullDate.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

    return (
      <div className="bg-white/90 dark:bg-black/90 p-2 rounded-md border border-border shadow-lg">
        <p className="font-bold text-foreground">1 PEN = {payload[0].value.toFixed(4)} USD</p>
        <p className="text-sm text-muted-foreground">{date} - {time}</p>
      </div>
    );
  }
  return null;
};

const getTicks = (data: PenUsdChartData[], numTicks: number = 5): string[] => {
    if (!data || data.length === 0) return [];
    const ticks: string[] = [];
    const dataLength = data.length;
    const step = dataLength > 1 ? Math.floor((dataLength -1) / (numTicks - 1)) : dataLength;
    if (step <= 0) return data.map(d => d.date);
    for (let i = 0; i < dataLength; i += step) {
        ticks.push(data[i].date);
    }
    const lastDate = data[dataLength - 1].date;
    if (!ticks.includes(lastDate)) {
        if (ticks.length >= numTicks) {
           ticks[ticks.length -1] = lastDate;
        } else {
           ticks.push(lastDate);
        }
    }
    return ticks;
};

const ChartComponent = ({ data, timeRange }: { data: PenUsdChartData[], timeRange: string }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
                No hay suficientes datos para mostrar el gráfico.
            </div>
        )
    }

    const visibleTicks = getTicks(data, 5);
    
    const yAxisDomain = React.useMemo(() => {
        if (data.length === 0) return [0, 1];
        const values = data.map(d => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * 0.1; // 10% padding
        return [min - padding, max + padding];
    }, [data]);

    return (
    <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorPenUsd" x1="0" y1="0" x2="0" y2="1">
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
                    domain={yAxisDomain}
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => typeof value === 'number' ? value.toFixed(4) : value}
                />
                <Tooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<CustomTooltip />}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorPenUsd)" activeDot={{ r: 6 }}/>
            </AreaChart>
        </ResponsiveContainer>
    </div>
)};

export function PenUsdChart({ data }: { data: PenUsdChartData[] }) {
  const now = new Date();
  
  const filterData = (days: number) => {
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);
    return data.filter(item => {
        const itemDate = new Date(item.fullDate);
        return itemDate >= pastDate;
    });
  }

  const weeklyData = filterData(7);
  const monthlyData = filterData(30);
  const sixMonthsData = filterData(180);
  const yearlyData = filterData(365);

  return (
    <Tabs defaultValue="week">
      <TabsList className="bg-transparent p-0 justify-start h-auto rounded-none border-b mb-4">
        <TabsTrigger value="week" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">Semana</TabsTrigger>
        <TabsTrigger value="month" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">Mes</TabsTrigger>
        <TabsTrigger value="6months" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">6 Meses</TabsTrigger>
        <TabsTrigger value="year" className="rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px">1 Año</TabsTrigger>
      </TabsList>
      <TabsContent value="week">
        <ChartComponent data={weeklyData} timeRange="week" />
      </TabsContent>
      <TabsContent value="month">
        <ChartComponent data={monthlyData} timeRange="month" />
      </TabsContent>
      <TabsContent value="6months">
        <ChartComponent data={sixMonthsData} timeRange="6months" />
      </TabsContent>
      <TabsContent value="year">
        <ChartComponent data={yearlyData} timeRange="year" />
      </TabsContent>
    </Tabs>
  )
}

    