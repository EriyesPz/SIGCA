import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { formatShortDate, getTypeColor, getTypeIcon } from "@/utils/cargo-report";
import type { DailyCargoSummary } from "./types"

interface CargoChartProps {
  reports: DailyCargoSummary[]
}

export const CargoChart = ({ reports }: CargoChartProps) => {
  const maxWeight = Math.max(...reports.map((r) => r.totals.totalWeight))

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Distribución Diaria por Tipo de Carga
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.date} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">{formatShortDate(report.date)}</h4>
                <span className="text-sm text-gray-500">{report.totals.totalWeight.toFixed(1)} kg total</span>
              </div>

              <div className="relative">
                <div className="flex h-8 bg-gray-100 rounded-lg overflow-hidden">
                  {report.summary.map((typeSummary) => {
                    const percentage = (typeSummary.totalWeight / report.totals.totalWeight) * 100
                    const typeColorClass = getTypeColor(typeSummary.type)

                    return (
                      <div
                        key={typeSummary.type}
                        className={`${typeColorClass.split(" ")[1]} flex items-center justify-center text-xs font-medium text-white relative group cursor-pointer`}
                        style={{ width: `${percentage}%` }}
                        title={`${typeSummary.type}: ${typeSummary.totalWeight.toFixed(1)} kg (${typeSummary.count} cargas)`}
                      >
                        {percentage > 15 && (
                          <span className="flex items-center gap-1">
                            {getTypeIcon(typeSummary.type)}
                            {typeSummary.count}
                          </span>
                        )}

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {typeSummary.type}: {typeSummary.totalWeight.toFixed(1)} kg ({typeSummary.count} cargas)
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay datos disponibles para el rango de fechas seleccionado</p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex flex-wrap gap-4 justify-center">
            {["IN", "OUT", "DAMAGED", "RETURNED"].map((type) => {
              const typeColorClass = getTypeColor(type as any)
              return (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${typeColorClass.split(" ")[1]}`} />
                  <span className="text-sm text-gray-600">
                    {getTypeIcon(type as any)} {type}
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
