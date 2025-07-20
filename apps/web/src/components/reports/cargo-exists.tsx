"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LogOut, Calendar, User, MapPin, Truck, FileText, Package } from "lucide-react"
import { ReportFiltersComponent } from "./report-filter"
import { ReportPreview } from "./report-preview"
import { mockCargoExits } from "@/data/reports-data"
import { generatePDFReport, generateExcelReport } from "@/utils/pdf-generator"
import type { ReportFilters as ReportFiltersType } from "./types"

export const CargoExitsReport = () => {
  const [filters, setFilters] = useState<ReportFiltersType>({
    startDate: "2024-01-16",
    endDate: "2024-01-18",
    trackingCode: "",
    status: "all",
    user: "all",
    warehouse: "all",
  })

  const filteredExits = useMemo(() => {
    return mockCargoExits.filter((exit) => {
      const exitDate = new Date(exit.exitDate)
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)

      const dateInRange = exitDate >= startDate && exitDate <= endDate
      const codeMatch =
        !filters.trackingCode || exit.trackingCode.toLowerCase().includes(filters.trackingCode.toLowerCase())
      const userMatch =
        filters.user === "all" || exit.verifiedBy === filters.user || exit.deliveryResponsible.includes(filters.user)

      return dateInRange && codeMatch && userMatch
    })
  }, [filters])

  const groupedByType = useMemo(() => {
    return filteredExits.reduce(
      (acc, item) => {
        acc[item.exitType] = (acc[item.exitType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [filteredExits])

  const summary = useMemo(
    () => ({
      totalSalidas: filteredExits.length,
      entregas: groupedByType.entrega || 0,
      transferencias: groupedByType.transferencia || 0,
      devoluciones: groupedByType.devolucion || 0,
    }),
    [filteredExits, groupedByType],
  )

  const handleResetFilters = () => {
    setFilters({
      startDate: "2024-01-16",
      endDate: "2024-01-18",
      trackingCode: "",
      status: "all",
      user: "all",
      warehouse: "all",
    })
  }

  const handleExportPDF = async () => {
    try {
      await generatePDFReport("cargo-exits-content", {
        title: "Reporte de Salidas de Carga",
        subtitle: "Lista completa de cargas que han salido del almacén",
        dateRange: `${filters.startDate} - ${filters.endDate}`,
        data: filteredExits,
        summary,
        footer: "Sistema de Gestión de Almacén",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error al generar el PDF. Por favor, intente nuevamente.")
    }
  }

  const handleExportExcel = () => {
    const excelData = filteredExits.map((exit) => ({
      "Código de Carga": exit.trackingCode,
      Descripción: exit.cargoDescription,
      "Fecha Salida": exit.exitDate,
      Receptor: exit.receiver,
      Destino: exit.destination,
      "Tipo Salida": exit.exitType,
      "Verificado Por": exit.verifiedBy,
      "Responsable Entrega": exit.deliveryResponsible,
      Transporte: exit.transportMethod,
      Notas: exit.notes || "",
    }))

    generateExcelReport(excelData, "reporte_salidas_carga")
  }

  const getExitTypeColor = (exitType: string) => {
    const colors = {
      entrega: "bg-green-100 text-green-800 border-green-200",
      transferencia: "bg-blue-100 text-blue-800 border-blue-200",
      devolucion: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[exitType as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getExitTypeIcon = (exitType: string) => {
    const icons = {
      entrega: <Package className="w-4 h-4" />,
      transferencia: <Truck className="w-4 h-4" />,
      devolucion: <LogOut className="w-4 h-4" />,
    }
    return icons[exitType as keyof typeof icons] || <Package className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <LogOut className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Reporte de Salidas de Carga</h1>
          </div>
          <p className="text-gray-600">Lista completa de cargas que han salido del almacén</p>
        </div>

        {/* Report Preview and Actions */}
        <ReportPreview
          title="Reporte de Salidas de Carga"
          data={filteredExits}
          summary={summary}
          dateRange={`${filters.startDate} - ${filters.endDate}`}
          onDownloadPDF={handleExportPDF}
          onDownloadExcel={handleExportExcel}
        >
          <div id="cargo-exits-content" className="space-y-6">
            {/* Filters */}
            <ReportFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={handleResetFilters}
              showUserFilter={true}
              title="Filtros de Salidas de Carga"
            />

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <LogOut className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Salidas</p>
                      <p className="text-2xl font-bold">{filteredExits.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Entregas</p>
                      <p className="text-2xl font-bold">{groupedByType.entrega || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transferencias</p>
                      <p className="text-2xl font-bold">{groupedByType.transferencia || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <LogOut className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Devoluciones</p>
                      <p className="text-2xl font-bold">{groupedByType.devolucion || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detalle de Salidas de Carga</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código de Carga</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Fecha Salida</TableHead>
                      <TableHead>Receptor</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Tipo Salida</TableHead>
                      <TableHead>Verificado Por</TableHead>
                      <TableHead>Responsable Entrega</TableHead>
                      <TableHead>Transporte</TableHead>
                      <TableHead>Notas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExits.map((exit) => (
                      <TableRow key={exit.id}>
                        <TableCell className="font-mono text-sm">{exit.trackingCode}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={exit.cargoDescription}>
                            {exit.cargoDescription}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(exit.exitDate).toLocaleDateString("es-ES")}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={exit.receiver}>
                            {exit.receiver}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="truncate" title={exit.destination}>
                              {exit.destination}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getExitTypeIcon(exit.exitType)}
                            <Badge className={getExitTypeColor(exit.exitType)}>{exit.exitType}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{exit.verifiedBy}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            <div className="truncate" title={exit.deliveryResponsible}>
                              {exit.deliveryResponsible}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{exit.transportMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {exit.notes && (
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">{exit.notes}</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </ReportPreview>

        {/* Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Reporte generado el{" "}
                {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-1">Sistema de Gestión de Almacén - {filteredExits.length} salidas registradas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
