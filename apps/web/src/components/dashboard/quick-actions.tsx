import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ArrowRightLeft,
  FileText,
  BarChart3,
  Plus,
  Search,
  Settings,
  Users,
  Shield,
  Wrench,
  Calendar,
  Download,
} from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      title: "Registrar Carga",
      description: "Agregar nueva carga al sistema",
      icon: Package,
      color: "bg-green-100 text-green-600",
      badge: "Nuevo",
      badgeColor: "bg-green-100 text-green-800",
      action: () => console.log("Registrar carga"),
    },
    {
      title: "Trasladar Carga",
      description: "Mover carga entre ubicaciones",
      icon: ArrowRightLeft,
      color: "bg-blue-100 text-blue-600",
      badge: "12 pendientes",
      badgeColor: "bg-blue-100 text-blue-800",
      action: () => console.log("Trasladar carga"),
    },
    {
      title: "Generar Reporte",
      description: "Crear reporte personalizado",
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
      action: () => console.log("Generar reporte"),
    },
    {
      title: "Ver Estadísticas",
      description: "Analizar métricas del almacén",
      icon: BarChart3,
      color: "bg-orange-100 text-orange-600",
      action: () => console.log("Ver estadísticas"),
    },
    {
      title: "Buscar Carga",
      description: "Localizar carga específica",
      icon: Search,
      color: "bg-indigo-100 text-indigo-600",
      action: () => console.log("Buscar carga"),
    },
    {
      title: "Nueva Ubicación",
      description: "Crear nueva ubicación",
      icon: Plus,
      color: "bg-teal-100 text-teal-600",
      action: () => console.log("Nueva ubicación"),
    },
    {
      title: "Gestión de Personal",
      description: "Administrar usuarios y permisos",
      icon: Users,
      color: "bg-pink-100 text-pink-600",
      badge: "15 activos",
      badgeColor: "bg-pink-100 text-pink-800",
      action: () => console.log("Gestión de personal"),
    },
    {
      title: "Configuración",
      description: "Ajustar parámetros del sistema",
      icon: Settings,
      color: "bg-gray-100 text-gray-600",
      action: () => console.log("Configuración"),
    },
    {
      title: "Seguridad",
      description: "Revisar logs y accesos",
      icon: Shield,
      color: "bg-red-100 text-red-600",
      badge: "1 alerta",
      badgeColor: "bg-red-100 text-red-800",
      action: () => console.log("Seguridad"),
    },
    {
      title: "Mantenimiento",
      description: "Programar tareas de mantenimiento",
      icon: Wrench,
      color: "bg-yellow-100 text-yellow-600",
      badge: "5 programadas",
      badgeColor: "bg-yellow-100 text-yellow-800",
      action: () => console.log("Mantenimiento"),
    },
    {
      title: "Calendario",
      description: "Ver eventos y programación",
      icon: Calendar,
      color: "bg-cyan-100 text-cyan-600",
      action: () => console.log("Calendario"),
    },
    {
      title: "Exportar Datos",
      description: "Descargar información del sistema",
      icon: Download,
      color: "bg-emerald-100 text-emerald-600",
      action: () => console.log("Exportar datos"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all duration-200 bg-transparent hover:scale-105 relative"
                onClick={action.action}
              >
                {action.badge && (
                  <Badge
                    className={`absolute -top-2 -right-2 text-xs px-2 py-1 ${action.badgeColor}`}
                  >
                    {action.badge}
                  </Badge>
                )}
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
