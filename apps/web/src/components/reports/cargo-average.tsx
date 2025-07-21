import { useState } from "react";
import {
  Filter,
  Download,
  Calendar,
  Search,
  Clock,
  Package,
  Warehouse,
  BarChart3,
  TrendingUp,
  Eye,
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

interface CargaPermanencia {
  codigo: string;
  descripcion: string;
  categoria: string;
  peso: number;
  cantidad: number;
  fechaIngreso: string;
  fechaSalida: string | null;
  diasEnAlmacen: number;
  estado: "En Almacén" | "Despachado" | "En Proceso" | "Retenido";
  ubicacion: string;
  motivoRetencion: string;
  cliente: string;
  valorMercancia: number;
  costoAlmacenaje: number;
  responsableAlmacen: string;
  prioridad: "Alta" | "Media" | "Baja";
  fechaVencimiento: string;
  observaciones: string;
  numeroGuia: string;
  transportista: string;
}

const cargasPermanencia: CargaPermanencia[] = [
  {
    codigo: "ALM-2024-001",
    descripcion: "Textiles importados - Camisetas de algodón x200 unidades",
    categoria: "Textiles",
    peso: 85.5,
    cantidad: 200,
    fechaIngreso: "10/1/2024",
    fechaSalida: "18/1/2024",
    diasEnAlmacen: 8,
    estado: "Despachado",
    ubicacion: "A1-2-3",
    motivoRetencion: "Documentación comercial pendiente",
    cliente: "Textiles del Norte SAC",
    valorMercancia: 15000,
    costoAlmacenaje: 240,
    responsableAlmacen: "Carlos Mendoza",
    prioridad: "Media",
    fechaVencimiento: "25/1/2024",
    observaciones: "Cliente regularizó documentos",
    numeroGuia: "GR-2024-001",
    transportista: "Transportes Rápidos SA",
  },
  {
    codigo: "ALM-2024-002",
    descripcion: "Electrónicos - Laptops Dell x50 unidades",
    categoria: "Electrónicos",
    peso: 125.0,
    cantidad: 50,
    fechaIngreso: "12/1/2024",
    fechaSalida: null,
    diasEnAlmacen: 9,
    estado: "En Almacén",
    ubicacion: "B3-1-5",
    motivoRetencion: "Esperando autorización de importación",
    cliente: "TechWorld Perú EIRL",
    valorMercancia: 75000,
    costoAlmacenaje: 675,
    responsableAlmacen: "María González",
    prioridad: "Alta",
    fechaVencimiento: "30/1/2024",
    observaciones: "Productos en zona de alta seguridad",
    numeroGuia: "GR-2024-002",
    transportista: "Global Logistics SAC",
  },
  {
    codigo: "ALM-2024-003",
    descripcion: "Alimentos procesados - Conservas de pescado x500 latas",
    categoria: "Alimentos",
    peso: 200.3,
    cantidad: 500,
    fechaIngreso: "8/1/2024",
    fechaSalida: "20/1/2024",
    diasEnAlmacen: 12,
    estado: "Despachado",
    ubicacion: "C2-3-1",
    motivoRetencion: "Inspección sanitaria SENASA",
    cliente: "Distribuidora Marina SA",
    valorMercancia: 12500,
    costoAlmacenaje: 300,
    responsableAlmacen: "Luis Fernández",
    prioridad: "Alta",
    fechaVencimiento: "22/1/2024",
    observaciones: "Certificado sanitario aprobado",
    numeroGuia: "GR-2024-003",
    transportista: "Cold Chain Express",
  },
  {
    codigo: "ALM-2024-004",
    descripcion: "Maquinaria industrial - Motores eléctricos x10 unidades",
    categoria: "Maquinaria",
    peso: 850.0,
    cantidad: 10,
    fechaIngreso: "5/1/2024",
    fechaSalida: null,
    diasEnAlmacen: 16,
    estado: "Retenido",
    ubicacion: "D1-1-1",
    motivoRetencion: "Disputa comercial con proveedor",
    cliente: "Industrias Manufactureras SAA",
    valorMercancia: 95000,
    costoAlmacenaje: 1520,
    responsableAlmacen: "Ana Martínez",
    prioridad: "Media",
    fechaVencimiento: "28/1/2024",
    observaciones: "En proceso legal - retención judicial",
    numeroGuia: "GR-2024-004",
    transportista: "Heavy Cargo Transport",
  },
  {
    codigo: "ALM-2024-005",
    descripcion: "Productos farmacéuticos - Antibióticos x100 cajas",
    categoria: "Farmacéuticos",
    peso: 45.8,
    cantidad: 100,
    fechaIngreso: "14/1/2024",
    fechaSalida: "19/1/2024",
    diasEnAlmacen: 5,
    estado: "Despachado",
    ubicacion: "E1-2-4",
    motivoRetencion: "Verificación lote y vencimientos",
    cliente: "Farmacias Unidas SA",
    valorMercancia: 25000,
    costoAlmacenaje: 125,
    responsableAlmacen: "Roberto Silva",
    prioridad: "Alta",
    fechaVencimiento: "21/1/2024",
    observaciones: "Despacho prioritario por fecha de vencimiento",
    numeroGuia: "GR-2024-005",
    transportista: "Pharma Logistics",
  },
  {
    codigo: "ALM-2024-006",
    descripcion: "Autopartes - Llantas Michelin x80 unidades",
    categoria: "Autopartes",
    peso: 960.0,
    cantidad: 80,
    fechaIngreso: "15/1/2024",
    fechaSalida: null,
    diasEnAlmacen: 6,
    estado: "En Proceso",
    ubicacion: "F2-1-3",
    motivoRetencion: "Verificación de autenticidad",
    cliente: "Automotriz Continental SAC",
    valorMercancia: 48000,
    costoAlmacenaje: 288,
    responsableAlmacen: "Patricia Ramos",
    prioridad: "Media",
    fechaVencimiento: "29/1/2024",
    observaciones: "Esperando certificado del fabricante",
    numeroGuia: "GR-2024-006",
    transportista: "Auto Transport Plus",
  },
  {
    codigo: "ALM-2024-007",
    descripcion: "Productos químicos - Pinturas industriales x30 tambores",
    categoria: "Químicos",
    peso: 750.0,
    cantidad: 30,
    fechaIngreso: "9/1/2024",
    fechaSalida: null,
    diasEnAlmacen: 12,
    estado: "En Almacén",
    ubicacion: "G1-3-2",
    motivoRetencion: "Permiso de almacenamiento especial",
    cliente: "Pinturas Industriales SA",
    valorMercancia: 18000,
    costoAlmacenaje: 540,
    responsableAlmacen: "José Torres",
    prioridad: "Baja",
    fechaVencimiento: "02/2/2024",
    observaciones: "Requiere zona especializada para químicos",
    numeroGuia: "GR-2024-007",
    transportista: "Chemical Safe Transport",
  },
  {
    codigo: "ALM-2024-008",
    descripcion: "Cosméticos importados - Productos de belleza x300 unidades",
    categoria: "Cosméticos",
    peso: 120.5,
    cantidad: 300,
    fechaIngreso: "16/1/2024",
    fechaSalida: "21/1/2024",
    diasEnAlmacen: 5,
    estado: "Despachado",
    ubicacion: "H2-2-1",
    motivoRetencion: "Registro sanitario DIGEMID",
    cliente: "Beauty Store Chain SA",
    valorMercancia: 22000,
    costoAlmacenaje: 110,
    responsableAlmacen: "Elena Vargas",
    prioridad: "Media",
    fechaVencimiento: "26/1/2024",
    observaciones: "Despacho normal tras aprobación",
    numeroGuia: "GR-2024-008",
    transportista: "Beauty Logistics",
  },
];

export const CargoAverage = () => {
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("05/1/2024");
  const [filtroFechaFin, setFiltroFechaFin] = useState("21/1/2024");
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [] = useState("todos");

  const cargasFiltradas = cargasPermanencia.filter((carga) => {
    return (
      filtroCodigo === "" ||
      carga.codigo.toLowerCase().includes(filtroCodigo.toLowerCase())
    );
  });

  const totalCargas = cargasFiltradas.length;
  const promedioEstadia =
    cargasFiltradas.reduce((sum, carga) => sum + carga.diasEnAlmacen, 0) /
    totalCargas;
  const costoTotalAlmacenaje = cargasFiltradas.reduce(
    (sum, carga) => sum + carga.costoAlmacenaje,
    0
  );
  const cargasEnAlmacen = cargasFiltradas.filter(
    (carga) => carga.estado === "En Almacén" || carga.estado === "Retenido"
  ).length;

  // Datos para gráficos
  const datosPorCategoria = cargasFiltradas.reduce((acc, carga) => {
    if (!acc[carga.categoria]) {
      acc[carga.categoria] = { total: 0, dias: 0, count: 0 };
    }
    acc[carga.categoria].dias += carga.diasEnAlmacen;
    acc[carga.categoria].count += 1;
    acc[carga.categoria].total =
      acc[carga.categoria].dias / acc[carga.categoria].count;
    return acc;
  }, {} as Record<string, { total: number; dias: number; count: number }>);

  const chartDataCategoria = Object.entries(datosPorCategoria).map(
    ([categoria, data]) => ({
      categoria: categoria,
      promedioDias: Math.round(data.total * 10) / 10,
      totalCargas: data.count,
    })
  );

  // Datos temporales para tendencia
  const datosTemporales = cargasFiltradas
    .map((carga) => {
      return {
        fecha: carga.fechaIngreso,
        dia: parseInt(carga.fechaIngreso.split("/")[0]),
        diasEnAlmacen: carga.diasEnAlmacen,
        costo: carga.costoAlmacenaje,
      };
    })
    .sort((a, b) => a.dia - b.dia);

  const chartDataTemporal = datosTemporales.reduce((acc, item) => {
    const existe = acc.find((d) => d.dia === item.dia);
    if (existe) {
      existe.totalDias += item.diasEnAlmacen;
      existe.totalCosto += item.costo;
      existe.cantidad += 1;
      existe.promedioDias = existe.totalDias / existe.cantidad;
    } else {
      acc.push({
        dia: `${item.dia}/1`,
        totalDias: item.diasEnAlmacen,
        cantidad: 1,
        promedioDias: item.diasEnAlmacen,
        totalCosto: item.costo,
      });
    }
    return acc;
  }, [] as any[]);

  // Distribución por rangos de días
  const rangosEstadia = cargasFiltradas.reduce((acc, carga) => {
    const dias = carga.diasEnAlmacen;
    let rango;
    if (dias <= 3) rango = "1-3 días";
    else if (dias <= 7) rango = "4-7 días";
    else if (dias <= 14) rango = "8-14 días";
    else rango = "15+ días";

    acc[rango] = (acc[rango] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataRangos = Object.entries(rangosEstadia).map(
    ([rango, cantidad]) => ({
      name: rango,
      value: cantidad,
      porcentaje: ((cantidad / totalCargas) * 100).toFixed(1),
    })
  );

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "En Almacén":
        return "default";
      case "Despachado":
        return "secondary";
      case "En Proceso":
        return "secondary";
      case "Retenido":
        return "destructive";
      default:
        return "default";
    }
  };

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "destructive";
      case "Media":
        return "default";
      case "Baja":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-6 border border-border">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-3xl text-foreground">Promedio de Permanencia</h1>
        </div>
        <p className="text-muted-foreground">
          Análisis detallado de tiempos de estadía y rotación de inventario en
          almacén
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-card rounded-lg p-4 mb-6 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-card-foreground">
                Reporte de Permanencia en Almacén
              </h3>
              <p className="text-sm text-muted-foreground">
                {totalCargas} cargas analizadas • {filtroFechaInicio} -{" "}
                {filtroFechaFin}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Vista previa
            </Button>
            <Button variant="default" size="sm">
              Generar reporte
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-6 mb-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-card-foreground">
            Filtros de Análisis de Permanencia
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1 text-foreground">
              Fecha Inicio
            </label>
            <div className="relative">
              <Input
                type="text"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="pl-8"
              />
              <Calendar className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-foreground">
              Fecha Fin
            </label>
            <div className="relative">
              <Input
                type="text"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="pl-8"
              />
              <Calendar className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-foreground">
              Código de Carga
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por código..."
                value={filtroCodigo}
                onChange={(e) => setFiltroCodigo(e.target.value)}
                className="pl-8"
              />
              <Search className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-foreground">
              Categoría
            </label>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las categorías</SelectItem>
                <SelectItem value="textiles">Textiles</SelectItem>
                <SelectItem value="electronicos">Electrónicos</SelectItem>
                <SelectItem value="alimentos">Alimentos</SelectItem>
                <SelectItem value="maquinaria">Maquinaria</SelectItem>
                <SelectItem value="farmaceuticos">Farmacéuticos</SelectItem>
                <SelectItem value="autopartes">Autopartes</SelectItem>
                <SelectItem value="quimicos">Químicos</SelectItem>
                <SelectItem value="cosmeticos">Cosméticos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-foreground">Estado</label>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="enalmacen">En Almacén</SelectItem>
                <SelectItem value="despachado">Despachado</SelectItem>
                <SelectItem value="enproceso">En Proceso</SelectItem>
                <SelectItem value="retenido">Retenido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline">Limpiar Filtros</Button>
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
                <p className="text-2xl">{totalCargas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-1/20 rounded-lg">
                <Clock
                  className="h-6 w-6"
                  style={{ color: "hsl(var(--chart-1))" }}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Promedio Estadía
                </p>
                <p className="text-2xl">
                  {Math.round(promedioEstadia * 10) / 10} días
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-2/20 rounded-lg">
                <Warehouse
                  className="h-6 w-6"
                  style={{ color: "hsl(var(--chart-2))" }}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Costo Total Almacenaje
                </p>
                <p className="text-2xl">
                  S/ {costoTotalAlmacenaje.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-3/20 rounded-lg">
                <Timer
                  className="h-6 w-6"
                  style={{ color: "hsl(var(--chart-3))" }}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Cargas en Almacén
                </p>
                <p className="text-2xl">{cargasEnAlmacen}</p>
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
          {/* Gráfico de Promedio por Categoría */}
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />

                  <XAxis
                    dataKey="categoria"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />

                  {/* Cada <Cell> asigna un color distinto a su barra */}
                  <Bar dataKey="promedioDias" name="Promedio Días">
                    {chartDataCategoria.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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
                    data={chartDataRangos}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, porcentaje }) => `${name}: ${porcentaje}%`}
                  >
                    {chartDataRangos.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

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
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="dia"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="promedioDias"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                  name="Promedio Días"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Details Table */}
      <div className="bg-card rounded-lg overflow-hidden border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-card-foreground">
            Detalle de Permanencia por Carga
          </h3>
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
                <TableHead>Ubicación</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor Mercancía</TableHead>
                <TableHead>Costo Almacenaje</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Motivo Retención</TableHead>
                <TableHead>Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargasFiltradas.map((carga) => (
                <TableRow key={carga.codigo}>
                  <TableCell className="text-primary">{carga.codigo}</TableCell>
                  <TableCell className="max-w-64">
                    {carga.descripcion}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{carga.categoria}</Badge>
                  </TableCell>
                  <TableCell>{carga.fechaIngreso}</TableCell>
                  <TableCell>{carga.fechaSalida || "En almacén"}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        carga.diasEnAlmacen > 10 ? "destructive" : "secondary"
                      }
                    >
                      {carga.diasEnAlmacen} días
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadge(carga.estado)}>
                      {carga.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{carga.ubicacion}</TableCell>
                  <TableCell className="min-w-48 text-xs">
                    {carga.cliente}
                  </TableCell>
                  <TableCell>
                    S/ {carga.valorMercancia.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    S/ {carga.costoAlmacenaje.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPrioridadBadge(carga.prioridad)}>
                      {carga.prioridad}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs">
                      {carga.responsableAlmacen
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-xs">{carga.responsableAlmacen}</span>
                  </TableCell>
                  <TableCell className="max-w-48 text-xs">
                    {carga.motivoRetencion}
                  </TableCell>
                  <TableCell
                    className="max-w-64 text-xs"
                    title={carga.observaciones}
                  >
                    {carga.observaciones.length > 50
                      ? `${carga.observaciones.substring(0, 50)}...`
                      : carga.observaciones}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-border text-center text-sm text-muted-foreground">
          <p>Reporte generado el 21 de julio de 2025, 11:30</p>
          <p>
            Sistema de Análisis de Permanencia - {totalCargas} cargas procesadas
          </p>
        </div>
      </div>
    </div>
  );
};
