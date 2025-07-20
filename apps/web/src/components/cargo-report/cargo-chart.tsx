"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import {
  formatShortDate,
  getTypeColor,
  getTypeIcon,
  getTypeLabel,          // 🆕 etiquetas visibles en ES
} from "@/utils/cargo-report"
import type { DailyCargoSummary } from "./types"

interface CargoChartProps {
  reports: DailyCargoSummary[]
}

export const CargoChart = ({ reports }: CargoChartProps) => {
  /* Extrae las clases bg-* y dark:bg-* del string devuelto por getTypeColor */
  const pickBgClasses = (color: string) => {
    const parts = color.split(" ")
    const light = parts.find((c) => c.startsWith("bg-")) ?? ""
    const dark = parts.find((c) => c.startsWith("dark:bg-")) ?? ""
    return `${light} ${dark}`
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Distribución Diaria por Tipo de Carga
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.date} className="space-y-2">
              {/* Encabezado del día */}
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                  {formatShortDate(report.date)}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {report.totals.totalWeight.toFixed(1)} kg total
                </span>
              </div>

              {/* Barra apilada */}
              <div className="relative">
                <div className="flex h-8 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                  {report.summary.map((t) => {
                    const pct = (t.totalWeight / report.totals.totalWeight) * 100
                    const barColor = pickBgClasses(getTypeColor(t.type))

                    return (
                      <div
                        key={t.type}
                        className={`${barColor} group relative flex cursor-pointer items-center justify-center text-xs font-medium text-white transition-opacity`}
                        style={{ width: `${pct}%` }}
                        title={`${getTypeLabel(t.type)}: ${t.totalWeight.toFixed(
                          1,
                        )} kg (${t.count} cargas)`}
                      >
                        {/* Conteo visible solo si hay espacio */}
                        {pct > 15 && (
                          <span className="flex items-center gap-1">
                            {getTypeIcon(t.type)}
                            {t.count}
                          </span>
                        )}

                        {/* Tooltip artesanal */}
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-900">
                          {getTypeLabel(t.type)}: {t.totalWeight.toFixed(1)} kg ({t.count} cargas)
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sin datos */}
        {reports.length === 0 && (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">
            No hay datos disponibles para el rango de fechas seleccionado
          </p>
        )}

        {/* Leyenda */}
        <div className="mt-6 border-t pt-4">
          <div className="flex flex-wrap justify-center gap-4">
            {(["IN", "OUT", "DAMAGED", "RETURNED"] as const).map((t) => {
              const color = pickBgClasses(getTypeColor(t))
              return (
                <div key={t} className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded ${color}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {getTypeIcon(t)} {getTypeLabel(t)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
