import type React from "react";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  FileText,
  RefreshCw,
  RotateCcw,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportFiltersComponent } from "./report-filter";
import { ReportPreview } from "./report-preview";
import type { CargoEntryFilters as Filters } from "./types";
import { generatePDF } from "@/utils/pdfExport";
import { generateExcelReport } from "@/utils/excelExport";
import { useCargoReturnReentryReport } from "@/lib/reports";

/* ---------- helpers ---------- */

const colorForType = (t: string): string =>
  ((
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
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600");

const iconForType = (t: string): React.ReactNode =>
  ((
    {
      devolucion: <RotateCcw className="h-4 w-4" />,
      reingreso: <RefreshCw className="h-4 w-4" />,
      rechazo: <AlertTriangle className="h-4 w-4" />,
      correccion: <FileText className="h-4 w-4" />,
    } as const
  )[t as keyof typeof iconMap] ?? <FileText className="h-4 w-4" />);

// intenta parsear (ISO o lo que venga) a Date seguro
const parseDateSafe = (v: string) => {
  // backend puede enviar toISOString() o toLocaleDateString("es-HN")
  // intentamos ISO primero; si no, que el Date nativo lo intente
  const isoGuess = /\d{4}-\d{2}-\d{2}T/.test(v) ? v : v.replace("/", "-");
  const d = new Date(isoGuess);
  return isNaN(d.getTime()) ? new Date(v) : d;
};

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
  });

  // hook de datos reales
  const { data, isLoading, error } = useCargoReturnReentryReport({
    from: filters.startDate || undefined,
    to: filters.endDate || undefined,
    warehouseId: filters.warehouse !== "all" ? filters.warehouse : undefined,
  });

  // normaliza backend -> filas de la UI
  // backend (según lo que implementamos): { resumen, meta?, data: [{ codigo, descripcion, estadoAnterior, nuevoEstado, tipoCambio, fechaCambio(ISO o string), realizadoPor, motivo, id? }] }
  const rawRows = Array.isArray(data?.data) ? data!.data : [];

  const rows = useMemo(
    () =>
      rawRows.map((r: any) => ({
        // aseguramos props que la tabla/exportadores consumen
        id: r.id ?? `${r.codigo}-${r.fechaCambio}`,
        trackingCode: r.codigo ?? "Sin Código",
        cargoDescription: r.descripcion ?? "-",
        previousStatus: r.estadoAnterior ?? "-",
        newStatus: r.nuevoEstado ?? "-",
        changeType: r.tipoCambio ?? "correccion",
        changeDate: (() => {
          // guardamos ISO para export, y mostramos formateado en tabla
          // si ya es ISO, la dejamos; si es locale, intentamos normalizar a ISO
          const d = typeof r.fechaCambio === "string" ? parseDateSafe(r.fechaCambio) : new Date(r.fechaCambio);
          return d.toISOString();
        })(),
        performedBy: r.realizadoPor ?? "Desconocido",
        reason: r.motivo ?? "Sin motivo registrado",
        notes: r.notes ?? "",
      })),
    [rawRows]
  );

  // filtros de UI (tracking y usuario) aplicados en cliente
  const filteredRows = useMemo(() => {
    const q = (filters.trackingCode || "").trim().toLowerCase();
    return rows.filter((r: any) => {
      const inTracking = !q || (r.trackingCode ?? "").toLowerCase().includes(q);
      const inUser = filters.user === "all" || r.performedBy === filters.user;
      // status/warehouse/cargoType no están en este reporte; si luego el backend los añade, filtras aquí
      return inTracking && inUser;
    });
  }, [rows, filters.trackingCode, filters.user]);

  // summary (usa backend si está, si no calculamos)
  const resumen = data?.resumen ?? (() => {
    const byType: Record<string, number> = {};
    for (const r of filteredRows) {
      byType[r.changeType] = (byType[r.changeType] || 0) + 1;
    }
    return {
      totalCasos: filteredRows.length,
      devoluciones: byType.devolucion ?? 0,
      reingresos: byType.reingreso ?? 0,
      rechazos: byType.rechazo ?? 0,
    };
  })();

  const summary = {
    total: resumen.totalCasos ?? filteredRows.length,
    devoluciones: resumen.devoluciones ?? 0,
    reingresos: resumen.reingresos ?? 0,
    rechazos: resumen.rechazos ?? 0,
  };

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
    });

  const exportPDF = () => {
    generatePDF(
      "Reporte de Cargas Devueltas/Reingresadas",
      [
        { header: "Código de Carga", accessor: "trackingCode" },
        { header: "Descripción", accessor: "cargoDescription" },
        { header: "Estado Anterior", accessor: "previousStatus" },
        { header: "Nuevo Estado", accessor: "newStatus" },
        { header: "Tipo de Cambio", accessor: "changeType" },
        {
          header: "Fecha Cambio",
          accessor: "changeDate",
          render: (v) =>
            new Date(v).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
        },
        { header: "Realizado Por", accessor: "performedBy" },
        { header: "Motivo", accessor: "reason" },
        {
          header: "Notas",
          accessor: "notes",
          render: (vv) => vv || "—",
        },
      ],
      filteredRows,
      `Total casos: ${summary.total}\nDevoluciones: ${summary.devoluciones}\nReingresos: ${summary.reingresos}\nRechazos: ${summary.rechazos}`,
      "• Revisa los motivos de rechazo.\n• Confirma si las devoluciones requieren reingreso.\n• Verifica responsables y documentación asociada.",
      `${filters.startDate} - ${filters.endDate}`
    );
  };

  const exportExcel = () =>
    generateExcelReport(
      filteredRows.map((r: any) => ({
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
      "reporte_cargas_devueltas"
    );

  /* ---------- loading / error ---------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-muted-foreground">Cargando reporte…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-red-600">Error al cargar el reporte.</p>
        </div>
      </div>
    );
  }

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
          data={filteredRows}
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
                    {filteredRows.map((r: any) => (
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
                            {String(r.previousStatus).replace(/_/g, " ")}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {String(r.newStatus).replace(/_/g, " ")}
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

                    {filteredRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                          No hay registros con los filtros actuales.
                        </TableCell>
                      </TableRow>
                    )}
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
                Sistema de Gestión de Almacén – {filteredRows.length} casos visibles
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/* ---------- small reusable pieces ---------- */
const SummaryCard = ({
  icon,
  bgLight,
  bgDark,
  label,
  value,
}: {
  icon: React.ReactNode;
  bgLight: string;
  bgDark: string;
  label: string;
  value: number;
}) => (
  <Card className="bg-white dark:bg-gray-800">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${bgLight} dark:${bgDark}`}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ---------- internal maps (kept after component to satisfy TS) ---------- */
const colorMap = {
  devolucion: "",
  reingreso: "",
  rechazo: "",
  correccion: "",
} as const;

const iconMap = {
  devolucion: null,
  reingreso: null,
  rechazo: null,
  correccion: null,
} as const;
