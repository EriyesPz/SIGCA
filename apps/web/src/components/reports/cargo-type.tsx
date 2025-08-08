/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useMemo, useState, type JSX } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Package,
  LogOut,
  Wrench,
  RotateCcw,
  FileSpreadsheet,
  Download,
  Building2,
  Boxes,
  Scale,
  Search,
} from "lucide-react";

import { useDailyCargoByTypeReport } from "@/lib/reports";
import { generatePDF } from "@/utils/pdfExport";
import { generateExcelReport } from "@/utils/excelExport";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ---------------- helpers ---------------- */

const toYMD = (s?: string) =>
  s ? new Date(s).toISOString().slice(0, 10) : undefined;

type ReportType = "Entradas" | "Salidas" | "Devoluciones" | "Dañadas";

const typeConfig: Record<
  ReportType,
  { label: string; badgeClass: string }
> = {
  Entradas: {
    label: "Entradas",
    badgeClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  },
  Salidas: {
    label: "Salidas",
    badgeClass:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  },
  Devoluciones: {
    label: "Devoluciones",
    badgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  },
  Dañadas: {
    label: "Dañadas",
    badgeClass:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-700",
  },
};

// columnas para exportar PDF
const pdfColumns = [
  { header: "Fecha (día)", accessor: "date" },
  { header: "Tipo", accessor: "type" },
  { header: "Hora", accessor: "time" },
  { header: "Código", accessor: "code" },
  { header: "Descripción", accessor: "description" },
  { header: "Categoría", accessor: "category" },
  { header: "Peso (kg)", accessor: "weightKg" },
  { header: "Cantidad", accessor: "quantity" },
  { header: "Almacén", accessor: "warehouse" },
];

// util para aplanar grouped -> filas planas
const flattenRows = (grouped: any[]) => {
  const rows: any[] = [];
  grouped.forEach((g) => {
    const date = g.date; // "YYYY-MM-DD"
    (g.types as any[]).forEach((t) => {
      const type: ReportType = t.type;
      (t.items as any[]).forEach((it) => {
        rows.push({
          date,
          type,
          time: it.time,
          code: it.code,
          description: it.description,
          category: it.category,
          weightKg: it.weightKg ?? 0,
          quantity: it.quantity ?? 0,
          warehouse: it.warehouse ?? "-",
        });
      });
    });
  });
  return rows;
};

/* ---------------- page ---------------- */

export function CargoTypeReport() {
  // filtros (opcionales)
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [warehouse, setWarehouse] = useState<string>("");

  // búsqueda y paginación
  const [trackingSearch, setTrackingSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // query al backend
  const { data, isLoading, error } = useDailyCargoByTypeReport({
    from: toYMD(startDate),
    to: toYMD(endDate),
    warehouseId: warehouse || undefined,
  });

  // aplanar
  const flatAll = useMemo(() => flattenRows(data?.grouped ?? []), [data?.grouped]);

  // filtrar por tracking
  const filtered = useMemo(() => {
    const q = trackingSearch.trim().toLowerCase();
    const base = flatAll;
    if (!q) return base;
    return base.filter((r) => (r.code ?? "").toString().toLowerCase().includes(q));
  }, [flatAll, trackingSearch]);

  // ordenar por fecha/hora descendente (más recientes arriba)
  const ordered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      // compón fecha+hora para ordenar
      const aKey = `${a.date} ${a.time}`;
      const bKey = `${b.date} ${b.time}`;
      return aKey < bKey ? 1 : aKey > bKey ? -1 : 0;
    });
  }, [filtered]);

  // paginación
  const totalItems = ordered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = ordered.slice(start, start + pageSize);

  // KPIs globales (del backend)
  const kpis = data?.summary ?? {
    recibidas: 0,
    despachadas: 0,
    pesoTotalKg: 0,
    unidadesTotales: 0,
    danadas: 0,
    devueltas: 0,
  };

  // datos para gráficos
  // 1) Barras por día y tipo (conteo)
  const perDayType = useMemo(() => {
    const map: Record<string, Record<ReportType, number>> = {};
    (data?.grouped ?? []).forEach((d: any) => {
      if (!map[d.date]) {
        map[d.date] = { Entradas: 0, Salidas: 0, Devoluciones: 0, Dañadas: 0 };
      }
      (d.types as any[]).forEach((t) => {
        const ty = t.type as ReportType;
        map[d.date][ty] += Number(t.count ?? 0);
      });
    });
    return Object.entries(map)
      .map(([date, obj]) => ({ date, ...obj }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [data?.grouped]);

  // 2) Pie por tipo (conteo total)
  const perTypeTotals = useMemo(() => {
    const acc: Record<ReportType, number> = {
      Entradas: 0,
      Salidas: 0,
      Devoluciones: 0,
      Dañadas: 0,
    };
    (data?.grouped ?? []).forEach((d: any) => {
      (d.types as any[]).forEach((t) => {
        const ty = t.type as ReportType;
        acc[ty] += Number(t.count ?? 0);
      });
    });
    return (Object.keys(acc) as ReportType[]).map((k) => ({
      name: k,
      value: acc[k],
    }));
  }, [data?.grouped]);

  const reset = () => {
    setStartDate("");
    setEndDate("");
    setWarehouse("");
    setTrackingSearch("");
    setPage(1);
    setPageSize(25);
  };

  const onDownloadPDF = () => {
    // Exporta lo visible (filtrado), no solo la página actual
    generatePDF(
      "Reporte diario – Carga por tipo",
      pdfColumns,
      ordered,
      `Registros (visibles): ${ordered.length}
Entradas: ${kpis.recibidas}
Salidas: ${kpis.despachadas}
Devoluciones: ${kpis.devueltas}
Dañadas: ${kpis.danadas}
Peso total: ${Number(kpis.pesoTotalKg ?? 0).toFixed(1)} kg
Unidades totales: ${kpis.unidadesTotales}`,
      "• Valida picos de devoluciones o dañadas.\n• Revisa entradas/salidas vs capacidad operativa.\n• Ajusta recursos si hay concentración por franja horaria.",
      data?.meta?.range
        ? `${data.meta.range.from} - ${data.meta.range.to}`
        : "Sin rango de fechas"
    );
  };

  const onDownloadExcel = () => {
    const excelRows = ordered.map((r) => ({
      Fecha: r.date,
      Tipo: r.type,
      Hora: r.time,
      Código: r.code,
      Descripción: r.description,
      Categoría: r.category,
      "Peso (kg)": r.weightKg,
      Cantidad: r.quantity,
      Almacén: r.warehouse,
    }));
    generateExcelReport(excelRows, "reporte_diario_carga_por_tipo");
  };

  /* ------------- estados ------------- */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-muted-foreground">Cargando reporte…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-red-600">Error al cargar el reporte.</p>
        </div>
      </div>
    );
  }

  /* ------------- UI ------------- */

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* header */}
        <div className="rounded-lg bg-card p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
                Reporte diario – Carga por tipo
              </h1>
              <p className="text-sm text-muted-foreground">
                Entradas, salidas, devoluciones y dañadas — tabla y gráficos
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onDownloadExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={onDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Desde (opcional)
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Hasta (opcional)
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Warehouse ID (opcional)
                </label>
                <Input
                  value={warehouse}
                  onChange={(e) => {
                    setWarehouse(e.target.value);
                    setPage(1);
                  }}
                  placeholder="ID de almacén"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Buscar por tracking
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    value={trackingSearch}
                    onChange={(e) => {
                      setTrackingSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Ej. HWB/MAWB/TrackingCode"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <KpiCard
            icon={<Boxes className="h-6 w-6 text-emerald-600" />}
            label="Entradas"
            value={kpis.recibidas}
          />
          <KpiCard
            icon={<LogOut className="h-6 w-6 text-blue-600" />}
            label="Salidas"
            value={kpis.despachadas}
          />
          <KpiCard
            icon={<RotateCcw className="h-6 w-6 text-amber-600" />}
            label="Devoluciones"
            value={kpis.devueltas}
          />
          <KpiCard
            icon={<Wrench className="h-6 w-6 text-red-600" />}
            label="Dañadas"
            value={kpis.danadas}
          />
          <KpiCard
            icon={<Scale className="h-6 w-6 text-purple-600" />}
            label="Peso total (kg)"
            value={Number(kpis.pesoTotalKg ?? 0).toFixed(1)}
          />
        </div>

        {/* gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Registros por día y tipo</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perDayType}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Entradas" stackId="a" />
                  <Bar dataKey="Salidas" stackId="a" />
                  <Bar dataKey="Devoluciones" stackId="a" />
                  <Bar dataKey="Dañadas" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución por tipo</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={perTypeTotals}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {perTypeTotals.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* tabla plana con paginación */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detalle (tabla)</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filas por página:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {ordered.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay registros para los filtros seleccionados.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="text-right">Peso (kg)</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            Almacén
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageRows.map((r, idx) => (
                        <TableRow key={`${r.date}-${r.time}-${r.code}-${idx}`}>
                          <TableCell>{r.date}</TableCell>
                          <TableCell className="font-mono text-xs">{r.time}</TableCell>
                          <TableCell>
                            <Badge
                              className={typeConfig[r.type as ReportType]?.badgeClass}
                              variant="outline"
                            >
                              {typeConfig[r.type as ReportType]?.label ?? r.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{r.code}</TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate" title={r.description}>
                              {r.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {r.category ?? "Sin categoría"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {Number(r.weightKg ?? 0).toFixed(1)}
                          </TableCell>
                          <TableCell className="text-right">
                            {r.quantity ?? 0}
                          </TableCell>
                          <TableCell>{r.warehouse}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* paginación */}
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando{" "}
                    <span className="font-medium">
                      {start + 1}-{Math.min(start + pageSize, totalItems)}
                    </span>{" "}
                    de <span className="font-medium">{totalItems}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(1)}
                      disabled={safePage === 1}
                    >
                      «
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                    >
                      Anterior
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <span className="text-sm text-muted-foreground">
                      Página {safePage} de {totalPages}
                    </span>
                    <Separator orientation="vertical" className="h-6" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage === totalPages}
                    >
                      Siguiente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(totalPages)}
                      disabled={safePage === totalPages}
                    >
                      »
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* footer */}
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
                Registros visibles: {ordered.length} • Unidades totales: {kpis.unidadesTotales}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-muted p-3">{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
