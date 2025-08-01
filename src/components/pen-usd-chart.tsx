
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-black/90 p-2 rounded-md border border-border shadow-lg">
        <p className="font-bold text-foreground">1 PEN = {payload[0].value.toFixed(4)} USD</p>
        <p className="text-sm text-muted-foreground">{payload[0].payload.fullDateStr}</p>
      </div>
    );
  }
  return null;
};

// Helper function to get unique, spaced-out ticks for the X-axis
const getUniqueXTicks = (data: PenUsdChartData[], numTicks: number = 5): PenUsdChartData[] => {
    if (!data || data.length === 0) return [];
    
    const uniqueDateMap = new Map<string, PenUsdChartData>();
    data.forEach(d => {
        if (!uniqueDateMap.has(d.date)) {
            uniqueDateMap.set(d.date, d);
        }
    });
    const uniqueDates = Array.from(uniqueDateMap.values());
    const dataLength = uniqueDates.length;

    if (dataLength <= numTicks) {
        return uniqueDates;
    }

    const ticks: PenUsdChartData[] = [];
    const step = Math.max(1, Math.floor((dataLength - 1) / (numTicks - 1)));
    
    for (let i = 0; i < dataLength; i += step) {
        ticks.push(uniqueDates[i]);
    }

    const lastDate = uniqueDates[dataLength - 1];
    if (ticks[ticks.length - 1]?.date !== lastDate.date) {
        if (ticks.length >= numTicks) {
           ticks[ticks.length -1] = lastDate;
        } else {
           ticks.push(lastDate);
        }
    }
    
    return ticks;
};

const ChartComponent = ({ data }: { data: PenUsdChartData[] }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
                No hay suficientes datos para mostrar el gráfico.
            </div>
        )
    }

    const xTicks = getUniqueXTicks(data, 5);

    // Calculate Y-axis domain dynamically based on the provided data
    const yValues = data.map(item => item.value);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const yPadding = (yMax - yMin) * 0.1 || 0.001; 
    
    const yDomain: [number, number] = [yMin - yPadding, yMax + yPadding];

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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false}
                    ticks={xTicks.map(t => t.date)}
                    interval="preserveStartEnd"
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
                <Area type="linear" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorPenUsd)" activeDot={{ r: 6 }} dot={false}/>
            </AreaChart>
        </ResponsiveContainer>
    </div>
)};

export function PenUsdChart({ data }: { data: PenUsdChartData[] }) {
  const now = new Date();
  
  const filterData = (days: number) => {
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);
    return data.filter(item => item.fullDate >= pastDate);
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
        <ChartComponent data={weeklyData} />
      </TabsContent>
      <TabsContent value="month">
        <ChartComponent data={monthlyData} />
      </TabsContent>
      <TabsContent value="6months">
        <ChartComponent data={sixMonthsData} />
      </TabsContent>
      <TabsContent value="year">
        <ChartComponent data={yearlyData} />
      </TabsContent>
    </Tabs>
  )
}
