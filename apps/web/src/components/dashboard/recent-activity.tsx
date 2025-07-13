import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Package,
  ArrowRightLeft,
  LogOut,
  RotateCcw,
  Clock,
  User,
  Eye,
  Wrench,
  Search,
  DollarSign,
  MapPin,
} from "lucide-react";
import type { RecentActivity } from "./types";

interface RecentActivityListProps {
  activities: RecentActivity[];
}

export const RecentActivityList = ({ activities }: RecentActivityListProps) => {
  const getActivityIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "entry":
        return <Package className={`${iconClass} text-green-600`} />;
      case "exit":
        return <LogOut className={`${iconClass} text-red-600`} />;
      case "transfer":
        return <ArrowRightLeft className={`${iconClass} text-blue-600`} />;
      case "return":
        return <RotateCcw className={`${iconClass} text-orange-600`} />;
      case "maintenance":
        return <Wrench className={`${iconClass} text-purple-600`} />;
      case "inspection":
        return <Search className={`${iconClass} text-indigo-600`} />;
      default:
        return <Package className={iconClass} />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels = {
      entry: "Ingreso",
      exit: "Salida",
      transfer: "Traslado",
      return: "Devolución",
      maintenance: "Mantenimiento",
      inspection: "Inspección",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      error: "bg-red-100 text-red-800 border-red-200",
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
    };
    return (
      colors[status as keyof typeof colors] ||
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "";
    if (duration < 60) return `${duration}min`;
    return `${Math.floor(duration / 60)}h ${duration % 60}min`;
  };

  const formatCost = (cost?: number) => {
    if (!cost) return "";
    return `€${cost.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Actividad Reciente</CardTitle>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Ver Todo
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-sm text-blue-600 font-medium">
                        {activity.trackingCode}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getActivityTypeLabel(activity.type)}
                      </Badge>
                      <Badge
                        className={getPriorityColor(activity.priority)}
                        variant="outline"
                      >
                        {activity.priority.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">{activity.user}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(activity.timestamp)}
                      </div>

                      {activity.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{activity.location}</span>
                        </div>
                      )}

                      {activity.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(activity.duration)}
                        </div>
                      )}

                      {activity.cost && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCost(activity.cost)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status === "completed"
                      ? "Completado"
                      : activity.status === "pending"
                      ? "Pendiente"
                      : activity.status === "in-progress"
                      ? "En Progreso"
                      : "Error"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
