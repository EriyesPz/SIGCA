"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RotateCcw, Calendar, User, FileText, AlertTriangle, RefreshCw } from "lucide-react"
import { ReportFiltersComponent } from "./report-filter"
import { ReportPreview } from "./report-preview"
import { mockCargoReturns } from "@/data/reports-data"
import { generatePDFReport, generateExcelReport } from "@/utils/pdf-generator"
import type { CargoEntryFilters as ReportFiltersType } from "./types"

export const CargoReturnsReport = () => {
  const [filters, setFilters] = useState<ReportFiltersType>({
    startDate: "2024-01-16",
    endDate: "2024-01-18",
    trackingCode: "",
    status: "all",
    user: "all",
    warehouse: "all",
    cargoType: "all",
  })

  const filteredReturns = useMemo(() => {
    return mockCargoReturns.filter((returnItem) => {
      const changeDate = new Date(returnItem.changeDate)
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)

      const dateInRange = changeDate >= startDate && changeDate <= endDate
      const codeMatch =
        !filters.trackingCode || returnItem.trackingCode.toLowerCase().includes(filters.trackingCode.toLowerCase())
      const userMatch = filters.user === "all" || returnItem.performedBy === filters.user

      return dateInRange && codeMatch && userMatch
    })
  }, [filters])

  const groupedByType = useMemo(() => {
    return filteredReturns.reduce(
      (acc, item) => {
        acc[item.changeType] = (acc[item.changeType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [filteredReturns])

  const summary = useMemo(
    () => ({
      totalCasos: filteredReturns.length,
      devoluciones: groupedByType.devolucion || 0,
      reingresos: groupedByType.reingreso || 0,
      rechazos: groupedByType.rechazo || 0,
    }),
    [filteredReturns, groupedByType],
  )

  const handleResetFilters = () => {
    setFilters({
      startDate: "2024-01-16",
      endDate: "2024-01-18",
      trackingCode: "",
      status: "all",
      user: "all",
      warehouse: "all",
      cargoType: "all",
    })
  }

  const handleExportPDF = async () => {
    try {
      await generatePDFReport("cargo-returns-content", {
        title: "Reporte de Cargas Devueltas/Reingresadas",
        subtitle: "Casos de cargas rechazadas, devueltas o reingresadas al sistema",
        dateRange: `${filters.startDate} - ${filters.endDate}`,
        data: filteredReturns,
        summary,
        footer: "Sistema de Gestión de Almacén",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error al generar el PDF. Por favor, intente nuevamente.")
    }
  }

  const handleExportExcel = () => {
    const excelData = filteredReturns.map((returnItem) => ({
      "Código de Carga": returnItem.trackingCode,
      Descripción: returnItem.cargoDescription,
      "Estado Anterior": returnItem.previousStatus,
      "Nuevo Estado": returnItem.newStatus,
      "Tipo de Cambio": returnItem.changeType,
      "Fecha Cambio": returnItem.changeDate,
      "Realizado Por": returnItem.performedBy,
      Motivo: returnItem.reason,
      Notas: returnItem.notes || "",
    }))

    generateExcelReport(excelData, "reporte_cargas_devueltas")
  }

  const getChangeTypeColor = (changeType: string) => {
    const colors = {
      devolucion: "bg-red-100 text-red-800 border-red-200",
      reingreso: "bg-blue-100 text-blue-800 border-blue-200",
      rechazo: "bg-orange-100 text-orange-800 border-orange-200",
      correccion: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return colors[changeType as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getChangeTypeIcon = (changeType: string) => {
    const icons = {
      devolucion: <RotateCcw className="w-4 h-4" />,
      reingreso: <RefreshCw className="w-4 h-4" />,
      rechazo: <AlertTriangle className="w-4 h-4" />,
      correccion: <FileText className="w-4 h-4" />,
    }
    return icons[changeType as keyof typeof icons] || <FileText className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <RotateCcw className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reporte de Cargas Devueltas/Reingresadas</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Casos de cargas rechazadas, devueltas o reingresadas al sistema</p>
        </div>

        {/* Report Preview and Actions */}
        <ReportPreview
          title="Reporte de Cargas Devueltas/Reingresadas"
          data={filteredReturns}
          summary={summary}
          dateRange={`${filters.startDate} - ${filters.endDate}`}
          onDownloadPDF={handleExportPDF}
          onDownloadExcel={handleExportExcel}
        >
          <div id="cargo-returns-content" className="space-y-6">
            {/* Filters */}
            <ReportFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={handleResetFilters}
              showUserFilter={true}
              title="Filtros de Cargas Devueltas"
            />

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <RotateCcw className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Casos</p>
                      <p className="text-2xl font-bold">{filteredReturns.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Devoluciones</p>
                      <p className="text-2xl font-bold">{groupedByType.devolucion || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <RefreshCw className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reingresos</p>
                      <p className="text-2xl font-bold">{groupedByType.reingreso || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <FileText className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rechazos</p>
                      <p className="text-2xl font-bold">{groupedByType.rechazo || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detalle de Cargas Devueltas/Reingresadas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código de Carga</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado Anterior</TableHead>
                      <TableHead>Nuevo Estado</TableHead>
                      <TableHead>Tipo de Cambio</TableHead>
                      <TableHead>Fecha Cambio</TableHead>
                      <TableHead>Realizado Por</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Notas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell className="font-mono text-sm">{returnItem.trackingCode}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={returnItem.cargoDescription}>
                            {returnItem.cargoDescription}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {returnItem.previousStatus.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {returnItem.newStatus.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getChangeTypeIcon(returnItem.changeType)}
                            <Badge className={getChangeTypeColor(returnItem.changeType)}>{returnItem.changeType}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(returnItem.changeDate).toLocaleDateString("es-ES")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{returnItem.performedBy}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={returnItem.reason}>
                            {returnItem.reason}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {returnItem.notes && (
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">{returnItem.notes}</span>
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
              <p className="mt-1">Sistema de Gestión de Almacén - {filteredReturns.length} casos registrados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
