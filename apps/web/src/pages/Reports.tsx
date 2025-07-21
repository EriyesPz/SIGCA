/* eslint-disable react-hooks/rules-of-hooks */
"use client";

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
  FileCheck
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
  | "cargo-situation-legal"


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
    description: "Lista completa de cargas registradas con documentos adjuntos",
    icon: <Package className="w-6 h-6" />,
    color: "text-green-600 dark:text-green-400",
    bgColor:
      "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-600",
    stats: {
      total: 892,
      lastGenerated: "Hace 1 hora",
      frequency: "Diario",
    },
  },
  {
    id: "internal-transfers",
    title: "Traslados Internos",
    description: "Movimientos de ubicación de cargas dentro del almacén",
    icon: <ArrowRightLeft className="w-6 h-6" />,
    color: "text-purple-600 dark:text-purple-400",
    bgColor:
      "bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-600",
    stats: {
      total: 156,
      lastGenerated: "Hace 3 horas",
      frequency: "Semanal",
    },
  },
  {
    id: "cargo-returns",
    title: "Cargas Devueltas/Reingresadas",
    description:
      "Casos de cargas rechazadas, devueltas o reingresadas al sistema",
    icon: <RotateCcw className="w-6 h-6" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor:
      "bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-600",
    stats: {
      total: 43,
      lastGenerated: "Hace 4 horas",
      frequency: "Semanal",
    },
  },
  {
    id: "cargo-exits",
    title: "Salidas de Carga",
    description: "Lista completa de cargas que han salido del almacén",
    icon: <LogOut className="w-6 h-6" />,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-600",
    stats: {
      total: 734,
      lastGenerated: "Hace 1 hora",
      frequency: "Diario",
    },
  },
  {
    id: "cargo-type",
    title: "Reporte de Carga por Tipo",
    description: "Análisis detallado de movimientos IN, OUT, DAMAGED, RETURNED",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-600",
    stats: {
      total: 1247,
      lastGenerated: "Hace 2 horas",
      frequency: "Diario",
    },
  },
  {
    id: "cargo-damaged",
    title: "Reporte de Carga Dañada",
    description: "Análisis de incidencias y daños en mercancía",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor:
      "bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-600",
    stats: {
      total: 43,
      lastGenerated: "Hace 4 horas",
      frequency: "Semanal",
    },
  },
  {
    id: "cargo-illegal",
    title: "Reporte de Carga Ilegal",
    description: "Análisis de cargas ilegales o no autorizadas",
    icon: <Scale className="w-6 h-6" />,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-amber-50 dark:bg-amber-900 border-amber-200 dark:border-amber-600",
    stats: {
      total: 12,
      lastGenerated: "Hace 2 días",
      frequency: "Mensual",
    },
  },
  {
    id: "cargo-average",
    title: "Promedio de Permanencia",
    description: "Análisis de tiempos de estadía en almacén",
    icon: <Clock className="w-6 h-6" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-600",
    stats: {
      total: 250,
      lastGenerated: "Hace 1 semana",
      frequency: "Mensual",
    },
  },
  {
    id: "cargo-location",
    title: "Distribución por Ubicación",
    description: "Análisis detallado de Rack, Nivel y Columna",
    icon: <MapPin className="w-6 h-6" />,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-600",
    stats: {
      total: 500,
      lastGenerated: "Hace 3 días",
      frequency: "Mensual",
    },
  },
  {
    id: "cargo-situation-legal",
    title: "Situación Legal de Cargas",
    description: "Análisis de cargas con situación legal pendiente",
    icon: <FileCheck className="w-6 h-6" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-600 dark:bg-blue-900 border-blue-200 dark:border-blue-600",
    stats: {
      total: 8,
      lastGenerated: "Hace 2 semanas",
      frequency: "Mensual",
    },
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
        <div className="border-b px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentView("overview")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="rounded-lg shadow-sm px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Centro de Reportes
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Genera, visualiza y descarga reportes detallados del sistema de
                gestión de almacén
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Última actualización: {new Date().toLocaleDateString("es-ES")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportCards.map((report) => (
                <Card
                  key={report.id}
                  className={`${report.bgColor} hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${report.color}`}
                      >
                        {report.icon}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.stats.frequency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {report.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {report.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{report.stats.total} registros</span>
                        <span>{report.stats.lastGenerated}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setCurrentView(report.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Actividad Reciente
            </h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="w-5 h-5" />
                  Últimas Acciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            activity.status === "completado"
                              ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-400 border-green-200 dark:border-green-600"
                              : activity.status === "en_progreso"
                              ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-600"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          {activity.status === "completado"
                            ? "Completado"
                            : activity.status === "en_progreso"
                            ? "En progreso"
                            : "Visualizado"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {activity.action}{" "}
                        <span className="font-medium">"{activity.report}"</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
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
