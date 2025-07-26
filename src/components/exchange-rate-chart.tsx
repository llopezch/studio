"use client"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const weeklyData = [
  { date: "19 Jul", value: 3.715 },
  { date: "20 Jul", value: 3.705 },
  { date: "21 Jul", value: 3.710 },
  { date: "22 Jul", value: 3.690 },
  { date: "23 Jul", value: 3.725 },
  { date: "24 Jul", value: 3.740 },
  { date: "25 Jul", value: 3.765 },
];

const monthlyData = [
    { date: 'Sem 1', value: 3.72 },
    { date: 'Sem 2', value: 3.75 },
    { date: 'Sem 3', value: 3.71 },
    { date: 'Sem 4', value: 3.78 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-black/90 p-2 rounded-md border border-border shadow-lg">
        <p className="font-bold text-foreground">{payload[0].value.toFixed(4)}</p>
        <p className="text-sm text-muted-foreground">{label}, 1:30 UTC</p>
      </div>
    );
  }

  return null;
};

export function ExchangeRateChart() {
  return (
    <Tabs defaultValue="week">
      <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
        <TabsTrigger value="week">Última Semana</TabsTrigger>
        <TabsTrigger value="month">Último Mes</TabsTrigger>
      </TabsList>
      <TabsContent value="week">
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                 <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" hide={true} />
                <YAxis hide={true} domain={['dataMin - 0.02', 'dataMax + 0.02']} />
                <Tooltip
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<CustomTooltip />}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6 }}/>
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="month">
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorValueMonth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" hide={true}/>
                <YAxis hide={true} domain={['dataMin - 0.02', 'dataMax + 0.02']}/>
                 <Tooltip
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<CustomTooltip />}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValueMonth)" activeDot={{ r: 6 }}/>
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
