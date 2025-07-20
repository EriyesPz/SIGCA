import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { formatDate, formatWeight, formatNumber } from "@/utils/report"
import type { DailyReport } from "./types"

interface DailyReportTableProps {
  reports: DailyReport[]
}

export const DailyReportTable = ({ reports }: DailyReportTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Reporte Diario Detallado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.date} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{formatDate(report.date)}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    {report.totals.totalEntries} entradas
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-red-500" />
                    {report.totals.totalExits} salidas
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Entradas */}
                <div>
                  <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Entradas ({report.entries.length} tipos)
                  </h4>
                  {report.entries.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo de Carga</TableHead>
                          <TableHead className="text-right">Cantidad</TableHead>
                          <TableHead className="text-right">Peso</TableHead>
                          <TableHead className="text-right">Unidades</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.entries.map((entry) => (
                          <TableRow key={entry.cargoType}>
                            <TableCell>
                              <Badge variant="outline">{entry.cargoType}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatNumber(entry.count)}</TableCell>
                            <TableCell className="text-right">{formatWeight(entry.totalWeight)}</TableCell>
                            <TableCell className="text-right">{formatNumber(entry.totalUnits)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-green-50">
                          <TableCell className="font-medium">Total Entradas</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatNumber(report.totals.totalEntries)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatWeight(report.totals.totalWeightIn)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatNumber(report.totals.totalUnitsIn)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-sm">No hay entradas registradas</p>
                  )}
                </div>

                {/* Salidas */}
                <div>
                  <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Salidas ({report.exits.length} tipos)
                  </h4>
                  {report.exits.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo de Carga</TableHead>
                          <TableHead className="text-right">Cantidad</TableHead>
                          <TableHead className="text-right">Peso</TableHead>
                          <TableHead className="text-right">Unidades</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.exits.map((exit) => (
                          <TableRow key={exit.cargoType}>
                            <TableCell>
                              <Badge variant="outline">{exit.cargoType}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatNumber(exit.count)}</TableCell>
                            <TableCell className="text-right">{formatWeight(exit.totalWeight)}</TableCell>
                            <TableCell className="text-right">{formatNumber(exit.totalUnits)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-red-50">
                          <TableCell className="font-medium">Total Salidas</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatNumber(report.totals.totalExits)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatWeight(report.totals.totalWeightOut)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatNumber(report.totals.totalUnitsOut)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-sm">No hay salidas registradas</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
