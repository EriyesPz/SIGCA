/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState } from "react";
import {
  Filter,
  Download,
  Calendar,
  Search,
  Clock,
  Package,
  Warehouse as WarehouseIcon,
  BarChart3,
  TrendingUp,
  Timer,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { generatePDF } from "@/utils/pdfExport";
import { generateExcelReport } from "@/utils/excelExport";
import { useCargoAverageReport } from "@/lib/reports";

/* ---------------- helpers ---------------- */

const toYMD = (s?: string) => (s ? new Date(s).toISOString().slice(0, 10) : undefined);
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

type DetailRow = {
  id: string;
  trackingCode: string | null;
  description: string | null;
  status: string | null;
  entryDate: string | Date;
  exitDate: string | Date | null;
  warehouse: { id: string | null; name: string | null };
  category: string | null;
  daysInWarehouse: number;
  isClosed: boolean;
};

/* ---------------- page ---------------- */

export const CargoAverage = () => {
  // filtros (opcionales)
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [warehouse, setWarehouse] = useState<string>("");

  // búsqueda & filtros de UI (cliente)
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // llamar backend
  const { data, isLoading, error } = useCargoAverageReport({
    from: toYMD(from),
    to: toYMD(to),
    warehouseId: warehouse || undefined,
  });

  const details: DetailRow[] = Array.isArray(data?.data) ? (data!.data as DetailRow[]) : [];

  // opciones dinámicas para selects de categoría/estado
  const categorias = useMemo(() => {
    const set = new Set(details.map((d) => d.category ?? "Sin categoría"));
    return ["todos", ...Array.from(set)];
  }, [details]);

  const estados = useMemo(() => {
    const set = new Set(details.map((d) => d.status ?? "Sin estado"));
    return ["todos", ...Array.from(set)];
  }, [details]);

  // filtros en cliente
  const filtered = useMemo(() => {
    const q = filtroCodigo.trim().toLowerCase();
    return details.filter((d) => {
      const codeOk = !q || (d.trackingCode ?? "").toLowerCase().includes(q);
      const catOk = filtroCategoria === "todos" || (d.category ?? "Sin categoría") === filtroCategoria;
      const statusOk = filtroEstado === "todos" || (d.status ?? "Sin estado") === filtroEstado;
      return codeOk && catOk && statusOk;
    });
  }, [details, filtroCodigo, filtroCategoria, filtroEstado]);

  // paginado
  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = clamp(page, 1, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  // KPIs (del backend si vienen; si no, derivamos)
  const summary = data?.summary ?? {
    totalCargos: details.length,
    closedCount: details.filter((d) => d.isClosed).length,
    openCount: details.filter((d) => !d.isClosed).length,
    averageDaysOverall:
      details.length
        ? Number((details.reduce((a, b) => a + b.daysInWarehouse, 0) / details.length).toFixed(2))
        : 0,
    averageDaysClosedOnly: (() => {
      const closed = details.filter((d) => d.isClosed).map((d) => d.daysInWarehouse);
      return closed.length ? Number((closed.reduce((a, b) => a + b, 0) / closed.length).toFixed(2)) : 0;
    })(),
    averageDaysOpenOnly: (() => {
      const open = details.filter((d) => !d.isClosed).map((d) => d.daysInWarehouse);
      return open.length ? Number((open.reduce((a, b) => a + b, 0) / open.length).toFixed(2)) : 0;
    })(),
  };

  // Gráfico: promedio por categoría (usar data.byCategory si existe)
  const chartDataCategoria =
    data?.byCategory?.map((g: any) => ({
      categoria: g.category ?? "Sin categoría",
      promedioDias: Number(g.avgDays ?? 0),
      totalCargas: Number(g.count ?? 0),
    })) ??
    (() => {
      const map = new Map<string, { sum: number; count: number }>();
      for (const d of details) {
        const key = d.category ?? "Sin categoría";
        if (!map.has(key)) map.set(key, { sum: 0, count: 0 });
        const g = map.get(key)!;
        g.sum += Number(d.daysInWarehouse ?? 0);
        g.count += 1;
      }
      return Array.from(map.entries()).map(([categoria, v]) => ({
        categoria,
        promedioDias: v.count ? Math.round((v.sum / v.count) * 10) / 10 : 0,
        totalCargas: v.count,
      }));
    })();

  // Gráfico: distribución por rangos
  const rangos = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const d of details) {
      const dias = Number(d.daysInWarehouse ?? 0);
      let r = "";
      if (dias <= 3) r = "1-3 días";
      else if (dias <= 7) r = "4-7 días";
      else if (dias <= 14) r = "8-14 días";
      else r = "15+ días";
      acc[r] = (acc[r] || 0) + 1;
    }
    const total = details.length || 1;
    return Object.entries(acc).map(([name, value]) => ({
      name,
      value,
      porcentaje: ((value / total) * 100).toFixed(1),
    }));
  }, [details]);

  // Gráfico: tendencia (por día de entryDate)
  const chartDataTemporal = useMemo(() => {
    const tmp = (details ?? [])
      .map((d) => ({
        day: new Date(d.entryDate).toISOString().slice(0, 10), // YYYY-MM-DD
        days: Number(d.daysInWarehouse ?? 0),
      }))
      .sort((a, b) => (a.day < b.day ? -1 : 1));

    const map = new Map<string, { totalDias: number; cantidad: number }>();
    for (const it of tmp) {
      if (!map.has(it.day)) map.set(it.day, { totalDias: 0, cantidad: 0 });
      const g = map.get(it.day)!;
      g.totalDias += it.days;
      g.cantidad += 1;
    }
    return Array.from(map.entries()).map(([day, v]) => ({
      dia: day,
      promedioDias: Number((v.totalDias / v.cantidad).toFixed(2)),
    }));
  }, [details]);

  // Paleta para pie
  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  const getEstadoBadge = (estado?: string | null) => {
    switch ((estado ?? "").toLowerCase()) {
      case "en almacén":
      case "en almacen":
        return "default" as const;
      case "despachado":
        return "secondary" as const;
      case "en proceso":
        return "secondary" as const;
      case "retenido":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const reset = () => {
    setFrom("");
    setTo("");
    setWarehouse("");
    setFiltroCodigo("");
    setFiltroCategoria("todos");
    setFiltroEstado("todos");
    setPage(1);
  };

  const handleDownloadPDF = () => {
    const columns = [
      { header: "Código", accessor: "trackingCode" },
      { header: "Categoría", accessor: "category" },
      { header: "Días en Almacén", accessor: "daysInWarehouse" },
      { header: "Estado", accessor: "status" },
      { header: "Ubicación", accessor: "warehouse" },
      { header: "Fecha Ingreso", accessor: "entryDate" },
      { header: "Fecha Salida", accessor: "exitDate" },
      { header: "Descripción", accessor: "description" },
    ];

    const exportRows = filtered.map((d) => ({
      trackingCode: d.trackingCode ?? `CGX-${d.id.slice(0, 6)}`,
      category: d.category ?? "Sin categoría",
      daysInWarehouse: `${d.daysInWarehouse} días`,
      status: d.status ?? "-",
      warehouse: d.warehouse?.name ?? "-",
      entryDate: new Date(d.entryDate).toLocaleDateString("es-ES"),
      exitDate: d.exitDate ? new Date(d.exitDate).toLocaleDateString("es-ES") : "—",
      description: d.description ?? "",
    }));

    generatePDF(
      "Reporte de Permanencia en Almacén",
      columns,
      exportRows,
      `Total de cargas: ${filtered.length}\nPromedio general: ${summary.averageDaysOverall} días\nCerradas: ${summary.closedCount} • Abiertas: ${summary.openCount}`,
      undefined,
      from && to ? `${toYMD(from)} - ${toYMD(to)}` : "Sin rango de fechas"
    );
  };

  const handleDownloadExcel = () => {
    const rows = filtered.map((d) => ({
      Código: d.trackingCode ?? `CGX-${d.id.slice(0, 6)}`,
      Categoría: d.category ?? "Sin categoría",
      "Fecha Ingreso": new Date(d.entryDate).toISOString(),
      "Fecha Salida": d.exitDate ? new Date(d.exitDate).toISOString() : "",
      "Días en Almacén": d.daysInWarehouse,
      Estado: d.status ?? "-",
      Almacén: d.warehouse?.name ?? "-",
      Descripción: d.description ?? "",
    }));
    generateExcelReport(rows, "reporte-permanencia");
  };

  /* ---------- estados de carga ---------- */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <p className="text-muted-foreground">Cargando reporte…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <p className="text-red-600">Error al cargar el reporte.</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Promedio de Permanencia
        </h1>
        <p className="text-slate-400 mt-1 sm:mt-2">
          Análisis de tiempos de estadía y rotación de inventario en almacén
        </p>
      </div>
      {/* Action Bar */}
      <div className="bg-card rounded-lg p-4 mb-6 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-primary" />
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={handleDownloadPDF}>
              Generar PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadExcel}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-6 mb-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-card-foreground">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Fecha Inicio (opcional)</label>
            <div className="relative">
              <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="pl-8" />
              <Calendar className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Fecha Fin (opcional)</label>
            <div className="relative">
              <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="pl-8" />
              <Calendar className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Buscar por código</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Ej. TrackingCode"
                value={filtroCodigo}
                onChange={(e) => { setFiltroCodigo(e.target.value); setPage(1); }}
                className="pl-8"
              />
              <Search className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Categoría</label>
            <Select value={filtroCategoria} onValueChange={(v) => { setFiltroCategoria(v); setPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Estado</label>
            <Select value={filtroEstado} onValueChange={(v) => { setFiltroEstado(v); setPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filas por página</span>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>Limpiar Filtros</Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cargas</p>
                <p className="text-2xl">{summary.totalCargos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-1/20 rounded-lg">
                <Clock className="h-6 w-6" style={{ color: "hsl(var(--chart-1))" }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promedio Estadía (general)</p>
                <p className="text-2xl">{summary.averageDaysOverall} días</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-2/20 rounded-lg">
                <WarehouseIcon className="h-6 w-6" style={{ color: "hsl(var(--chart-2))" }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cerradas / Abiertas</p>
                <p className="text-2xl">
                  {summary.closedCount} / {summary.openCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-3/20 rounded-lg">
                <Timer className="h-6 w-6" style={{ color: "hsl(var(--chart-3))" }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promedio Abiertas</p>
                <p className="text-2xl">{summary.averageDaysOpenOnly} días</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="bg-card rounded-lg p-6 mb-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-card-foreground">Análisis de Permanencia</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Promedio por Categoría */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Promedio de Días por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartDataCategoria}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="categoria" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="promedioDias" name="Promedio Días" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribución por Rangos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                Distribución por Rangos de Estadía
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={rangos}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, porcentaje }) => `${name}: ${porcentaje}%`}
                  >
                    {rangos.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tendencia */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendencia de Permanencia por Fecha de Ingreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartDataTemporal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="promedioDias"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  name="Promedio Días"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Details Table */}
      <div className="bg-card rounded-lg overflow-hidden border border-border">
        <div className="p-4 border-b border-border flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-card-foreground">Detalle de Permanencia por Carga</h3>

          {/* Controles de paginación */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={currentPage === 1}>
                «
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead>Fecha Salida</TableHead>
                <TableHead>Días en Almacén</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Almacén</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="text-primary font-mono text-xs">
                    {d.trackingCode ?? `CGX-${d.id.slice(0, 6)}`}
                  </TableCell>
                  <TableCell className="max-w-64">{d.description ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{d.category ?? "Sin categoría"}</Badge>
                  </TableCell>
                  <TableCell>{new Date(d.entryDate).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>{d.exitDate ? new Date(d.exitDate).toLocaleDateString("es-ES") : "En almacén"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={d.daysInWarehouse > 10 ? "destructive" : "secondary"}>
                      {d.daysInWarehouse} días
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadge(d.status)}>{d.status ?? "-"}</Badge>
                  </TableCell>
                  <TableCell>{d.warehouse?.name ?? "-"}</TableCell>
                </TableRow>
              ))}

              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No hay registros con los filtros actuales.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border text-center text-sm text-muted-foreground">
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
          <p>
            Sistema de Análisis de Permanencia — {filtered.length} cargas visibles (total:{" "}
            {summary.totalCargos})
          </p>
        </div>
      </div>
    </div>
  );
};
