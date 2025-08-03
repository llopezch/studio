
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
    return (
      <div className="bg-white/90 dark:bg-black/90 p-2 rounded-md border border-border shadow-lg">
        <p className="font-bold text-foreground">1 PEN = {payload[0].value.toFixed(4)} USD</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    );
  }
  return null;
};

const getTicks = (data: PenUsdChartData[], numTicks: number = 6): string[] => {
    if (!data || data.length < 2) return [];

    const ticks: string[] = [];
    const step = Math.ceil(data.length / numTicks);

    for (let i = 0; i < data.length; i += step) {
        if(data[i]) {
            ticks.push(data[i].date);
        }
    }
    
    // Always include the last data point's date for completeness.
    const lastDate = data[data.length - 1].date;
    if (!ticks.includes(lastDate)) {
        ticks.push(lastDate);
    }
    
    return ticks;
};

const ChartComponent = ({ data, isYearly = false }: { data: PenUsdChartData[], isYearly?: boolean }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
                No hay suficientes datos para mostrar el gráfico.
            </div>
        )
    }

    const visibleTicks = isYearly ? getTicks(data, 6) : undefined;

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
                    interval={isYearly ? 'preserveStartEnd' : undefined}
                />
                <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontSize: 12 }} 
                    domain={['dataMin - 0.001', 'dataMax + 0.001']} 
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
    <Tabs defaultValue="year">
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
        <ChartComponent data={yearlyData} isYearly={true} />
      </TabsContent>
    </Tabs>
  )
}
