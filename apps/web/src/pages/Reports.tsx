/* eslint-disable react-hooks/rules-of-hooks */
import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Package,
  ArrowRightLeft,
  RotateCcw,
  LogOut,
  BarChart3,
  Calendar,
  Activity,
  TrendingUp,
  Eye,
  ArrowLeft,
  Scale,
  Clock,
  MapPin,
  FileCheck,
} from "lucide-react";
import { CargoTypeReport } from "@/components/reports/cargo-type";
import { CargoEntriesReport } from "@/components/reports/cargo-entries";
import { InternalTransfersReport } from "@/components/reports/internal-trasnfers";
import { CargoReturnsReport } from "@/components/reports/cargo-returns";
import { CargoExitsReport } from "@/components/reports/cargo-exists";
import { CargoDamaged } from "@/components/reports/cargo-damaged";
import { IlegalCargo } from "@/components/reports/cargo-ilegal";
import { CargoAverage } from "@/components/reports/cargo-average";
import { DistributionCargo } from "@/components/reports/cargo-distribution";
import { SituationLegal } from "@/components/reports/cargo-situation-legal";

type ReportType =
  | "overview"
  | "cargo-type"
  | "cargo-entries"
  | "internal-transfers"
  | "cargo-returns"
  | "cargo-exits"
  | "cargo-damaged"
  | "cargo-illegal"
  | "cargo-average"
  | "cargo-location"
  | "cargo-situation-legal";

interface ReportCard {
  id: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  stats: {
    total: number;
    lastGenerated: string;
    frequency: string;
  };
}

const reportCards: ReportCard[] = [
  {
    id: "cargo-entries",
    title: "Cargas Ingresadas",
    description: "Cargas registradas y documentos adjuntos",
    icon: <Package className="w-5 h-5" />,
    color: "text-green-600 dark:text-green-400",
    bgColor:
      "bg-green-50/70 dark:bg-green-900/50 border-green-200/70 dark:border-green-700/60",
    stats: { total: 892, lastGenerated: "Hace 1 hora", frequency: "Diario" },
  },
  {
    id: "internal-transfers",
    title: "Traslados Internos",
    description: "Movimientos entre ubicaciones",
    icon: <ArrowRightLeft className="w-5 h-5" />,
    color: "text-purple-600 dark:text-purple-400",
    bgColor:
      "bg-purple-50/70 dark:bg-purple-900/50 border-purple-200/70 dark:border-purple-700/60",
    stats: { total: 156, lastGenerated: "Hace 3 horas", frequency: "Semanal" },
  },
  {
    id: "cargo-returns",
    title: "Cargas Devueltas",
    description: "Rechazadas / reingresadas",
    icon: <RotateCcw className="w-5 h-5" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor:
      "bg-orange-50/70 dark:bg-orange-900/50 border-orange-200/70 dark:border-orange-700/60",
    stats: { total: 43, lastGenerated: "Hace 4 horas", frequency: "Semanal" },
  },
  {
    id: "cargo-exits",
    title: "Salidas de Carga",
    description: "Cargas que ya egresaron",
    icon: <LogOut className="w-5 h-5" />,
    color: "text-red-600 dark:text-red-400",
    bgColor:
      "bg-red-50/70 dark:bg-red-900/50 border-red-200/70 dark:border-red-700/60",
    stats: { total: 734, lastGenerated: "Hace 1 hora", frequency: "Diario" },
  },
  {
    id: "cargo-type",
    title: "Carga por Tipo",
    description: "IN / OUT / DAMAGED / RETURNED",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor:
      "bg-blue-50/70 dark:bg-blue-900/50 border-blue-200/70 dark:border-blue-700/60",
    stats: { total: 1247, lastGenerated: "Hace 2 horas", frequency: "Diario" },
  },
  {
    id: "cargo-damaged",
    title: "Carga Dañada",
    description: "Incidencias y daños",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor:
      "bg-orange-50/70 dark:bg-orange-900/50 border-orange-200/70 dark:border-orange-700/60",
    stats: { total: 43, lastGenerated: "Hace 4 horas", frequency: "Semanal" },
  },
  {
    id: "cargo-illegal",
    title: "Carga Ilegal",
    description: "No autorizadas / irregulares",
    icon: <Scale className="w-5 h-5" />,
    color: "text-amber-600 dark:text-amber-400",
    bgColor:
      "bg-amber-50/70 dark:bg-amber-900/50 border-amber-200/70 dark:border-amber-700/60",
    stats: { total: 12, lastGenerated: "Hace 2 días", frequency: "Mensual" },
  },
  {
    id: "cargo-average",
    title: "Permanencia Promedio",
    description: "Tiempo de estadía",
    icon: <Clock className="w-5 h-5" />,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor:
      "bg-indigo-50/70 dark:bg-indigo-900/50 border-indigo-200/70 dark:border-indigo-700/60",
    stats: { total: 250, lastGenerated: "Hace 1 semana", frequency: "Mensual" },
  },
  {
    id: "cargo-location",
    title: "Distribución por Ubicación",
    description: "Rack / Nivel / Columna",
    icon: <MapPin className="w-5 h-5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor:
      "bg-emerald-50/70 dark:bg-emerald-900/50 border-emerald-200/70 dark:border-emerald-700/60",
    stats: { total: 500, lastGenerated: "Hace 3 días", frequency: "Mensual" },
  },
  {
    id: "cargo-situation-legal",
    title: "Situación Legal",
    description: "Cargas con pendientes legales",
    icon: <FileCheck className="w-5 h-5" />,
    color: "text-sky-600 dark:text-sky-400",
    bgColor:
      "bg-sky-50/70 dark:bg-sky-900/50 border-sky-200/70 dark:border-sky-700/60",
    stats: { total: 8, lastGenerated: "Hace 2 semanas", frequency: "Mensual" },
  },
];

const recentActivity = [
  {
    id: 1,
    action: "Generó reporte",
    report: "Cargas Ingresadas",
    user: "Ana García",
    time: "Hace 15 min",
    status: "completado",
  },
  {
    id: 2,
    action: "Descargó PDF",
    report: "Carga por Tipo",
    user: "Carlos López",
    time: "Hace 32 min",
    status: "completado",
  },
  {
    id: 3,
    action: "Aplicó filtros",
    report: "Traslados Internos",
    user: "María Rodríguez",
    time: "Hace 1 hora",
    status: "en_progreso",
  },
  {
    id: 4,
    action: "Visualizó reporte",
    report: "Salidas de Carga",
    user: "Juan Martínez",
    time: "Hace 2 horas",
    status: "visualizado",
  },
];

export const Reports = () => {
  const [currentView, setCurrentView] = useState<ReportType>("overview");

  const renderReportComponent = () => {
    switch (currentView) {
      case "cargo-type":
        return <CargoTypeReport />;
      case "cargo-entries":
        return <CargoEntriesReport />;
      case "internal-transfers":
        return <InternalTransfersReport />;
      case "cargo-returns":
        return <CargoReturnsReport />;
      case "cargo-exits":
        return <CargoExitsReport />;
      case "cargo-damaged":
        return <CargoDamaged />;
      case "cargo-illegal":
        return <IlegalCargo />;
      case "cargo-average":
        return <CargoAverage />;
      case "cargo-location":
        return <DistributionCargo />;
      case "cargo-situation-legal":
        return <SituationLegal />;
      default:
        return null;
    }
  };

  if (currentView !== "overview") {
    return (
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur px-4 py-2">
          <Button
            variant="ghost"
            onClick={() => setCurrentView("overview")}
            className="gap-2 h-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Reportes
          </Button>
        </div>
        {renderReportComponent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-5">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header compacto */}
        <div className="rounded-xl border bg-card px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Centro de Reportes
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Genera, visualiza y descarga reportes del sistema de almacén
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Actualizado: {new Date().toLocaleDateString("es-ES")}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-3">
            {/* Cards compactas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {reportCards.map((report) => (
                <Card
                  key={report.id}
                  className={`group ${report.bgColor} border rounded-xl hover:shadow-sm transition-all duration-150`}
                >
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-1.5 rounded-md bg-white/80 dark:bg-gray-800/70 ${report.color}`}
                      >
                        {report.icon}
                      </div>
                      <Badge
                        variant="outline"
                        className="h-6 text-[10px] leading-none px-2"
                      >
                        {report.stats.frequency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm leading-tight">
                          {report.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {report.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                          {report.stats.total.toLocaleString("es-HN")} registros
                        </span>
                        <span>{report.stats.lastGenerated}</span>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => setCurrentView(report.id)}
                        className="w-full h-8 text-xs gap-1.5"
                        variant="default"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar: actividad reciente (compacto) */}
          <div className="space-y-2.5">
            <h2 className="text-base font-semibold">Actividad Reciente</h2>
            <Card className="rounded-xl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4" />
                  Últimas acciones
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                {recentActivity.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border bg-muted/40"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {a.user}
                        </span>
                        <Badge
                          variant="outline"
                          className={`h-5 px-2 text-[10px] ${
                            a.status === "completado"
                              ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                              : a.status === "en_progreso"
                              ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          {a.status === "completado"
                            ? "Completado"
                            : a.status === "en_progreso"
                            ? "En progreso"
                            : "Visualizado"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {a.action}{" "}
                        <span className="font-medium">“{a.report}”</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {a.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
