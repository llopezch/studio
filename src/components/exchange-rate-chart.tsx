"use client"

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const weeklyData = [
  { date: "19 Jul", value: 4.41 },
  { date: "20 Jul", value: 6.22 },
  { date: "21 Jul", value: 3.50 },
  { date: "22 Jul", value: 2.80 },
  { date: "23 Jul", value: 4.90 },
  { date: "24 Jul", value: -0.59 },
  { date: "25 Jul", value: 5.20 },
];

const monthlyData = [
    { date: 'Sem 1', value: 3.72 },
    { date: 'Sem 2', value: 3.75 },
    { date: 'Sem 3', value: 3.71 },
    { date: 'Sem 4', value: 3.78 },
];


export function ExchangeRateChart() {
  return (
    <Tabs defaultValue="week">
      <TabsList className="grid w-full grid-cols-2  md:w-[200px]">
        <TabsTrigger value="week">Última Semana</TabsTrigger>
        <TabsTrigger value="month">Último Mes</TabsTrigger>
      </TabsList>
      <TabsContent value="week">
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 3 }}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))'
                    }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 8 }}/>
            </LineChart>
            </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="month">
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                 <Tooltip
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 3 }}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))'
                    }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 8 }}/>
            </LineChart>
            </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
