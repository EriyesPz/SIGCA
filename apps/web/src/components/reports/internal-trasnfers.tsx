/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import type React from "react";
import { useMemo, useState } from "react";

import {
  ArrowRightLeft,
  Calendar,
  MapPin,
  MoveRight,
  User,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { mockInternalTransfers } from "@/data/reports-data";
import type { CargoEntryFilters as ReportFiltersType } from "./types";
import { generatePDF } from "@/utils/pdfExport";
import { generateExcelReport } from "@/utils/excelExport";

/* ░░░ COMPONENTE PRINCIPAL ░░░ */
export const InternalTransfersReport = () => {
  /* ---------- state ---------- */
  const [filters, setFilters] = useState<ReportFiltersType>({
    startDate: "2024-01-16",
    endDate: "2024-01-18",
    trackingCode: "",
    status: "all",
    user: "all",
    warehouse: "all",
    cargoType: "all",
  });

  /* ---------- data ---------- */
  const filteredTransfers = useMemo(() => {
    return mockInternalTransfers.filter((t) => {
      const d = new Date(t.transferDate);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);

      const inRange = d >= start && d <= end;
      const codeOk =
        !filters.trackingCode ||
        t.trackingCode
          .toLowerCase()
          .includes(filters.trackingCode.toLowerCase());
      const userOk = filters.user === "all" || t.transferredBy === filters.user;

      return inRange && codeOk && userOk;
    });
  }, [filters]);

  const summary = useMemo(
    () => ({
      totalTraslados: filteredTransfers.length,
      usuariosActivos: new Set(filteredTransfers.map((t) => t.transferredBy))
        .size,
      cargasUnicas: new Set(filteredTransfers.map((t) => t.trackingCode)).size,
      almacenesInvolucrados: new Set([
        ...filteredTransfers.map((t) => t.previousLocation.warehouse),
        ...filteredTransfers.map((t) => t.newLocation.warehouse),
      ]).size,
    }),
    [filteredTransfers]
  );

  /* ---------- handlers ---------- */
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
      "Reporte de Traslados Internos",
      [
        { header: "Código de Carga", accessor: "trackingCode" },
        { header: "Descripción", accessor: "cargoDescription" },
        {
          header: "Fecha Traslado",
          accessor: "transferDate",
          render: (v) =>
            new Date(v).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
        },
        {
          header: "Ubicación Anterior",
          accessor: "previousLocation",
          render: (_v, row) =>
            `${row.previousLocation.warehouse} - ${row.previousLocation.rack}-${row.previousLocation.level}-${row.previousLocation.column}`,
        },
        {
          header: "Nueva Ubicación",
          accessor: "newLocation",
          render: (_v, row) =>
            `${row.newLocation.warehouse} - ${row.newLocation.rack}-${row.newLocation.level}-${row.newLocation.column}`,
        },
        { header: "Trasladado Por", accessor: "transferredBy" },
        { header: "Motivo", accessor: "reason" },
        {
          header: "Notas",
          accessor: "notes",
          render: (v) => v || "—",
        },
      ],
      filteredTransfers,
      `Total traslados: ${summary.totalTraslados}\nUsuarios activos: ${summary.usuariosActivos}\nCargas únicas: ${summary.cargasUnicas}\nAlmacenes involucrados: ${summary.almacenesInvolucrados}`,
      "• Verifica el motivo de cada traslado.\n• Confirma que la ubicación destino esté habilitada.\n• Revisa notas manuales para seguimiento operativo.",
      `${filters.startDate} - ${filters.endDate}`
    );
  };

  const exportExcel = () =>
    generateExcelReport(
      filteredTransfers.map((t) => ({
        "Código de Carga": t.trackingCode,
        Descripción: t.cargoDescription,
        "Fecha Traslado": t.transferDate,
        "Ubicación Anterior": `${t.previousLocation.warehouse} - ${t.previousLocation.rack}-${t.previousLocation.level}-${t.previousLocation.column}`,
        "Nueva Ubicación": `${t.newLocation.warehouse} - ${t.newLocation.rack}-${t.newLocation.level}-${t.newLocation.column}`,
        "Trasladado Por": t.transferredBy,
        Motivo: t.reason,
        Notas: t.notes || "",
      })),
      "reporte_traslados_internos"
    );

  /* ---------- ui ---------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ░ Header ░ */}
        <header className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <ArrowRightLeft className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reporte de Traslados Internos
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Movimientos de ubicación de cargas dentro del almacén
          </p>
        </header>

        {/* ░ Preview + Actions ░ */}
        <ReportPreview
          title="Reporte de Traslados Internos"
          data={filteredTransfers}
          summary={summary}
          dateRange={`${filters.startDate} - ${filters.endDate}`}
          onDownloadPDF={exportPDF}
          onDownloadExcel={exportExcel}
        >
          <div id="internal-transfers-content" className="space-y-6">
            {/* Filters */}
            <ReportFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={resetFilters}
              showUserFilter
              title="Filtros de Traslados Internos"
            />

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <SummaryCard
                icon={
                  <ArrowRightLeft className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                }
                bg="blue"
                label="Total Traslados"
                value={filteredTransfers.length}
              />
              <SummaryCard
                icon={
                  <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                }
                bg="green"
                label="Usuarios Activos"
                value={
                  new Set(filteredTransfers.map((t) => t.transferredBy)).size
                }
              />
              <SummaryCard
                icon={
                  <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                }
                bg="purple"
                label="Cargas Únicas"
                value={
                  new Set(filteredTransfers.map((t) => t.trackingCode)).size
                }
              />
              <SummaryCard
                icon={
                  <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                }
                bg="orange"
                label="Almacenes"
                value={
                  new Set([
                    ...filteredTransfers.map(
                      (t) => t.previousLocation.warehouse
                    ),
                    ...filteredTransfers.map((t) => t.newLocation.warehouse),
                  ]).size
                }
              />
            </div>

            {/* Table */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Detalle de Traslados Internos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código de Carga</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Fecha Traslado</TableHead>
                      <TableHead>Ubicación Anterior</TableHead>
                      <TableHead />
                      <TableHead>Nueva Ubicación</TableHead>
                      <TableHead>Trasladado Por</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Notas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers.map((t) => (
                      <TableRow
                        key={t.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="font-mono text-sm">
                          {t.trackingCode}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={t.cargoDescription}>
                            {t.cargoDescription}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(t.transferDate).toLocaleDateString(
                              "es-ES"
                            )}
                          </div>
                        </TableCell>

                        {/* Prev location */}
                        <TableCell>
                          <LocationTag
                            color="red"
                            warehouse={t.previousLocation.warehouse}
                            rack={t.previousLocation}
                          />
                        </TableCell>

                        {/* Arrow */}
                        <TableCell className="text-center">
                          <MoveRight className="h-4 w-4 text-muted-foreground" />
                        </TableCell>

                        {/* New location */}
                        <TableCell>
                          <LocationTag
                            color="green"
                            warehouse={t.newLocation.warehouse}
                            rack={t.newLocation}
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{t.transferredBy}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {t.reason}
                          </Badge>
                        </TableCell>

                        <TableCell className="max-w-xs">
                          {t.notes && (
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                {t.notes}
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

        {/* ░ Footer ░ */}
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
                Sistema de Gestión de Almacén – {filteredTransfers.length}{" "}
                traslados registrados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/* ░░░ COMPONENTES AUXILIARES ░░░ */
const SummaryCard = ({
  icon,
  bg,
  label,
  value,
}: {
  icon: React.ReactNode;
  bg: "blue" | "green" | "purple" | "orange";
  label: string;
  value: number;
}) => {
  const bgLight = `bg-${bg}-100`;
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Tailwind no permite clases dinámicas arbitrarias durante el build,
              así que usamos estilo inline para el fondo oscuro               */}
          <div
            className={`rounded-lg p-3 ${bgLight}`}
            style={{ backgroundColor: `var(--tw-${bg}-100)` }}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LocationTag = ({
  color,
  warehouse,
  rack,
}: {
  color: "red" | "green";
  warehouse: string;
  rack: { rack: string; level: number; column: number };
}) => {
  const pinColor = color === "red" ? "text-red-500" : "text-green-500";
  return (
    <div className="flex items-center gap-2">
      <MapPin className={`h-4 w-4 ${pinColor}`} />
      <div className="text-sm">
        <div className="font-medium">{warehouse}</div>
        <div className="text-muted-foreground">
          {rack.rack}-{rack.level}-{rack.column}
        </div>
      </div>
    </div>
  );
};
