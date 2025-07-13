"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Bar,
  BarChart,
  Area,
  AreaChart,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DailyActivity } from "./types"

interface ActivityChartProps {
  data: DailyActivity[]
}

export const ActivityChart = ({ data }: ActivityChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
    profit: item.revenue - item.costs,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Actividad</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="operations">Operaciones</TabsTrigger>
            <TabsTrigger value="financial">Financiero</TabsTrigger>
            <TabsTrigger value="efficiency">Eficiencia</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-4">
            <ChartContainer
              config={{
                entries: {
                  label: "Ingresos",
                  color: "hsl(var(--chart-1))",
                },
                exits: {
                  label: "Salidas",
                  color: "hsl(var(--chart-2))",
                },
                transfers: {
                  label: "Traslados",
                  color: "hsl(var(--chart-3))",
                },
                returns: {
                  label: "Devoluciones",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="entries"
                    stroke="var(--color-entries)"
                    strokeWidth={2}
                    name="Ingresos"
                  />
                  <Line type="monotone" dataKey="exits" stroke="var(--color-exits)" strokeWidth={2} name="Salidas" />
                  <Line
                    type="monotone"
                    dataKey="transfers"
                    stroke="var(--color-transfers)"
                    strokeWidth={2}
                    name="Traslados"
                  />
                  <Line
                    type="monotone"
                    dataKey="returns"
                    stroke="var(--color-returns)"
                    strokeWidth={2}
                    name="Devoluciones"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <ChartContainer
              config={{
                revenue: {
                  label: "Ingresos",
                  color: "hsl(var(--chart-1))",
                },
                costs: {
                  label: "Costos",
                  color: "hsl(var(--chart-2))",
                },
                profit: {
                  label: "Beneficio",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" name="Ingresos" />
                  <Bar dataKey="costs" fill="var(--color-costs)" name="Costos" />
                  <Bar dataKey="profit" fill="var(--color-profit)" name="Beneficio" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-4">
            <ChartContainer
              config={{
                efficiency: {
                  label: "Eficiencia",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[80, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="efficiency"
                    stroke="var(--color-efficiency)"
                    fill="var(--color-efficiency)"
                    fillOpacity={0.3}
                    name="Eficiencia (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
