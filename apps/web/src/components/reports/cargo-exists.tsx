/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import type React from "react";
import { useMemo, useState } from "react";

import {
  Calendar,
  FileText,
  LogOut,
  MapPin,
  Package,
  Truck,
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
import { generateExcelReport, generatePDFReport } from "@/utils/pdf-generator";
import { mockCargoExits } from "@/data/reports-data";
import type { CargoEntryFilters as Filters } from "./types";

/* ---------- helpers ---------- */
const colorForExit = (t: string): string =>
  ((
    {
      entrega:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-600",
      transferencia:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-600",
      devolucion:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-600",
    } as const
  )[t as keyof typeof exitColorMap] ??
  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600");

const iconForExit = (t: string): React.ReactNode =>
  ((
    {
      entrega: <Package className="h-4 w-4" />,
      transferencia: <Truck className="h-4 w-4" />,
      devolucion: <LogOut className="h-4 w-4" />,
    } as const
  )[t as keyof typeof exitIconMap] ?? <Package className="h-4 w-4" />);

/* ---------- component ---------- */
export const CargoExitsReport = () => {
  const [filters, setFilters] = useState<Filters>({
    startDate: "2024-01-16",
    endDate: "2024-01-18",
    trackingCode: "",
    status: "all",
    user: "all",
    warehouse: "all",
    cargoType: "all",
  });

  /* ---------- data ---------- */
  const rows = useMemo(() => {
    return mockCargoExits.filter((e) => {
      const d = new Date(e.exitDate);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);

      const inRange = d >= start && d <= end;
      const codeOk =
        !filters.trackingCode ||
        e.trackingCode
          .toLowerCase()
          .includes(filters.trackingCode.toLowerCase());
      const userOk =
        filters.user === "all" ||
        e.verifiedBy === filters.user ||
        e.deliveryResponsible.includes(filters.user);
      return inRange && codeOk && userOk;
    });
  }, [filters]);

  const byType = useMemo(() => {
    return rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.exitType] = (acc[r.exitType] || 0) + 1;
      return acc;
    }, {});
  }, [rows]);

  const summary = {
    total: rows.length,
    entregas: byType.entrega ?? 0,
    transferencias: byType.transferencia ?? 0,
    devoluciones: byType.devolucion ?? 0,
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

  const exportPDF = async () =>
    generatePDFReport("cargo-exits-content", {
      title: "Reporte de Salidas de Carga",
      subtitle: "Lista completa de cargas que han salido del almacén",
      dateRange: `${filters.startDate} - ${filters.endDate}`,
      data: rows,
      summary,
      footer: "Sistema de Gestión de Almacén",
    });

  const exportExcel = () =>
    generateExcelReport(
      rows.map((e) => ({
        "Código de Carga": e.trackingCode,
        Descripción: e.cargoDescription,
        "Fecha Salida": e.exitDate,
        Receptor: e.receiver,
        Destino: e.destination,
        "Tipo Salida": e.exitType,
        "Verificado Por": e.verifiedBy,
        "Responsable Entrega": e.deliveryResponsible,
        Transporte: e.transportMethod,
        Notas: e.notes ?? "",
      })),
      "reporte_salidas_carga"
    );

  /* ---------- ui ---------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* header */}
        <header className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <LogOut className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reporte de Salidas de Carga
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Lista completa de cargas que han salido del almacén
          </p>
        </header>

        {/* preview / actions */}
        <ReportPreview
          title="Reporte de Salidas de Carga"
          data={rows}
          summary={summary}
          dateRange={`${filters.startDate} - ${filters.endDate}`}
          onDownloadPDF={exportPDF}
          onDownloadExcel={exportExcel}
        >
          <div id="cargo-exits-content" className="space-y-6">
            <ReportFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={resetFilters}
              showUserFilter
              title="Filtros de Salidas de Carga"
            />

            {/* summary cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={<LogOut className="h-6 w-6 text-red-600" />}
                bgLight="bg-red-100"
                bgDark="bg-red-900"
                label="Total Salidas"
                value={summary.total}
              />
              <SummaryCard
                icon={<Package className="h-6 w-6 text-green-600" />}
                bgLight="bg-green-100"
                bgDark="bg-green-900"
                label="Entregas"
                value={summary.entregas}
              />
              <SummaryCard
                icon={<Truck className="h-6 w-6 text-blue-600" />}
                bgLight="bg-blue-100"
                bgDark="bg-blue-900"
                label="Transferencias"
                value={summary.transferencias}
              />
              <SummaryCard
                icon={<LogOut className="h-6 w-6 text-orange-600" />}
                bgLight="bg-orange-100"
                bgDark="bg-orange-900"
                label="Devoluciones"
                value={summary.devoluciones}
              />
            </div>

            {/* table */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  Detalle de Salidas de Carga
                </CardTitle>
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
                    {rows.map((e) => (
                      <TableRow
                        key={e.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="font-mono text-sm">
                          {e.trackingCode}
                        </TableCell>

                        <TableCell className="max-w-xs">
                          <div className="truncate" title={e.cargoDescription}>
                            {e.cargoDescription}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(e.exitDate).toLocaleDateString("es-ES")}
                          </div>
                        </TableCell>

                        <TableCell
                          className="max-w-xs truncate"
                          title={e.receiver}
                        >
                          {e.receiver}
                        </TableCell>

                        <TableCell className="max-w-xs">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="truncate" title={e.destination}>
                              {e.destination}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            {iconForExit(e.exitType)}
                            <Badge className={colorForExit(e.exitType)}>
                              {e.exitType}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{e.verifiedBy}</span>
                          </div>
                        </TableCell>

                        <TableCell
                          className="max-w-xs truncate"
                          title={e.deliveryResponsible}
                        >
                          {e.deliveryResponsible}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{e.transportMethod}</span>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-xs">
                          {e.notes && (
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                {e.notes}
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
                Sistema de Gestión de Almacén – {rows.length} salidas
                registradas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/* ---------- summary card ---------- */
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

/* ---------- empty const maps to satisfy TS ---------- */
const exitColorMap = {
  entrega: "",
  transferencia: "",
  devolucion: "",
} as const;
const exitIconMap = {
  entrega: null,
  transferencia: null,
  devolucion: null,
} as const;
