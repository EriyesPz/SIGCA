import { useMemo, useState } from "react"
import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ReportPreview } from "@/components/reports/report-preview"
import { DateFilters } from "@/components/cargo-report/date-filters"
import { SummaryCards } from "@/components/cargo-report/summary-card"
import { CargoChart } from "@/components/cargo-report/cargo-chart"
import { DetailedTable } from "@/components/cargo-report/detailed-table"

import { mockCargoData } from "@/data/cargo-report"
import {
  generateDailyCargoReports,
  calculateOverallSummary,
} from "@/utils/cargo-report"
import { generateExcelReport, generatePDFReport } from "@/utils/pdf-generator"

import type { ReportFilters } from "@/components/cargo-report/types"

/* ---------- componente ---------- */
export const CargoTypeReport = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "2024-01-15",
    endDate: "2024-01-19",
  })

  /* ---------- datos filtrados ---------- */
  const movements = useMemo(() => {
    return mockCargoData.filter((m) => {
      const d = new Date(m.date)
      return d >= new Date(filters.startDate) && d <= new Date(filters.endDate)
    })
  }, [filters])

  const dailyReports = useMemo(
    () => generateDailyCargoReports(movements),
    [movements],
  )

  const overall = useMemo(
    () => calculateOverallSummary(dailyReports),
    [dailyReports],
  )

  /* ---------- handlers ---------- */
  const resetFilters = () =>
    setFilters({
      startDate: "2024-01-15",
      endDate: "2024-01-19",
    })

  const exportPDF = () =>
    generatePDFReport("cargo-report-content", {
      title: "Reporte diario – Carga por tipo",
      subtitle:
        "Análisis detallado de movimientos de carga clasificados por tipo de operación",
      dateRange: `${filters.startDate} - ${filters.endDate}`,
      data: movements,
      summary: overall,
      footer: "Sistema de Gestión de Almacén",
    })

  const exportExcel = () =>
    generateExcelReport(
      movements.map((m) => ({
        "Código de Seguimiento": m.trackingCode,
        Fecha: m.date,
        Tipo: m.type,
        Categoría: m.cargoCategory,
        Descripción: m.description,
        "Peso (kg)": m.weightKg,
        Cantidad: m.quantity,
        Almacén: m.warehouse,
        "Fecha Creación": m.createdAt,
      })),
      "reporte_carga_por_tipo",
    )

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* encabezado */}
        <header className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reporte diario – Carga por tipo
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Análisis detallado de movimientos de carga clasificados por tipo de
            operación
          </p>
        </header>

        {/* preview + acciones */}
        <ReportPreview
          title="Reporte diario – Carga por tipo"
          data={movements}
          summary={overall}
          dateRange={`${filters.startDate} - ${filters.endDate}`}
          onDownloadPDF={exportPDF}
          onDownloadExcel={exportExcel}
        >
          <div id="cargo-report-content" className="space-y-6">
            {/* filtros */}
            <DateFilters
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={resetFilters}
            />

            {/* tarjetas resumen */}
            <SummaryCards summary={overall} />

            {/* gráfica */}
            <CargoChart reports={dailyReports} />

            {/* tabla detallada */}
            <DetailedTable reports={dailyReports} />
          </div>
        </ReportPreview>

        {/* pie de página */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
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
                <strong>Período analizado:</strong>{" "}
                {new Date(filters.startDate).toLocaleDateString("es-ES")} –{" "}
                {new Date(filters.endDate).toLocaleDateString("es-ES")}
              </p>
              <p>
                <strong>Total de movimientos procesados:</strong>{" "}
                {movements.length} | <strong>Días con actividad:</strong>{" "}
                {dailyReports.length}
              </p>
              <p className="mt-2 border-t pt-2 text-xs">
                Sistema de Gestión de Almacén – Supervisor de Almacén
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
