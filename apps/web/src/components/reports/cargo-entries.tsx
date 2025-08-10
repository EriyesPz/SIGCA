import { useState, useMemo, useEffect } from "react";
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
import {
  Package,
  Calendar,
  Weight,
  Hash,
  MapPin,
  User,
  Paperclip,
} from "lucide-react";
import { ReportFiltersComponent } from "./report-filter";
import { ReportPreview } from "./report-preview";
import type { CargoEntryFilters as ReportFiltersType } from "./types";
import { generatePDF } from "@/utils/pdfExport";
import { generateExcelReport } from "@/utils/excelExport";
import { useCargoEntryReport } from "@/lib/reports";

// Helper para formatear YYYY-MM-DD o dejar undefined
const toYMD = (d?: string) => (d ? new Date(d).toISOString().slice(0, 10) : undefined);

export const CargoEntriesReport = () => {
  const [filters, setFilters] = useState<ReportFiltersType>({
    startDate: "", // fechas opcionales
    endDate: "",
    trackingCode: "",
    status: "all",
    user: "all",
    warehouse: "all", // aquí guardaremos el warehouseId o "all"
    cargoType: "all",
  });

  // --- Paginación ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const pageSizes = [10, 25, 50, 100];

  // Si quieres filtrar en backend cuando haya almacén seleccionado, descomenta:
  const selectedWarehouseId =
    filters.warehouse && filters.warehouse !== "all" ? filters.warehouse : undefined;

  // Llamada al backend (fechas opcionales)
  const { data: apiData, isLoading, error } = useCargoEntryReport({
    from: toYMD(filters.startDate),
    to: toYMD(filters.endDate),
    warehouseId: selectedWarehouseId, // ← opcional (si tu API lo soporta)
  });

const warehouseOptions: { id: string; name: string }[] =
  Array.from(
    new Map<string, { id: string; name: string }>(
      (apiData?.data ?? [])
        .filter((c: any) => c.warehouse?.id && c.warehouse?.name)
        .map((c: any) => [
          c.warehouse.id,
          { id: c.warehouse.id, name: c.warehouse.name }
        ])
    ).values()
  );


  // Normalizar data del backend al shape que usa tu UI.
  // Backend: { data: Cargo[], total, totalWeightKg, totalWithLocation, totalWithDocuments }
  const rows = useMemo(() => {
    const list = apiData?.data ?? [];
    return list.map((c: any) => ({
      id: c.id,
      trackingCode: c.trackingCode ?? "",
      description: c.description ?? "",
      cargoType: c.cargoType ?? c.category ?? "Sin categoría",
      weightKg: c.weightKg ?? 0,
      quantity: c.quantity ?? 0,
      entryDate: c.entryDate,
      status: (c.status ?? "").toString().toLowerCase(),
      warehouseId: c.warehouse?.id ?? null,          // ← añadimos ID
      warehouse: c.warehouse?.name ?? "Sin almacén", // ← nombre
      location: {
        rack: c.location?.rackCode || c.location?.rackName || "-",
        level: c.location?.levelNumber ?? "-",
        column: c.location?.columnCode ?? "-",
      },
      documentsCount: c.hasDocuments ? 1 : 0, // si quieres conteo real, expón count en backend
      createdBy: c.createdBy ?? "-",
    }));
  }, [apiData]);

  // Filtros en cliente (tracking, status, user, warehouse, cargoType)
  const filteredEntries = useMemo(() => {
    return rows.filter((e: any) => {
      // Fecha (si el usuario puso rango en UI; si no, no filtra por fecha)
      const dateOk =
        !filters.startDate || !filters.endDate
          ? true
          : new Date(e.entryDate) >= new Date(filters.startDate) &&
            new Date(e.entryDate) <= new Date(filters.endDate);

      const codeOk =
        !filters.trackingCode ||
        e.trackingCode.toLowerCase().includes(filters.trackingCode.toLowerCase());

      const statusOk = filters.status === "all" || e.status === filters.status;
      const userOk = filters.user === "all" || e.createdBy === filters.user;

      // Filtrado por almacén: comparamos por ID para precisión
      const warehouseOk =
        filters.warehouse === "all" || e.warehouseId === filters.warehouse;

      const cargoTypeOk = filters.cargoType === "all" || e.cargoType === filters.cargoType;

      return dateOk && codeOk && statusOk && userOk && warehouseOk && cargoTypeOk;
    });
  }, [rows, filters]);

  // --- Reset de página al cambiar filtros o data ---
  useEffect(() => {
    setPage(1);
  }, [filters, rows.length]);

  // Calcular paginación
  const total = filteredEntries.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageEntries = filteredEntries.slice(startIndex, endIndex);

  // Resumen con los datos filtrados (no paginados) para KPI/Export
  const summary = useMemo(
    () => ({
      totalCargas: filteredEntries.length,
      pesoTotal: `${filteredEntries
        .reduce((sum: number, e: any) => sum + (e.weightKg ?? 0), 0)
        .toFixed(1)} kg`,
      totalUnidades: filteredEntries.reduce(
        (sum: number, e: any) => sum + (e.quantity ?? 0),
        0
      ),
      conDocumentos: filteredEntries.filter((e: any) => e.documentsCount > 0).length,
    }),
    [filteredEntries]
  );

  const resetFilters = () =>
    setFilters({
      startDate: "",
      endDate: "",
      trackingCode: "",
      status: "all",
      user: "all",
      warehouse: "all",
      cargoType: "all",
    });

  // Exportaciones con datos reales (usa TODOS los filtrados, no solo la página)
  const exportPDF = () => {
    generatePDF(
      "Reporte de Cargas Ingresadas",
      [
        { header: "Código", accessor: "trackingCode" },
        { header: "Descripción", accessor: "description" },
        { header: "Categoría", accessor: "cargoType" },
        {
          header: "Peso (kg)",
          accessor: "weightKg",
          render: (v: number) => `${(v ?? 0).toFixed(1)} kg`,
        },
        { header: "Cantidad", accessor: "quantity" },
        {
          header: "Fecha Ingreso",
          accessor: "entryDate",
          render: (v: string) =>
            new Date(v).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
        },
        {
          header: "Estado",
          accessor: "status",
          render: (v: string) => v.replace("_", " "),
        },
        {
          header: "Ubicación",
          accessor: "location",
          render: (_: any, row: any) =>
            `${row.location.rack}-${row.location.level}-${row.location.column}`,
        },
        {
          header: "Documentos",
          accessor: "documentsCount",
          render: (n: number) => `${n} doc(s)`,
        },
        { header: "Creado Por", accessor: "createdBy" },
      ],
      filteredEntries, // <- exporta todos los datos filtrados
      `Total cargas: ${summary.totalCargas}\nPeso total: ${summary.pesoTotal}\nUnidades: ${summary.totalUnidades}\nCargas con documentos: ${summary.conDocumentos}`,
      "• Verifica los documentos adjuntos.\n• Asegura que todas las cargas estén correctamente ubicadas.\n• Reporta inconsistencias con el responsable del almacén.",
      filters.startDate && filters.endDate
        ? `${filters.startDate} - ${filters.endDate}`
        : "Sin rango de fechas"
    );
  };

  const exportExcel = () => {
    const excelData = filteredEntries.map((e: any) => ({
      Código: e.trackingCode,
      Descripción: e.description,
      Categoría: e.cargoType,
      "Peso (kg)": e.weightKg ?? 0,
      Cantidad: e.quantity ?? 0,
      "Fecha Ingreso": e.entryDate,
      Estado: e.status?.replace("_", " "),
      Almacén: e.warehouse, // nombre visible
      Ubicación: `${e.location.rack}-${e.location.level}-${e.location.column}`,
      "Creado Por": e.createdBy,
      "Documentos Adjuntos": e.documentsCount,
    }));
    generateExcelReport(excelData, "reporte_cargas_ingresadas");
  };

  // Colores de status (ajústalo a tus enums reales si difieren)
  const statusColors = {
    almacenado:
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 border-green-200 dark:border-green-600",
    en_transito:
      "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-600",
    en_revision:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-600",
    liberado:
      "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-600",
    entregada:
      "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-400 border-teal-200 dark:border-teal-600",
    rechazado:
      "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-400 border-red-200 dark:border-red-600",
  } as const;

  type StatusKey = keyof typeof statusColors;
  const statusColor = (s: string): string =>
    statusColors[(s as StatusKey)] ??
    "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-muted-foreground">Cargando reporte…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-red-600">Error al cargar el reporte.</p>
        </div>
      </div>
    );
  }

  /* -------------------------------- JSX ------------------------------- */
  return (
    <div className="min-h-screen bg-background pl-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Reporte de Cargas Ingresadas
        </h1>
        <p className="text-slate-400 mt-1 sm:mt-2">
          Lista completa de cargas registradas
        </p>
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {/* ---------- PREVIEW WRAPPER ---------- */}
        <ReportPreview
          title=""
          data={filteredEntries}
          summary={summary}
          dateRange={
            filters.startDate && filters.endDate
              ? `${filters.startDate} - ${filters.endDate}`
              : "Sin rango de fechas"
          }
          onDownloadPDF={exportPDF}
          onDownloadExcel={exportExcel}
        >
          <div id="cargo-entries-content" className="space-y-6">
            {/* ---------- FILTERS ---------- */}
            <ReportFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={resetFilters}
              showStatusFilter
              showWarehouseFilter
              title="Filtros de Cargas Ingresadas"
              warehouseOptions={warehouseOptions} // ← pasamos opciones al filtro
            />

            {/* ---------- SUMMARY CARDS ---------- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Total Cargas */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-green-100 dark:bg-green-900 p-3">
                      <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cargas</p>
                      <p className="text-2xl font-bold text-foreground">
                        {summary.totalCargas}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Peso total */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-3">
                      <Weight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peso Total</p>
                      <p className="text-2xl font-bold text-foreground">
                        {summary.pesoTotal}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total unidades */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900 p-3">
                      <Hash className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Unidades</p>
                      <p className="text-2xl font-bold text-foreground">
                        {summary.totalUnidades}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Con documentos */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-orange-100 dark:bg-orange-900 p-3">
                      <Paperclip className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Con Documentos</p>
                      <p className="text-2xl font-bold text-foreground">
                        {summary.conDocumentos}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ---------- TABLE ---------- */}
            <Card>
              <CardHeader>
                <CardTitle>Detalle de Cargas Ingresadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1}-{endIndex} de {total} registros
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Filas por página</label>
                    <select
                      className="rounded border border-input bg-background px-2 py-1 text-sm"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      {pageSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Peso (kg)</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead>Fecha Ingreso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead>Creado Por</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pageEntries.map((e: any) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-mono text-sm">
                          {e.trackingCode}
                        </TableCell>

                        <TableCell className="max-w-xs">
                          <div className="truncate" title={e.description}>
                            {e.description}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">{e.cargoType}</Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          {Number(e.weightKg ?? 0).toFixed(1)}
                        </TableCell>

                        <TableCell className="text-right">{e.quantity}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(e.entryDate).toLocaleDateString("es-ES")}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className={statusColor(e.status)}>
                            {e.status.replace("_", " ")}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {e.location.rack}-{e.location.level}-{e.location.column}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {e.documentsCount > 0 ? (
                            <span className="text-sm">{e.documentsCount} doc(s)</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Sin documentos
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{e.createdBy}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Controles de paginación */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="rounded border border-input px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                  >
                    ← Anterior
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      Página <strong>{safePage}</strong> de <strong>{totalPages}</strong>
                    </span>
                  </div>

                  <button
                    className="rounded border border-input px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                  >
                    Siguiente →
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ReportPreview>

        {/* ---------- FOOTER ---------- */}
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
              <p className="mt-1">
                Sistema de Gestión de Almacén – {filteredEntries.length} registros encontrados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
