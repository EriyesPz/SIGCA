import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Truck,
  Warehouse,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Activity,
  Download,
  ArrowUpRight,
  Clock,
  CheckCircle,
  FileText,
  Shield,
  Thermometer,
} from "lucide-react";
import { useDashboardData } from "@/lib/dashboard";

export const Dashboard = () => {
  const [selectedView, setSelectedView] = useState("general");
  const { data: dashboardData, isLoading, error } = useDashboardData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!dashboardData) return <div>No data available</div>;

  // Preparar datos para gráficos usando colores del tema
  type CargoPorEstado = {
    estado: string;
    cantidad: number;
    color: string;
  };

  const estadosData = dashboardData.general.cargosPorEstado.map((item: CargoPorEstado) => ({
    estado: item.estado.replace("_", " ").toUpperCase(),
    cantidad: item.cantidad,
    color:
      item.estado === "almacenado"
        ? "hsl(var(--chart-2))"
        : item.estado === "entregado" || item.estado === "entregada"
        ? "hsl(var(--chart-4))"
        : item.estado === "en_transito"
        ? "hsl(var(--chart-1))"
        : "hsl(var(--chart-3))",
  }));

  const tiposEspecialesData = [
    {
      nombre: "Perecederos",
      cantidad: dashboardData.general.cargosPerecederos,
      porcentaje: dashboardData.general.porcentajeCargosPerecederos,
      color: "hsl(var(--chart-2))",
    },
    {
      nombre: "Peligrosos",
      cantidad: dashboardData.general.cargosPeligrosos,
      porcentaje: dashboardData.general.porcentajeCargosPeligrosos,
      color: "hsl(var(--chart-5))",
    },
    {
      nombre: "Alto Valor",
      cantidad: dashboardData.general.cargosAltoValor,
      porcentaje: dashboardData.general.porcentajeCargosAltoValor,
      color: "hsl(var(--chart-3))",
    },
  ];

  type Categoria = {
    nombre: string;
    cantidad: number;
    color: string;
  };

  const categoriasData = dashboardData.categorias.principales.map(
    (cat: Categoria, index: number) => ({
      ...cat,
      color:
        index === 0
          ? "hsl(var(--chart-1))"
          : index === 1
          ? "hsl(var(--chart-2))"
          : "hsl(var(--chart-4))",
    })
  );

  const documentosData = dashboardData.documentos.tipos.map((doc: any, index: number) => ({
    ...doc,
    color: `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  const getEstadoLabel = (estado: string) => {
    const labels: { [key: string]: string } = {
      almacenado: "Almacenado",
      entregado: "Entregado",
      entregada: "Entregada",
      en_transito: "En Tránsito",
      en_revision: "En Revisión",
    };
    return labels[estado] || estado;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className="border-border shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-4xl font-bold text-foreground mb-3">
                  Sistema Logístico - Dashboard en Vivo
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Datos actuales del sistema de gestión de cargas
                </CardDescription>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    Sistema conectado
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Actualizado: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Select value={selectedView} onValueChange={setSelectedView}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Vista General</SelectItem>
                    <SelectItem value="almacenes">Almacenes</SelectItem>
                    <SelectItem value="movimientos">Movimientos</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cargas
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.general.totalCargos}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Activity className="h-3 w-3" />
                Sistema activo
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Peso Total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {(dashboardData.general.pesoTotalKg / 1000).toFixed(1)}T
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                Promedio: {dashboardData.general.pesoPromedioKg.toFixed(1)}kg
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Volumen Total
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.general.volumenTotalM3.toFixed(0)}m³
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                Capacidad utilizada
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alertas
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.alertas.activas}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Thermometer className="h-3 w-3" />
                {dashboardData.alertas.porTipo[0]?.tipo || "Sin alertas"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Almacenes
              </CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.ubicaciones.totalAlmacenes}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {dashboardData.ubicaciones.porcentajeOcupacionColumnas.toFixed(
                  1
                )}
                % ocupación
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Documentos
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.documentos.total}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <CheckCircle className="h-3 w-3" />
                {dashboardData.documentos.tipos.length} tipos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Estados de Cargas */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                Estados de Cargas
              </CardTitle>
              <CardDescription>
                Distribución actual por estado (
                {dashboardData.general.totalCargos} total)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartContainer
                  config={{
                    cantidad: { label: "Cantidad" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={estadosData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="cantidad"
                      >
                        {estadosData.map((entry: CargoPorEstado, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
                                <p className="font-semibold text-card-foreground">
                                  {data.estado}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {data.cantidad} cargas
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {(
                                    (data.cantidad /
                                      dashboardData.general.totalCargos) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="space-y-3">
                  {dashboardData.general.cargosPorEstado.map((item: CargoPorEstado, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: estadosData[index]?.color }}
                        />
                        <span className="font-medium text-foreground">
                          {getEstadoLabel(item.estado)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground">
                          {item.cantidad}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(
                            (item.cantidad /
                              dashboardData.general.totalCargos) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipos Especiales */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Shield className="h-5 w-5 text-secondary-foreground" />
                </div>
                Tipos Especiales de Carga
              </CardTitle>
              <CardDescription>
                Cargas que requieren manejo especial
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer
                config={{
                  cantidad: { label: "Cantidad", color: "hsl(var(--chart-2))" },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tiposEspecialesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="nombre"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-4 border border-border rounded-lg shadow-lg">
                              <p className="font-semibold text-card-foreground">
                                {label}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Cantidad: {data.cantidad}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Porcentaje: {data.porcentaje.toFixed(1)}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="cantidad"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                      name="Cantidad"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Segunda fila de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ocupación por Almacén */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-3">
                <div className="p-2 bg-accent rounded-lg">
                  <Warehouse className="h-5 w-5 text-accent-foreground" />
                </div>
                Ocupación por Almacén
              </CardTitle>
              <CardDescription>
                Porcentaje de ocupación y capacidad por almacén
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer
                config={{
                  ocupacion: {
                    label: "Ocupación %",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.ubicaciones.detalleAlmacenes}
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      type="number"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="nombre"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={90}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-4 border border-border rounded-lg shadow-lg">
                              <p className="font-semibold text-card-foreground">
                                {label}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Ocupación: {data.ocupacion.toFixed(1)}%
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Cargas: {data.cargas}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Peso: {(data.pesoKg / 1000).toFixed(1)}T
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="ocupacion"
                      fill="hsl(var(--chart-4))"
                      radius={[0, 4, 4, 0]}
                      name="Ocupación %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Categorías Principales */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                Categorías Principales
              </CardTitle>
              <CardDescription>
                Top 3 categorías de productos ({dashboardData.categorias.total}{" "}
                total)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartContainer
                  config={{
                    cantidad: { label: "Cantidad" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoriasData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="cantidad"
                        label={({ nombre, cantidad }) =>
                          `${nombre}: ${cantidad}`
                        }
                        labelLine={false}
                      >
                        {categoriasData.map((entry: Categoria, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
                                <p className="font-semibold text-card-foreground">
                                  {data.nombre}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {data.cantidad} productos
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="space-y-4">
                  {categoriasData.map((categoria: Categoria, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: categoria.color }}
                        />
                        <span className="font-medium text-foreground">
                          {categoria.nombre}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="font-bold text-lg px-3 py-1"
                      >
                        {categoria.cantidad}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información detallada de almacenes */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Warehouse className="h-5 w-5 text-secondary-foreground" />
              </div>
              Detalle Completo de Almacenes
            </CardTitle>
            <CardDescription>
              Información detallada de capacidad, peso y volumen por almacén
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dashboardData.ubicaciones.detalleAlmacenes.map(
                (almacen: any, index: number) => (
                  <div
                    key={index}
                    className="bg-muted rounded-lg p-6 border border-border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-foreground text-sm">
                        {almacen.nombre}
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-xs text-muted-foreground">
                          Activo
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">
                            Ocupación
                          </span>
                          <span className="font-bold text-foreground">
                            {almacen.ocupacion.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-border rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              almacen.ocupacion > 15
                                ? "bg-destructive"
                                : almacen.ocupacion > 10
                                ? "bg-chart-3"
                                : "bg-chart-2"
                            }`}
                            style={{
                              width: `${Math.min(almacen.ocupacion * 5, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {almacen.ocupadas}/{almacen.columnas} columnas
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-card rounded-lg p-3 text-center border border-border">
                          <div className="text-muted-foreground">Cargas</div>
                          <div className="font-bold text-foreground">
                            {almacen.cargas}
                          </div>
                        </div>
                        <div className="bg-card rounded-lg p-3 text-center border border-border">
                          <div className="text-muted-foreground">Peso</div>
                          <div className="font-bold text-foreground">
                            {(almacen.pesoKg / 1000).toFixed(1)}T
                          </div>
                        </div>
                      </div>

                      <div className="bg-card rounded-lg p-3 border border-border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">
                            Volumen
                          </span>
                          <span className="font-bold text-foreground">
                            {almacen.volumenM3.toFixed(0)}m³
                          </span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2">
                          <div
                            className="bg-chart-4 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (almacen.volumenM3 / 1200) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documentos y Movimientos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tipos de Documentos */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-3">
                <div className="p-2 bg-accent rounded-lg">
                  <FileText className="h-5 w-5 text-accent-foreground" />
                </div>
                Documentos por Tipo
              </CardTitle>
              <CardDescription>
                Distribución de documentos en el sistema (
                {dashboardData.documentos.total} total)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer
                config={{
                  cantidad: { label: "Cantidad", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={documentosData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="tipo"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="cantidad"
                      fill="hsl(var(--chart-1))"
                      radius={[4, 4, 0, 0]}
                      name="Cantidad"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Últimas Entregas */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Truck className="h-5 w-5 text-primary-foreground" />
                </div>
                Actividad Reciente
              </CardTitle>
              <CardDescription>
                Últimas entregas y transferencias del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-2" />
                    Entregas Completadas (
                    {dashboardData.movimientos.cargasEntregadas})
                  </h4>
                  <div className="space-y-3">
                    {dashboardData.movimientos.ultimasEntregas.map(
                      (entrega: {
                        trackingCode: string;
                        recibidoPor: string;
                        fechaEntrega: string | number | Date;
                      }, index: number) => (
                        <div
                          key={index}
                          className="bg-muted border border-border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">
                              {entrega.trackingCode}
                            </span>
                            <Badge variant="secondary">Entregado</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>
                              Recibido por:{" "}
                              <span className="font-medium">
                                {entrega.recibidoPor}
                              </span>
                            </p>
                            <p>
                              Fecha:{" "}
                              {new Date(
                                entrega.fechaEntrega
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-chart-1" />
                    Transferencias (
                    {dashboardData.movimientos.totalTransferencias})
                  </h4>
                  <div className="bg-muted border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">
                        TRK-2025-0001
                      </span>
                      <Badge variant="outline">Transferido</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>De: Carga General → A: Carga General</p>
                      <p>Fecha: 22/07/2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
