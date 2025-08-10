import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  ChartTooltip,
  Skeleton,
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
  Legend,
  LabelList,
} from "recharts";
import {
  Package,
  Truck,
  Warehouse,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle,
  FileText,
  Shield,
  Thermometer,
} from "lucide-react";
import { useDashboardData } from "@/lib/dashboard";

type CargoPorEstado = {
  estado: string;
  cantidad: number;
  color: string;
};

type TipoEspecial = {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  color: string;
};

type Categoria = {
  nombre: string;
  cantidad: number;
  color: string;
};

export const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  if (isLoading) return <DashboardSkeleton />;
  if (error)
    return (
      <div className="p-6 text-destructive">Error al cargar los datos</div>
    );
  if (!dashboardData)
    return <div className="p-6">No hay datos disponibles</div>;

  const estadosData: CargoPorEstado[] =
    dashboardData.general.cargosPorEstado.map((item: any) => ({
      estado: item.estado.replace("_", " ").toUpperCase(),
      cantidad: item.cantidad,
      color:
        item.estado === "almacenado"
          ? "#3b82f6"
          : item.estado === "entregado" || item.estado === "entregada"
          ? "#1d4ed8"
          : item.estado === "en_transito"
          ? "#93c5fd"
          : "#60a5fa",
    }));

  const tiposEspecialesData: TipoEspecial[] = [
    {
      nombre: "Perecederos",
      cantidad: dashboardData.general.cargosPerecederos,
      porcentaje: dashboardData.general.porcentajeCargosPerecederos,
      color: "#3b82f6",
    },
    {
      nombre: "Peligrosos",
      cantidad: dashboardData.general.cargosPeligrosos,
      porcentaje: dashboardData.general.porcentajeCargosPeligrosos,
      color: "#1e40af",
    },
    {
      nombre: "Alto Valor",
      cantidad: dashboardData.general.cargosAltoValor,
      porcentaje: dashboardData.general.porcentajeCargosAltoValor,
      color: "#2563eb",
    },
  ];

  const categoriasData: Categoria[] = dashboardData.categorias.principales.map(
    (cat: any, index: number) => ({
      ...cat,
      color: index === 0 ? "#93c5fd" : index === 1 ? "#3b82f6" : "#1d4ed8",
    })
  );

  const almacenesDataConColor = dashboardData.ubicaciones.detalleAlmacenes.map(
    (almacen: any, index: number) => ({
      ...almacen,
      color: `hsl(${(index * 40) % 360}, 70%, 60%)`,
    })
  );

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      almacenado: "Almacenado",
      entregado: "Entregado",
      entregada: "Entregada",
      en_transito: "En Tránsito",
      en_revision: "En Revisión",
    };
    return labels[estado] || estado;
  };

  return (
    <div className="min-h-screen bg-background pl-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashbord en vivo</h1>
        <p className="text-slate-400 mt-1 sm:mt-2">
          Datos actuales del sistema de gestión de cargas
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-2 md:mt-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          Sistema conectado
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Clock className="h-3 w-3 md:h-4 md:w-4" />
          Actualizado: {new Date().toLocaleTimeString()}
        </div>
      </div>
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

        {/* KPIs Principales - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 pt-8">
          {renderKPICard(
            "Total Cargas",
            dashboardData.general.totalCargos,
            <Package className="h-4 w-4 text-muted-foreground" />,
            <Activity className="h-3 w-3" />,
            "Sistema activo"
          )}

          {renderKPICard(
            "Peso Total",
            `${(dashboardData.general.pesoTotalKg / 1000).toFixed(1)}T`,
            <TrendingUp className="h-4 w-4 text-muted-foreground" />,
            <ArrowUpRight className="h-3 w-3" />,
            `Promedio: ${dashboardData.general.pesoPromedioKg.toFixed(1)}kg`
          )}

          {renderKPICard(
            "Volumen Total",
            `${dashboardData.general.volumenTotalM3.toFixed(0)}m³`,
            <Package className="h-4 w-4 text-muted-foreground" />,
            <TrendingUp className="h-3 w-3" />,
            "Capacidad utilizada"
          )}

          {renderKPICard(
            "Alertas",
            dashboardData.alertas.activas,
            <AlertTriangle className="h-4 w-4 text-destructive" />,
            <Thermometer className="h-3 w-3" />,
            dashboardData.alertas.porTipo[0]?.tipo || "Sin alertas"
          )}

          {renderKPICard(
            "Almacenes",
            dashboardData.ubicaciones.totalAlmacenes,
            <Warehouse className="h-4 w-4 text-muted-foreground" />,
            <MapPin className="h-3 w-3" />,
            `${dashboardData.ubicaciones.porcentajeOcupacionColumnas.toFixed(
              1
            )}% ocupación`
          )}

          {renderKPICard(
            "Documentos",
            dashboardData.documentos.total,
            <FileText className="h-4 w-4 text-muted-foreground" />,
            <CheckCircle className="h-3 w-3" />,
            `${dashboardData.documentos.tipos.length} tipos`
          )}
        </div>

        {/* Gráficos principales - Mejorados para responsividad */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Estados de Cargas - Gráfico de Pie mejorado */}
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
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="w-full md:w-1/2 h-[250px] min-w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={estadosData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="cantidad"
                        animationDuration={500}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {estadosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: "0.75rem" }}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card p-3 border border-border rounded-lg shadow-lg text-sm">
                                <p className="font-semibold">{data.estado}</p>
                                <p>{data.cantidad} cargas</p>
                                <p>
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
                </div>
                <div className="w-full md:w-1/2 space-y-2 md:space-y-3">
                  {dashboardData.general.cargosPorEstado.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 md:p-3 bg-muted rounded-lg text-sm"
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: estadosData[index]?.color,
                            }}
                          />
                          <span className="font-medium">
                            {getEstadoLabel(item.estado)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.cantidad}</div>
                          <div className="text-xs text-muted-foreground">
                            {(
                              (item.cantidad /
                                dashboardData.general.totalCargos) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipos Especiales - Gráfico de Barras mejorado */}
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
            <CardContent className="p-4 md:p-6">
              <div className="h-[300px] md:h-[350px] min-w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tiposEspecialesData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
                    layout="vertical"
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
                      dataKey="nombre"
                      type="category"
                      width={80}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Bar
                      dataKey="cantidad"
                      fill="hsl(var(--chart-2))"
                      radius={[0, 4, 4, 0]}
                      animationDuration={1000}
                    >
                      <LabelList
                        dataKey="cantidad"
                        position="right"
                        formatter={(value: number) =>
                          `${value} (${(
                            (value / dashboardData.general.totalCargos) *
                            100
                          ).toFixed(1)}%)`
                        }
                        fontSize={12}
                      />
                    </Bar>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-3 border border-border rounded-lg shadow-lg text-sm">
                              <p className="font-semibold">{data.nombre}</p>
                              <p>Cantidad: {data.cantidad}</p>
                              <p>Porcentaje: {data.porcentaje.toFixed(1)}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segunda fila de gráficos - Mejorados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Ocupación por Almacén - Gráfico horizontal mejorado */}
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
            <CardContent className="p-4 md:p-6">
              <div className="h-[300px] md:h-[350px] min-w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.ubicaciones.detalleAlmacenes}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="nombre"
                      type="category"
                      width={100}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Bar
                      dataKey="ocupacion"
                      fill="hsl(var(--chart-4))"
                      radius={[0, 4, 4, 0]}
                      animationDuration={1000}
                    >
                      {almacenesDataConColor.map(
                        (entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        )
                      )}
                      <LabelList
                        dataKey="ocupacion"
                        position="right"
                        content={({ x, y, width, height, value, index }) => {
                          const safeIndex =
                            typeof index === "number" ? index : 0;
                          const color =
                            almacenesDataConColor[safeIndex]?.color || "#000"; // Color dinámico
                          return (
                            <text
                              x={Number(x) + Number(width) + 4}
                              y={Number(y) + Number(height) / 2}
                              fill={color}
                              textAnchor="start"
                              dominantBaseline="middle"
                              fontSize={12}
                              fontWeight="bold"
                            >
                              {`${Number(value).toFixed(1)}%`}
                            </text>
                          );
                        }}
                      />
                    </Bar>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card p-3 border border-border rounded-lg shadow-lg text-sm">
                              <p className="font-semibold">{data.nombre}</p>
                              <p>Ocupación: {data.ocupacion.toFixed(1)}%</p>
                              <p>Cargas: {data.cargas}</p>
                              <p>Peso: {(data.pesoKg / 1000).toFixed(1)}T</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Categorías Principales - Gráfico de Pie mejorado */}
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
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="w-full md:w-1/2 h-[250px] min-w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoriasData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="cantidad"
                        animationDuration={500}
                        label={({ nombre, cantidad }) =>
                          `${nombre}: ${cantidad}`
                        }
                        labelLine={false}
                      >
                        {categoriasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: "0.75rem" }}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card p-3 border border-border rounded-lg shadow-lg text-sm">
                                <p className="font-semibold">{data.nombre}</p>
                                <p>{data.cantidad} productos</p>
                                <p>
                                  {(
                                    (data.cantidad /
                                      dashboardData.categorias.total) *
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
                </div>
                <div className="w-full md:w-1/2 space-y-2 md:space-y-3">
                  {categoriasData.map((categoria, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 md:p-3 bg-muted rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: categoria.color }}
                        />
                        <span className="font-medium">{categoria.nombre}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="font-bold px-2 py-0.5 md:px-3 md:py-1"
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

        {/* Información detallada de almacenes - Mejorada para móviles */}
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
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {dashboardData.ubicaciones.detalleAlmacenes.map(
                (almacen: any, index: number) => (
                  <div
                    key={index}
                    className="bg-muted rounded-lg p-4 md:p-6 border border-border"
                  >
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <h3 className="font-bold text-sm md:text-base">
                        {almacen.nombre}
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-xs">Activo</span>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1 md:mb-2">
                          <span className="text-xs md:text-sm">Ocupación</span>
                          <span className="font-bold">
                            {almacen.ocupacion.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2 md:h-3">
                          <div
                            className={`h-2 md:h-3 rounded-full transition-all duration-500 ${
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
                        <div className="text-xs mt-1">
                          {almacen.ocupadas}/{almacen.columnas} columnas
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                        <div className="bg-card rounded-lg p-2 md:p-3 text-center border border-border">
                          <div>Cargas</div>
                          <div className="font-bold">{almacen.cargas}</div>
                        </div>
                        <div className="bg-card rounded-lg p-2 md:p-3 text-center border border-border">
                          <div>Peso</div>
                          <div className="font-bold">
                            {(almacen.pesoKg / 1000).toFixed(1)}T
                          </div>
                        </div>
                      </div>

                      <div className="bg-card rounded-lg p-2 md:p-3 border border-border">
                        <div className="flex justify-between items-center mb-1 md:mb-2">
                          <span className="text-xs md:text-sm">Volumen</span>
                          <span className="font-bold">
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

        {/* Documentos y Movimientos - Mejorados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h4 className="font-semibold text-sm md:text-base mb-2 md:mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-2" />
                    Entregas Completadas (
                    {dashboardData.movimientos.cargasEntregadas})
                  </h4>
                  <div className="space-y-2 md:space-y-3">
                    {dashboardData.movimientos.ultimasEntregas.map(
                      (entrega: any, index: number) => (
                        <div
                          key={index}
                          className="bg-muted border border-border rounded-lg p-3 md:p-4 text-sm"
                        >
                          <div className="flex items-center justify-between mb-1 md:mb-2">
                            <span className="font-medium">
                              {entrega.trackingCode}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              Entregado
                            </Badge>
                          </div>
                          <div>
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
                  <h4 className="font-semibold text-sm md:text-base mb-2 md:mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-chart-1" />
                    Transferencias (
                    {dashboardData.movimientos.totalTransferencias})
                  </h4>
                  <div className="bg-muted border border-border rounded-lg p-3 md:p-4 text-sm">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <span className="font-medium">TRK-2025-0001</span>
                      <Badge variant="outline" className="text-xs">
                        Transferido
                      </Badge>
                    </div>
                    <div>
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

// Componente auxiliar para renderizar tarjetas KPI
const renderKPICard = (
  title: string,
  value: string | number,
  icon: React.ReactNode,
  secondaryIcon: React.ReactNode,
  description: string
) => (
  <Card className="border-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-xl md:text-2xl font-bold text-foreground">
        {value}
      </div>
      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
        {secondaryIcon}
        {description}
      </p>
    </CardContent>
  </Card>
);

// Skeleton para loading state
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background p-6">
    <div className="max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-24 w-full" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-96" />
        ))}
      </div>

      <Skeleton className="h-64 w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  </div>
);
