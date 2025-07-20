"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import type { DailyReport } from "./types";

interface ReportChartProps {
  reports: DailyReport[]
}

export const ReportChart = ({ reports }: ReportChartProps) => {
  const maxValue = Math.max(...reports.map((r) => Math.max(r.totals.totalWeightIn, r.totals.totalWeightOut)))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Gráfico de Movimientos por Peso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.date} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {new Date(report.date).toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="text-green-600">+{report.totals.totalWeightIn.toFixed(1)}kg</span>
                  <span className="text-red-600">-{report.totals.totalWeightOut.toFixed(1)}kg</span>
                </div>
              </div>

              <div className="flex gap-1 h-6">
                {/* Entrada */}
                <div
                  className="bg-green-500 rounded-l"
                  style={{
                    width: `${(report.totals.totalWeightIn / maxValue) * 50}%`,
                    minWidth: report.totals.totalWeightIn > 0 ? "2px" : "0",
                  }}
                />
                {/* Salida */}
                <div
                  className="bg-red-500 rounded-r"
                  style={{
                    width: `${(report.totals.totalWeightOut / maxValue) * 50}%`,
                    minWidth: report.totals.totalWeightOut > 0 ? "2px" : "0",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Entradas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span>Salidas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
