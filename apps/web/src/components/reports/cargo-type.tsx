"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { DateFilters } from "@/components/cargo-report/date-filters"
import { SummaryCards } from "@/components/cargo-report/summary-card"
import { CargoChart } from "@/components/cargo-report/cargo-chart"
import { DetailedTable } from "@/components/cargo-report/detailed-table"
import { ReportPreview } from "@/components/reports/report-preview"
import { mockCargoData } from "@/data/cargo-report";
import { generateDailyCargoReports, calculateOverallSummary } from "@/utils/cargo-report";
import { generatePDFReport, generateExcelReport } from "@/utils/pdf-generator"
import type { ReportFilters } from "@/components/cargo-report/types"

export const CargoTypeReport = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "2024-01-15",
    endDate: "2024-01-19",
  })

  const filteredMovements = useMemo(() => {
    return mockCargoData.filter((movement) => {
      const movementDate = new Date(movement.date)
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)

      return movementDate >= startDate && movementDate <= endDate
    })
  }, [filters])

  const dailyReports = useMemo(() => {
    return generateDailyCargoReports(filteredMovements)
  }, [filteredMovements])

  const overallSummary = useMemo(() => {
    return calculateOverallSummary(dailyReports)
  }, [dailyReports])

  const handleResetFilters = () => {
    setFilters({
      startDate: "2024-01-15",
      endDate: "2024-01-19",
    })
  }

  const handleExportPDF = async () => {
    try {
      await generatePDFReport("cargo-report-content", {
        title: "Reporte diario – Carga por tipo",
        subtitle: "Análisis detallado de movimientos de carga clasificados por tipo de operación",
        dateRange: `${filters.startDate} - ${filters.endDate}`,
        data: filteredMovements,
        summary: overallSummary,
        footer: "Sistema de Gestión de Almacén",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error al generar el PDF. Por favor, intente nuevamente.")
    }
  }

  const handleExportExcel = () => {
    const excelData = filteredMovements.map((movement) => ({
      "Código de Seguimiento": movement.trackingCode,
      Fecha: movement.date,
      Tipo: movement.type,
      Categoría: movement.cargoCategory,
      Descripción: movement.description,
      "Peso (kg)": movement.weightKg,
      Cantidad: movement.quantity,
      Almacén: movement.warehouse,
      "Fecha Creación": movement.createdAt,
    }))

    generateExcelReport(excelData, "reporte_carga_por_tipo")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Reporte diario – Carga por tipo</h1>
          </div>
          <p className="text-gray-600">Análisis detallado de movimientos de carga clasificados por tipo de operación</p>
        </div>

        {/* Report Preview and Actions */}
        <ReportPreview
          title="Reporte diario – Carga por tipo"
          data={filteredMovements}
          summary={overallSummary}
          dateRange={`${filters.startDate} - ${filters.endDate}`}
          onDownloadPDF={handleExportPDF}
          onDownloadExcel={handleExportExcel}
        >
          {/* Report Content */}
          <div id="cargo-report-content" className="space-y-6">
            {/* Date Filters */}
            <DateFilters filters={filters} onFiltersChange={setFilters} onResetFilters={handleResetFilters} />

            {/* Summary Cards */}
            <SummaryCards summary={overallSummary} />

            {/* Chart */}
            <CargoChart reports={dailyReports} />

            {/* Detailed Table */}
            <DetailedTable reports={dailyReports} />
          </div>
        </ReportPreview>

        {/* Footer */}
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>
                <strong>Reporte generado el:</strong>{" "}
                {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Período analizado:</strong> {new Date(filters.startDate).toLocaleDateString("es-ES")} -{" "}
                {new Date(filters.endDate).toLocaleDateString("es-ES")}
              </p>
              <p>
                <strong>Total de movimientos procesados:</strong> {filteredMovements.length} |{" "}
                <strong>Días con actividad:</strong> {dailyReports.length}
              </p>
              <p className="text-xs mt-2 pt-2 border-t">Sistema de Gestión de Almacén - Supervisor de Almacén</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
