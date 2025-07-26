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

const ChartComponent = ({ data }: { data: any[] }) => (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} domain={['dataMin - 0.02', 'dataMax + 0.02']} />
                <Tooltip
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2, strokeDasharray: '3 3' }}
                    content={<CustomTooltip />}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 8 }}/>
            </AreaChart>
        </ResponsiveContainer>
    </div>
);


export function ExchangeRateChart() {
  return (
    <Tabs defaultValue="week">
      <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
        <TabsTrigger value="week">Última Semana</TabsTrigger>
        <TabsTrigger value="month">Último Mes</TabsTrigger>
      </TabsList>
      <TabsContent value="week">
        <ChartComponent data={weeklyData} />
      </TabsContent>
      <TabsContent value="month">
        <ChartComponent data={monthlyData} />
      </TabsContent>
    </Tabs>
  )
}
