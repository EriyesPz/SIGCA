"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Package,
  Truck,
  MapPin,
  Clock,
} from "lucide-react";
import {
  formatWeight,
  formatNumber,
  getTypeColor,
  getTypeIcon,
  getTypeLabel, // 🆕 etiqueta en ES
} from "@/utils/cargo-report";
import type { DailyCargoSummary } from "./types";
import React from "react";

interface DetailedTableProps {
  reports: DailyCargoSummary[];
}

export const DetailedTable = ({ reports }: DetailedTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (key: string) => {
    const copy = new Set(expandedRows);
    copy.has(key) ? copy.delete(key) : copy.add(key);
    setExpandedRows(copy);
  };

  /* ---------------------------- datos a pintar ---------------------------- */
  const tableData = reports.flatMap((r) =>
    r.summary.map((s) => ({
      date: r.date,
      type: s.type,
      count: s.count,
      totalWeight: s.totalWeight,
      totalUnits: s.totalUnits,
      items: s.items,
      key: `${r.date}-${s.type}`,
    }))
  );

  /* ---------------------------------- UI ---------------------------------- */
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Tabla Detallada por Día y Tipo
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-700/40">
                <TableHead className="w-12" />
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo de Carga</TableHead>
                <TableHead className="text-right"># Cargas</TableHead>
                <TableHead className="text-right">Peso Total (Kg)</TableHead>
                <TableHead className="text-right">Unidades</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tableData.map((row, idx) => {
                const expanded = expandedRows.has(row.key);
                const zebra =
                  idx % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50/60 dark:bg-gray-700/20";

                return (
                  <React.Fragment key={row.key}>
                    {/* ------------------------------ Fila padre ----------------------------- */}
                    <TableRow
                      className={`${zebra} hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer`}
                      onClick={() => toggleRowExpansion(row.key)}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-1"
                        >
                          {expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>

                      <TableCell className="font-medium">
                        {new Date(row.date).toLocaleDateString("es-ES", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`${getTypeColor(
                            row.type
                          )} font-medium capitalize`}
                        >
                          {getTypeIcon(row.type)} {getTypeLabel(row.type)}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {formatNumber(row.count)}
                      </TableCell>

                      <TableCell className="text-right">
                        {formatWeight(row.totalWeight)}
                      </TableCell>

                      <TableCell className="text-right">
                        {formatNumber(row.totalUnits)}
                      </TableCell>
                    </TableRow>

                    {/* ----------------------------- Fila detalle ---------------------------- */}
                    {expanded && (
                      <TableRow>
                        <TableCell colSpan={6} className="p-0">
                          <div className="border-l-4 border-blue-300 dark:border-blue-700 bg-gray-50/60 dark:bg-gray-900/40 p-4 space-y-4">
                            <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                              <Package className="h-4 w-4" />
                              Detalle – {getTypeLabel(row.type)} (
                              {row.items.length})
                            </h4>

                            {row.items.map((it) => (
                              <div
                                key={it.id}
                                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm"
                              >
                                <div className="grid gap-3 md:grid-cols-4">
                                  {/* tracking */}
                                  <DetailBlock
                                    icon={
                                      <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    }
                                    label="Código"
                                  >
                                    <span className="font-mono">
                                      {it.trackingCode}
                                    </span>
                                  </DetailBlock>

                                  {/* description */}
                                  <DetailBlock
                                    icon={
                                      <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    }
                                    label="Descripción"
                                  >
                                    {it.description}
                                  </DetailBlock>

                                  {/* warehouse */}
                                  <DetailBlock
                                    icon={
                                      <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    }
                                    label="Almacén"
                                  >
                                    {it.warehouse}
                                  </DetailBlock>

                                  {/* time */}
                                  <DetailBlock
                                    icon={
                                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    }
                                    label="Hora"
                                  >
                                    {new Date(it.createdAt).toLocaleTimeString(
                                      "es-ES",
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}
                                  </DetailBlock>
                                </div>

                                {/* footer */}
                                <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3 flex flex-wrap justify-between items-center">
                                  <div className="flex gap-4 flex-wrap text-sm">
                                    <span>
                                      <strong>Categoría:</strong>{" "}
                                      {it.cargoCategory}
                                    </span>
                                    <span>
                                      <strong>Peso:</strong>{" "}
                                      {formatWeight(it.weightKg)}
                                    </span>
                                    <span>
                                      <strong>Cantidad:</strong>{" "}
                                      {formatNumber(it.quantity)} u
                                    </span>
                                  </div>

                                  <Badge
                                    className={`${getTypeColor(
                                      it.type
                                    )} text-xs capitalize`}
                                  >
                                    {getTypeIcon(it.type)}{" "}
                                    {getTypeLabel(it.type)}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {tableData.length === 0 && (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">
            No hay datos disponibles para el rango seleccionado
          </p>
        )}
      </CardContent>
    </Card>
  );
};

/* -------------------------------------------------------------------------- */
/*                         Bloque reutilizable de detalle                     */
/* -------------------------------------------------------------------------- */
const DetailBlock = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="mb-1 flex items-center gap-2">
      {icon}
      <span className="font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
  </div>
);
