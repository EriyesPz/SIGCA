/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import type React from "react"
import { useMemo, useState } from "react"

import {
  AlertTriangle,
  Calendar,
  FileText,
  RefreshCw,
  RotateCcw,
  User,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ReportFiltersComponent } from "./report-filter"
import { ReportPreview } from "./report-preview"
import { generateExcelReport, generatePDFReport } from "@/utils/pdf-generator"
import { mockCargoReturns } from "@/data/reports-data"
import type { CargoEntryFilters as Filters } from "./types"

/* ---------- helpers ---------- */
const colorForType = (t: string): string =>
  (
    {
      devolucion:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-600",
      reingreso:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-600",
      rechazo:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-600",
      correccion:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-600",
    } as const
  )[t as keyof typeof colorMap] ??
  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"

const iconForType = (t: string): React.ReactNode =>
  (
    {
      devolucion: <RotateCcw className="h-4 w-4" />,
      reingreso: <RefreshCw className="h-4 w-4" />,
      rechazo: <AlertTriangle className="h-4 w-4" />,
      correccion: <FileText className="h-4 w-4" />,
    } as const
  )[t as keyof typeof iconMap] ?? <FileText className="h-4 w-4" />

/* ---------- component ---------- */
export const CargoReturnsReport = () => {
  const [filters, setFilters] = useState<Filters>({
    startDate: "2024-01-16",
    endDate: "2024-01-18",
    trackingCode: "",
    status: "all",
    user: "all",
    warehouse: "all",
    cargoType: "all",
  })

  /* ---------- data ---------- */
  const rows = useMemo(() => {
    return mockCargoReturns.filter((r) => {
      const d = new Date(r.changeDate)
      const start = new Date(filters.startDate)
      const end = new Date(filters.endDate)

      const inRange = d >= start && d <= end
      const codeOk =
        !filters.trackingCode ||
        r.trackingCode.toLowerCase().includes(filters.trackingCode.toLowerCase())
      const userOk = filters.user === "all" || r.performedBy === filters.user
      return inRange && codeOk && userOk
    })
  }, [filters])

  const byType = useMemo(() => {
    return rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.changeType] = (acc[r.changeType] || 0) + 1
      return acc
    }, {})
  }, [rows])

  const summary = {
    total: rows.length,
    devoluciones: byType.devolucion ?? 0,
    reingresos: byType.reingreso ?? 0,
    rechazos: byType.rechazo ?? 0,
  }

  /* ---------- export ---------- */
  const resetFilters = () =>
    setFilters({
      startDate: "2024-01-16",
      endDate: "2024-01-18",
      trackingCode: "",
      status: "all",
      user: "all",
      warehouse: "all",
      cargoType: "all",
    })

  const exportPDF = async () =>
    generatePDFReport("cargo-returns-content", {
      title: "Reporte de Cargas Devueltas/Reingresadas",
      subtitle: "Casos de cargas rechazadas, devueltas o reingresadas al sistema",
      dateRange: `${filters.startDate} - ${filters.endDate}`,
      data: rows,
      summary,
      footer: "Sistema de Gestión de Almacén",
    })

  const exportExcel = () =>
    generateExcelReport(
      rows.map((r) => ({
        "Código de Carga": r.trackingCode,
        Descripción: r.cargoDescription,
        "Estado Anterior": r.previousStatus,
        "Nuevo Estado": r.newStatus,
        "Tipo de Cambio": r.changeType,
        "Fecha Cambio": r.changeDate,
        "Realizado Por": r.performedBy,
        Motivo: r.reason,
        Notas: r.notes ?? "",
      })),
      "reporte_cargas_devueltas",
    )

  /* ---------- ui ---------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* header */}
        <header className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <RotateCcw className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reporte de Cargas Devueltas/Reingresadas
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Casos de cargas rechazadas, devueltas o reingresadas al sistema
          </p>
        </header>

        {/* preview & actions */}
        <ReportPreview
          title="Reporte de Cargas Devueltas/Reingresadas"
          data={rows}
          summary={summary}
          dateRange={`${filters.startDate} - ${filters.endDate}`}
          onDownloadPDF={exportPDF}
          onDownloadExcel={exportExcel}
        >
          <div id="cargo-returns-content" className="space-y-6">
            {/* filters */}
            <ReportFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={resetFilters}
              showUserFilter
              title="Filtros de Cargas Devueltas"
            />

            {/* summary cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={<RotateCcw className="h-6 w-6 text-orange-600" />}
                bgLight="bg-orange-100"
                bgDark="bg-orange-900"
                label="Total Casos"
                value={summary.total}
              />
              <SummaryCard
                icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
                bgLight="bg-red-100"
                bgDark="bg-red-900"
                label="Devoluciones"
                value={summary.devoluciones}
              />
              <SummaryCard
                icon={<RefreshCw className="h-6 w-6 text-blue-600" />}
                bgLight="bg-blue-100"
                bgDark="bg-blue-900"
                label="Reingresos"
                value={summary.reingresos}
              />
              <SummaryCard
                icon={<FileText className="h-6 w-6 text-yellow-600" />}
                bgLight="bg-yellow-100"
                bgDark="bg-yellow-900"
                label="Rechazos"
                value={summary.rechazos}
              />
            </div>

            {/* table */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  Detalle de Cargas Devueltas/Reingresadas
                </CardTitle>
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
                    {rows.map((r) => (
                      <TableRow
                        key={r.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="font-mono text-sm">
                          {r.trackingCode}
                        </TableCell>

                        <TableCell className="max-w-xs">
                          <div className="truncate" title={r.cargoDescription}>
                            {r.cargoDescription}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {r.previousStatus.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {r.newStatus.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            {iconForType(r.changeType)}
                            <Badge className={colorForType(r.changeType)}>
                              {r.changeType}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(r.changeDate).toLocaleDateString("es-ES")}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{r.performedBy}</span>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-xs truncate">
                          {r.reason}
                        </TableCell>

                        <TableCell className="max-w-xs">
                          {r.notes && (
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                {r.notes}
                              </span>
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

        {/* footer */}
        <Card className="bg-white dark:bg-gray-800">
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
              <p className="mt-1">
                Sistema de Gestión de Almacén – {rows.length} casos registrados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ---------- small reusable pieces ---------- */
const SummaryCard = ({
  icon,
  bgLight,
  bgDark,
  label,
  value,
}: {
  icon: React.ReactNode
  bgLight: string
  bgDark: string
  label: string
  value: number
}) => (
  <Card className="bg-white dark:bg-gray-800">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${bgLight} dark:${bgDark}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

/* ---------- internal maps (kept after component to satisfy TS) ---------- */
const colorMap = {
  devolucion: "",
  reingreso: "",
  rechazo: "",
  correccion: "",
} as const

const iconMap = {
  devolucion: null,
  reingreso: null,
  rechazo: null,
  correccion: null,
} as const
