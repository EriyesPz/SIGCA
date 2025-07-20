"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, ChevronDown, ChevronRight, Package, Truck, MapPin, Clock } from "lucide-react"
import { formatWeight, formatNumber, getTypeColor, getTypeIcon } from "@/utils/cargo-report"
import type { DailyCargoSummary } from "./types"

interface DetailedTableProps {
  reports: DailyCargoSummary[]
}

export const DetailedTable = ({ reports }: DetailedTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRowExpansion = (key: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedRows(newExpanded)
  }

  // Flatten all type summaries with their dates for the table
  const tableData = reports.flatMap((report) =>
    report.summary.map((typeSummary) => ({
      date: report.date,
      type: typeSummary.type,
      count: typeSummary.count,
      totalWeight: typeSummary.totalWeight,
      totalUnits: typeSummary.totalUnits,
      items: typeSummary.items,
      key: `${report.date}-${typeSummary.type}`,
    })),
  )

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Tabla Detallada por Día y Tipo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold w-12"></TableHead>
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold">Tipo de Carga</TableHead>
                <TableHead className="text-right font-semibold">Número Total de Cargas</TableHead>
                <TableHead className="text-right font-semibold">Peso Total (Kg)</TableHead>
                <TableHead className="text-right font-semibold">Unidades Totales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => {
                const isExpanded = expandedRows.has(row.key)
                return (
                  <>
                    <TableRow
                      key={row.key}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-blue-50/50 cursor-pointer`}
                      onClick={() => toggleRowExpansion(row.key)}
                    >
                      <TableCell>
                        <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(row.date).toLocaleDateString("es-ES", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeColor(row.type)} font-medium`}>
                          {getTypeIcon(row.type)} {row.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatNumber(row.count)}</TableCell>
                      <TableCell className="text-right">{formatWeight(row.totalWeight)}</TableCell>
                      <TableCell className="text-right">{formatNumber(row.totalUnits)}</TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={6} className="p-0">
                          <div className="bg-gray-50/30 p-4 border-l-4 border-blue-200">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Detalle de Cargas - {row.type} ({row.items.length} elementos)
                            </h4>
                            <div className="grid gap-3">
                              {row.items.map((item) => (
                                <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Package className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium text-gray-700">Código de Seguimiento</span>
                                      </div>
                                      <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                        {item.trackingCode}
                                      </p>
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Truck className="w-4 h-4 text-green-600" />
                                        <span className="font-medium text-gray-700">Descripción</span>
                                      </div>
                                      <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-purple-600" />
                                        <span className="font-medium text-gray-700">Almacén</span>
                                      </div>
                                      <p className="text-sm text-gray-600">{item.warehouse}</p>
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-orange-600" />
                                        <span className="font-medium text-gray-700">Hora</span>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        {new Date(item.createdAt).toLocaleTimeString("es-ES", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                      <div className="flex gap-4">
                                        <span className="text-sm">
                                          <strong>Categoría:</strong> {item.cargoCategory}
                                        </span>
                                        <span className="text-sm">
                                          <strong>Peso:</strong> {formatWeight(item.weightKg)}
                                        </span>
                                        <span className="text-sm">
                                          <strong>Cantidad:</strong> {formatNumber(item.quantity)} unidades
                                        </span>
                                      </div>
                                      <Badge className={`${getTypeColor(item.type)} text-xs`}>
                                        {getTypeIcon(item.type)} {item.type}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {tableData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay datos disponibles para el rango de fechas seleccionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
