import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Wrench,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import type { MaintenanceSchedule } from "./types";

interface MaintenanceScheduleCardProps {
  schedule: MaintenanceSchedule[];
}

export const MaintenanceScheduleCard = ({
  schedule,
}: MaintenanceScheduleCardProps) => {
  const getTypeColor = (type: string) => {
    const colors = {
      preventive: "bg-blue-100 text-blue-800 border-blue-200",
      corrective: "bg-orange-100 text-orange-800 border-orange-200",
      emergency: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800 border-gray-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[priority as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusIcon = (status: string) => {
    const iconClass = "w-4 h-4";
    switch (status) {
      case "completed":
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case "in-progress":
        return <PlayCircle className={`${iconClass} text-blue-600`} />;
      case "overdue":
        return <AlertTriangle className={`${iconClass} text-red-600`} />;
      default:
        return <Calendar className={`${iconClass} text-gray-600`} />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-gray-100 text-gray-800 border-gray-200",
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      overdue: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${hours * 60}min`;
    return `${hours}h`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Programación de Mantenimiento
        </CardTitle>
        <Button variant="outline" size="sm">
          Ver Calendario
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {schedule.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">
                        {item.equipment}
                      </h4>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge
                          className={getTypeColor(item.type)}
                          variant="outline"
                        >
                          {item.type === "preventive"
                            ? "Preventivo"
                            : item.type === "corrective"
                            ? "Correctivo"
                            : "Emergencia"}
                        </Badge>
                        <Badge
                          className={getPriorityColor(item.priority)}
                          variant="outline"
                        >
                          {item.priority.toUpperCase()}
                        </Badge>
                        <Badge
                          className={getStatusColor(item.status)}
                          variant="outline"
                        >
                          {item.status === "scheduled"
                            ? "Programado"
                            : item.status === "in-progress"
                            ? "En Progreso"
                            : item.status === "completed"
                            ? "Completado"
                            : "Atrasado"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.scheduledDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(item.estimatedDuration)}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="truncate">{item.assignedTechnician}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wrench className="w-3 h-3" />
                    ID: {item.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
