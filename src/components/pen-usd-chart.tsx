
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

const getTicks = (data: PenUsdChartData[], timeRange: 'week' | 'month' | '6months' | 'year'): string[] => {
    if (!data || data.length < 2) return [];

    let numTicks: number;

    switch (timeRange) {
        case 'week':
            // For weekly view, show all days if not too many
            return data.map(d => d.date);
        case 'month':
            numTicks = 5; // Approx 1 tick per week
            break;
        case '6months':
            numTicks = 6; // 1 tick per month
            break;
        case 'year':
            numTicks = 7; // Approx 1 tick every 2 months
            break;
        default:
            numTicks = 5;
    }

    const ticks: string[] = [];
    // Ensure we don't divide by zero if data length is less than numTicks
    const step = Math.max(1, Math.floor((data.length - 1) / (numTicks - 1)));

    for (let i = 0; i < data.length; i += step) {
        if(data[i]) {
            ticks.push(data[i].date);
        }
    }
    
    // Always include the last data point's date for completeness.
    const lastDate = data[data.length - 1].date;
    if (ticks.length > 0 && ticks[ticks.length - 1] !== lastDate) {
        if (ticks.length >= numTicks) {
            ticks[ticks.length - 1] = lastDate;
        } else {
            ticks.push(lastDate);
        }
    } else if (ticks.length === 0 && data.length > 0) {
        ticks.push(lastDate);
    }
    
    return ticks;
};

const ChartComponent = ({ data, timeRange }: { data: PenUsdChartData[], timeRange: 'week' | 'month' | '6months' | 'year' }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
                No hay suficientes datos para mostrar el gráfico.
            </div>
        )
    }

    const visibleTicks = getTicks(data, timeRange);

    const chartColor = "hsl(var(--chart-2))";

    return (
    <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorPenUsd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
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
                    domain={['dataMin - 0.001', 'dataMax + 0.001']} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => typeof value === 'number' ? value.toFixed(4) : value}
                />
                <Tooltip
                    cursor={{ stroke: chartColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<CustomTooltip />}
                />
                <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fillOpacity={1} fill="url(#colorPenUsd)" activeDot={{ r: 6 }}/>
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
