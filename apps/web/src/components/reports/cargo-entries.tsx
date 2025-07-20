import { useState, useMemo } from "react";
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
import { mockCargoEntries } from "@/data/reports-data";
import { generatePDFReport, generateExcelReport } from "@/utils/pdf-generator";
import type { CargoEntryFilters as ReportFiltersType } from "./types";

export const CargoEntriesReport = () => {
  const [filters, setFilters] = useState<ReportFiltersType>({
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    trackingCode: "",
    status: "all",
    user: "all",
    warehouse: "all",
    cargoType: "all",
  });

  /* ------------------------------- helpers ------------------------------ */
  const filteredEntries = useMemo(() => {
    return mockCargoEntries.filter((entry) => {
      const entryDate = new Date(entry.entryDate);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      const dateInRange = entryDate >= startDate && entryDate <= endDate;
      const codeMatch =
        !filters.trackingCode ||
        entry.trackingCode
          .toLowerCase()
          .includes(filters.trackingCode.toLowerCase());

      const statusMatch =
        filters.status === "all" || entry.status === filters.status;
      const userMatch =
        filters.user === "all" || entry.createdBy === filters.user;
      const warehouseMatch =
        filters.warehouse === "all" || entry.warehouse === filters.warehouse;

      return (
        dateInRange && codeMatch && statusMatch && userMatch && warehouseMatch
      );
    });
  }, [filters]);

  const summary = useMemo(
    () => ({
      totalCargas: filteredEntries.length,
      pesoTotal: `${filteredEntries
        .reduce((sum, entry) => sum + entry.weightKg, 0)
        .toFixed(1)} kg`,
      totalUnidades: filteredEntries.reduce(
        (sum, entry) => sum + entry.quantity,
        0
      ),
      conDocumentos: filteredEntries.filter(
        (entry) => entry.documents.length > 0
      ).length,
    }),
    [filteredEntries]
  );

  const resetFilters = () =>
    setFilters({
      startDate: "2024-01-15",
      endDate: "2024-01-18",
      trackingCode: "",
      status: "all",
      user: "all",
      warehouse: "all",
      cargoType: "all",
    });

  const exportPDF = async () => {
    await generatePDFReport("cargo-entries-content", {
      title: "Reporte de Cargas Ingresadas",
      subtitle: "Lista completa de cargas registradas con documentos adjuntos",
      dateRange: `${filters.startDate} - ${filters.endDate}`,
      data: filteredEntries,
      summary,
      footer: "Sistema de Gestión de Almacén",
    }).catch((e) => {
      console.error(e);
      alert("Error al generar el PDF. Intenta de nuevo.");
    });
  };

  const exportExcel = () => {
    const excelData = filteredEntries.map((e) => ({
      Código: e.trackingCode,
      Descripción: e.description,
      Categoría: e.category,
      "Peso (kg)": e.weightKg,
      Cantidad: e.quantity,
      "Fecha Ingreso": e.entryDate,
      Estado: e.status,
      Almacén: e.warehouse,
      Ubicación: `${e.location.rack}-${e.location.level}-${e.location.column}`,
      "Creado Por": e.createdBy,
      Documentos: e.documents.length,
    }));
    generateExcelReport(excelData, "reporte_cargas_ingresadas");
  };

  const statusColors = {
    almacenado:
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 border-green-200 dark:border-green-600",
    en_transito:
      "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-600",
    revision:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-600",
    liberado:
      "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-600",
  } as const;

  type StatusKey = keyof typeof statusColors;

  const statusColor = (s: StatusKey | string): string =>
    statusColors[s as StatusKey] ??
    "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600";

  const fileSize = (b: number) => {
    if (b === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  /* -------------------------------- JSX ------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ---------- HEADER ---------- */}
        <div className="rounded-lg bg-white dark:bg-card shadow-sm px-6 py-4">
          <div className="mb-1 flex items-center gap-3">
            <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reporte de Cargas Ingresadas
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Lista completa de cargas registradas con documentos adjuntos
          </p>
        </div>

        {/* ---------- PREVIEW WRAPPER ---------- */}
        <ReportPreview
          title="Reporte de Cargas Ingresadas"
          data={filteredEntries}
          summary={summary}
          dateRange={`${filters.startDate} - ${filters.endDate}`}
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
              showUserFilter
              showWarehouseFilter
              title="Filtros de Cargas Ingresadas"
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
                      <p className="text-sm text-muted-foreground">
                        Total Cargas
                      </p>
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
                      <p className="text-sm text-muted-foreground">
                        Peso Total
                      </p>
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
                      <p className="text-sm text-muted-foreground">
                        Total Unidades
                      </p>
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
                      <p className="text-sm text-muted-foreground">
                        Con Documentos
                      </p>
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
                    {filteredEntries.map((e) => (
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
                          <Badge variant="outline">{e.category}</Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          {e.weightKg.toFixed(1)}
                        </TableCell>

                        <TableCell className="text-right">
                          {e.quantity}
                        </TableCell>

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
                              {e.location.rack}-{e.location.level}-
                              {e.location.column}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {e.documents.length ? (
                            <div className="space-y-1">
                              {e.documents.map((d) => (
                                <div
                                  key={d.id}
                                  className="flex items-center gap-2"
                                >
                                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                                  <span className="cursor-pointer text-xs text-blue-600 hover:underline">
                                    {d.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({fileSize(d.size)})
                                  </span>
                                </div>
                              ))}
                            </div>
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
                Sistema de Gestión de Almacén – {filteredEntries.length}{" "}
                registros encontrados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
