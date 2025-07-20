"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, Weight } from "lucide-react"
import { formatWeight, formatNumber } from "@/utils/report"
import type { DailyReport } from "./types"

interface ReportSummaryProps {
  reports: DailyReport[]
}

export const ReportSummary = ({ reports }: ReportSummaryProps) => {
  const totalEntries = reports.reduce((sum, report) => sum + report.totals.totalEntries, 0)
  const totalExits = reports.reduce((sum, report) => sum + report.totals.totalExits, 0)
  const totalWeightIn = reports.reduce((sum, report) => sum + report.totals.totalWeightIn, 0)
  const totalWeightOut = reports.reduce((sum, report) => sum + report.totals.totalWeightOut, 0)
  const totalUnitsIn = reports.reduce((sum, report) => sum + report.totals.totalUnitsIn, 0)
  const totalUnitsOut = reports.reduce((sum, report) => sum + report.totals.totalUnitsOut, 0)

  const netMovements = totalEntries - totalExits

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Movimientos Totales</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalEntries + totalExits)}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            {formatNumber(totalEntries)} entradas
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            {formatNumber(totalExits)} salidas
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peso Total</CardTitle>
          <Weight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatWeight(totalWeightIn + totalWeightOut)}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            {formatWeight(totalWeightIn)} entrada
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            {formatWeight(totalWeightOut)} salida
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance Neto</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netMovements >= 0 ? "text-green-600" : "text-red-600"}`}>
            {netMovements >= 0 ? "+" : ""}
            {formatNumber(netMovements)}
          </div>
          <p className="text-xs text-muted-foreground">movimientos netos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unidades Totales</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalUnitsIn + totalUnitsOut)}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            {formatNumber(totalUnitsIn)} entrada
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            {formatNumber(totalUnitsOut)} salida
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
