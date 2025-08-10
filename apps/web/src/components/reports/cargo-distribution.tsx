import { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from "@/components/ui";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Filter,
  RotateCcw,
  Package,
  Warehouse as WarehouseIcon,
  Archive,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { generatePDF } from "@/utils/pdfExport";
import { generateExcelReport } from "@/utils/excelExport";
import { useDistributionByLocationReport } from "@/lib/reports";

// helper: badge según % de utilización
const getUtilizacionBadge = (utilizacionPercent: number) => {
  if (utilizacionPercent >= 80)
    return { variant: "destructive" as const, text: "Alta" };
  if (utilizacionPercent >= 60)
    return { variant: "default" as const, text: "Media" };
  return { variant: "secondary" as const, text: "Baja" };
};

// columnas para PDF
const columnsDistribution = [
  { header: "Código", accessor: "codigo" },
  { header: "Descripción", accessor: "descripcion" },
  { header: "Almacén", accessor: "almacen" },
  { header: "Rack", accessor: "rack" },
  { header: "Nivel", accessor: "nivel" },
  { header: "Columna", accessor: "columna" },
  { header: "Categoría", accessor: "categoria" },
  { header: "Cantidad", accessor: "cantidad" },
  { header: "Capacidad", accessor: "capacidad" },
  {
    header: "Utilización",
    accessor: "utilizacionPercent",
    render: (_: number, row: any) =>
      `${row.utilizacionPercent}% - ${row.utilizacionLevel}`,
  },
  {
    header: "Fecha",
    accessor: "fecha",
    render: (v: string) =>
      new Date(v).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  { header: "Responsable", accessor: "responsable" },
];

// formatea a YYYY-MM-DD o undefined
const toYMD = (s: string) =>
  s ? new Date(s).toISOString().slice(0, 10) : undefined;

export const DistributionCargo = () => {
  // fechas opcionales
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const warehouseId: string | undefined = undefined;

  // PAGINACIÓN (cliente)
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // hook al backend
  const { data, isLoading, error } = useDistributionByLocationReport({
    from: toYMD(fechaInicio),
    to: toYMD(fechaFin),
    warehouseId,
  });

  // normaliza la data
  const rows = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  // KPIs
  const summary = useMemo(() => {
    const total = rows.length;
    const ocupadas = rows.filter(
      (r: any) => Number(r.cantidad ?? 0) > 0
    ).length;
    const disponibles = total - ocupadas;

    const avg =
      total > 0
        ? rows.reduce(
            (acc: number, r: any) => acc + Number(r.utilizacionPercent ?? 0),
            0
          ) / total
        : 0;

    return {
      total,
      ocupadas,
      disponibles,
      utilizacionPromedio: Math.round(avg),
    };
  }, [rows]);

  // Derivados de paginación
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(rows.length, startIndex + pageSize);
  const pagedRows = useMemo(
    () => rows.slice(startIndex, endIndex),
    [rows, startIndex, endIndex]
  );

  // Resetear página cuando cambian filtros, data o pageSize
  useEffect(() => {
    setPage(1);
  }, [fechaInicio, fechaFin, pageSize, rows.length]);

  const resetFilters = () => {
    setFechaInicio("");
    setFechaFin("");
  };

  const onDownloadPdf = () => {
    generatePDF(
      "Distribución por Ubicación",
      columnsDistribution,
      rows, // exporta todo, no solo la página actual
      `Total ubicaciones: ${summary.total}\nOcupadas: ${summary.ocupadas}\nDisponibles: ${summary.disponibles}\nUtilización Promedio: ${summary.utilizacionPromedio}%`,
      `• Reubicar exceso en racks con utilización alta.\n• Verificar niveles con sobrecarga.\n• Considerar redistribución en columnas poco usadas.`,
      fechaInicio && fechaFin
        ? `${toYMD(fechaInicio)} - ${toYMD(fechaFin)}`
        : "Sin rango de fechas"
    );
  };

  const onDownloadExcel = () => {
    const excelRows = rows.map((r: any) => ({
      Código: r.codigo,
      Descripción: r.descripcion,
      Almacén: r.almacen,
      Rack: r.rack,
      Nivel: r.nivel,
      Columna: r.columna,
      Categoría: r.categoria,
      Cantidad: r.cantidad,
      Capacidad: r.capacidad,
      "Utilización (%)": r.utilizacionPercent,
      "Nivel Utilización": r.utilizacionLevel,
      Fecha: r.fecha,
      Responsable: r.responsable,
    }));
    generateExcelReport(excelRows, "reporte_distribucion_ubicacion");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="max-w-7xl mx-auto">
          <p className="text-muted-foreground">Cargando reporte…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">Error al cargar el reporte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">
                  Reporte de Distribución por Ubicación
                </h1>
                <p className="text-muted-foreground">
                  Análisis de Rack, Nivel y Columna •{" "}
                  {fechaInicio && fechaFin
                    ? `${toYMD(fechaInicio)} - ${toYMD(fechaFin)}`
                    : "Sin rango de fechas"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              
              <Button
                size="sm"
                onClick={onDownloadPdf}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>

              <Button variant="outline" size="sm" onClick={onDownloadExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Descargar Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-foreground">
              Filtros de Distribución por Ubicación
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Fecha Inicio (opcional)
              </label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Fecha Fin (opcional)
              </label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Tamaño de página
              </label>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filas por página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={resetFilters}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-600 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground">Total Ubicaciones</p>
                  <p className="text-2xl">{summary.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <WarehouseIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground">Ocupadas</p>
                  <p className="text-2xl">{summary.ocupadas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Archive className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground">Disponibles</p>
                  <p className="text-2xl">{summary.disponibles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground">Utilización Promedio</p>
                  <p className="text-2xl">{summary.utilizacionPromedio}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Detalle */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-foreground">
              Detalle de Distribución por Ubicación
            </h3>
            <div className="text-sm text-muted-foreground">
              {rows.length > 0 ? (
                <>
                  Mostrando <strong>{startIndex + 1}</strong>–
                  <strong>{endIndex}</strong> de <strong>{rows.length}</strong>
                </>
              ) : (
                "Sin registros"
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead>Código</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Almacén</TableHead>
                  <TableHead>Rack</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Columna</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Utilización</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Responsable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedRows.map((item: any, index: number) => {
                  const b = getUtilizacionBadge(
                    Number(item.utilizacionPercent ?? 0)
                  );
                  return (
                    <TableRow
                      key={item.codigo ?? index}
                      className="border-border hover:bg-muted/50"
                    >
                      <TableCell>{item.codigo}</TableCell>
                      <TableCell>{item.descripcion}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-yellow-600 border-yellow-600 dark:text-yellow-400 dark:border-yellow-400"
                        >
                          {item.almacen}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                        >
                          {item.rack}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
                        >
                          {item.nivel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-purple-600 border-purple-600 dark:text-purple-400 dark:border-purple-400"
                        >
                          {item.columna}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>{item.capacidad}</TableCell>
                      <TableCell>
                        <Badge variant={b.variant}>
                          {item.utilizacionPercent}% - {item.utilizacionLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(item.fecha).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>{item.responsable}</TableCell>
                    </TableRow>
                  );
                })}
                {pagedRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="text-center text-muted-foreground"
                    >
                      No hay registros para los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
