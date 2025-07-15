import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
} from "lucide-react";
import {
  ActivityChart,
  AlertsPanel,
  MaintenanceScheduleCard,
  MetricCard,
  PerformanceMetrics,
  QuickActions,
  RecentActivityList,
  StaffMetricsCard,
  WarehouseOccupancyCard,
  WeatherWidget,
} from "@/components/dashboard";
import {
  mockDashboardMetrics,
  mockRecentActivity,
  mockWarehouseOccupancy,
  mockDailyActivity,
  mockAlerts,
  mockPerformanceMetrics,
  mockWeatherData,
  mockStaffMetrics,
  mockMaintenanceSchedule,
  mockInventoryMetrics,
  mockSecurityMetrics,
  mockCostAnalysis,
} from "@/data/dashboard-data";

export const  Dashboard = () => {
  const handleRefresh = () => {
    console.log("Actualizando dashboard...");
    // Aquí iría la lógica para refrescar los datos
  };

  const handleExport = () => {
    console.log("Exportando dashboard...");
    // Aquí iría la lógica para exportar el dashboard
  };

  const currentTime = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className= "border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Dashboard Ejecutivo
                </h1>
                <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
                  Sistema Activo
                </Badge>
              </div>
              <p className="text-gray-600">
                Panel de control integral del sistema de gestión de almacén
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Última actualización: {currentTime}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="operations">Operaciones</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total de Cargas"
                value={mockDashboardMetrics.totalCargo.toLocaleString()}
                change={8.2}
                changeType="increase"
                icon="package"
                color="text-blue-600"
                subtitle="En el sistema"
                target={1500}
                showProgress={true}
                description="Número total de cargas registradas en el sistema de gestión"
              />
              <MetricCard
                title="Cargas Almacenadas"
                value={mockDashboardMetrics.cargoStored.toLocaleString()}
                change={5.1}
                changeType="increase"
                icon="warehouse"
                color="text-green-600"
                subtitle="Actualmente"
                target={1200}
                showProgress={true}
                description="Cargas actualmente almacenadas en las instalaciones"
              />
              <MetricCard
                title="En Tránsito"
                value={mockDashboardMetrics.cargoInTransit}
                change={-2.3}
                changeType="decrease"
                icon="truck"
                color="text-orange-600"
                subtitle="Movimientos activos"
                target={100}
                showProgress={true}
                description="Cargas en proceso de traslado o movimiento"
              />
              <MetricCard
                title="Eficiencia Operativa"
                value={`${mockDashboardMetrics.efficiency}%`}
                change={2.3}
                changeType="increase"
                icon="target"
                color="text-purple-600"
                subtitle="Rendimiento general"
                target={95}
                unit="%"
                showProgress={true}
                description="Eficiencia general del sistema operativo"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Peso Total"
                value={`${(mockDashboardMetrics.totalWeight / 1000).toFixed(
                  1
                )}t`}
                change={12.7}
                changeType="increase"
                icon="weight"
                color="text-indigo-600"
                subtitle="Toneladas almacenadas"
                description="Peso total de todas las cargas en el sistema"
              />
              <MetricCard
                title="Personal Activo"
                value={mockStaffMetrics.activeStaff}
                change={5.2}
                changeType="increase"
                icon="users"
                color="text-cyan-600"
                subtitle={`de ${mockStaffMetrics.totalStaff} total`}
                description="Personal actualmente trabajando en las instalaciones"
              />
              <MetricCard
                title="Alertas Críticas"
                value={mockDashboardMetrics.criticalAlerts}
                change={-15.8}
                changeType="decrease"
                icon="alert"
                color="text-red-600"
                subtitle="Requieren atención"
                description="Alertas críticas que requieren atención inmediata"
              />
              <MetricCard
                title="Tiempo de Actividad"
                value={`${mockDashboardMetrics.systemUptime}%`}
                change={0.2}
                changeType="increase"
                icon="activity"
                color="text-emerald-600"
                subtitle="Sistema operativo"
                description="Porcentaje de tiempo que el sistema ha estado operativo"
              />
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityChart data={mockDailyActivity} />
              <WarehouseOccupancyCard warehouses={mockWarehouseOccupancy} />
            </div>

            {/* Recent Activity and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivityList activities={mockRecentActivity} />
              <AlertsPanel alerts={mockAlerts} />
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            {/* Operational Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Ingresos Hoy"
                value={mockDashboardMetrics.dailyEntries}
                change={15.2}
                changeType="increase"
                icon="package"
                color="text-green-600"
                subtitle="Cargas ingresadas"
                target={25}
                showProgress={true}
              />
              <MetricCard
                title="Salidas Hoy"
                value={mockDashboardMetrics.dailyExits}
                change={-8.1}
                changeType="decrease"
                icon="truck"
                color="text-red-600"
                subtitle="Cargas despachadas"
                target={20}
                showProgress={true}
              />
              <MetricCard
                title="Tiempo Promedio"
                value={`${mockDashboardMetrics.averageProcessingTime}h`}
                change={-12.5}
                changeType="decrease"
                icon="clock"
                color="text-blue-600"
                subtitle="Procesamiento"
                target={2}
                unit="h"
                showProgress={true}
              />
              <MetricCard
                title="Ocupación Promedio"
                value={`${mockDashboardMetrics.occupancyRate}%`}
                change={3.2}
                changeType="increase"
                icon="warehouse"
                color="text-orange-600"
                subtitle="De almacenes"
                target={85}
                unit="%"
                showProgress={true}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WarehouseOccupancyCard warehouses={mockWarehouseOccupancy} />
              <WeatherWidget weather={mockWeatherData} />
            </div>

            <QuickActions />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Costos Operacionales"
                value={`€${mockCostAnalysis.operationalCosts.toLocaleString()}`}
                change={-3.2}
                changeType="decrease"
                icon="trending-down"
                color="text-green-600"
                subtitle="Este mes"
              />
              <MetricCard
                title="Costo por Operación"
                value={`€${mockDashboardMetrics.costPerOperation}`}
                change={-5.8}
                changeType="decrease"
                icon="trending-down"
                color="text-blue-600"
                subtitle="Promedio"
              />
              <MetricCard
                title="Ahorro Proyectado"
                value={`€${mockCostAnalysis.projectedSavings.toLocaleString()}`}
                change={18.5}
                changeType="increase"
                icon="trending-up"
                color="text-purple-600"
                subtitle="Este trimestre"
              />
              <MetricCard
                title="Varianza Presupuestal"
                value={`${mockCostAnalysis.budgetVariance}%`}
                change={1.2}
                changeType="increase"
                icon="target"
                color="text-orange-600"
                subtitle="Vs. planificado"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityChart data={mockDailyActivity} />
              <PerformanceMetrics metrics={mockPerformanceMetrics} />
            </div>

            {/* Inventory Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Métricas de Inventario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {mockInventoryMetrics.totalItems.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Items Totales
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {mockInventoryMetrics.lowStock}
                    </p>
                    <p className="text-sm text-muted-foreground">Stock Bajo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      €{mockInventoryMetrics.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {mockInventoryMetrics.accuracy}%
                    </p>
                    <p className="text-sm text-muted-foreground">Precisión</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StaffMetricsCard staff={mockStaffMetrics} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Seguridad del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {mockSecurityMetrics.cameraStatus}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Cámaras Activas
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {mockSecurityMetrics.accessAttempts}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Accesos Hoy
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        Estado de Alarmas
                      </span>
                      <Badge
                        className={
                          mockSecurityMetrics.alarmStatus === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {mockSecurityMetrics.alarmStatus === "active"
                          ? "Activo"
                          : "Inactivo"}
                      </Badge>
                    </div>

                    {mockSecurityMetrics.vulnerabilities > 0 && (
                      <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <p className="text-sm font-medium text-yellow-800">
                          {mockSecurityMetrics.vulnerabilities}{" "}
                          vulnerabilidad(es) detectada(s)
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherWidget weather={mockWeatherData} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Análisis de Costos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          Costos Operacionales
                        </p>
                        <p className="text-lg font-bold">
                          €{mockCostAnalysis.operationalCosts.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Costos de Mantenimiento
                        </p>
                        <p className="text-lg font-bold">
                          €{mockCostAnalysis.maintenanceCosts.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Costos de Energía
                        </p>
                        <p className="text-lg font-bold">
                          €{mockCostAnalysis.energyCosts.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Costos de Personal
                        </p>
                        <p className="text-lg font-bold">
                          €{mockCostAnalysis.laborCosts.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total de Costos</span>
                        <span className="text-xl font-bold">
                          €{mockCostAnalysis.totalCosts.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Mantenimientos Programados"
                value={mockDashboardMetrics.maintenanceScheduled}
                change={0}
                changeType="neutral"
                icon="activity"
                color="text-purple-600"
                subtitle="Esta semana"
              />
              <MetricCard
                title="Consumo de Energía"
                value={`${mockDashboardMetrics.energyConsumption} kWh`}
                change={-3.5}
                changeType="decrease"
                icon="activity"
                color="text-green-600"
                subtitle="Este mes"
              />
              <MetricCard
                title="Capacidad de Almacenamiento"
                value={`${mockDashboardMetrics.storageCapacity.toLocaleString()} kg`}
                change={0}
                changeType="neutral"
                icon="warehouse"
                color="text-blue-600"
                subtitle="Capacidad total"
              />
              <MetricCard
                title="Tasa de Utilización"
                value={`${mockDashboardMetrics.utilizationRate}%`}
                change={4.2}
                changeType="increase"
                icon="target"
                color="text-orange-600"
                subtitle="Promedio mensual"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MaintenanceScheduleCard schedule={mockMaintenanceSchedule} />
              <PerformanceMetrics metrics={mockPerformanceMetrics} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resumen Ejecutivo del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {mockDashboardMetrics.dailyEntries}
                </p>
                <p className="text-sm text-muted-foreground">Ingresos Hoy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {mockDashboardMetrics.dailyExits}
                </p>
                <p className="text-sm text-muted-foreground">Salidas Hoy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {mockDashboardMetrics.occupancyRate}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Ocupación Promedio
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {mockDashboardMetrics.efficiency}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Eficiencia Operativa
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {mockStaffMetrics.activeStaff}
                </p>
                <p className="text-sm text-muted-foreground">Personal Activo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-600">
                  {mockDashboardMetrics.systemUptime}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Tiempo de Actividad
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <div className="flex items-center justify-center gap-4">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Sistema Optimizado
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Users className="w-3 h-3 mr-1" />
                  {mockStaffMetrics.activeStaff} Usuarios Activos
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Seguridad Activa
                </Badge>
              </div>
              <p>Dashboard actualizado el {currentTime}</p>
              <p>
                Sistema de Gestión de Almacén - Versión 3.2.1 | Uptime:{" "}
                {mockDashboardMetrics.systemUptime}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
