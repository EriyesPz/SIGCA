"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Info, X, Clock, Bell, User, MapPin, Calendar } from "lucide-react"
import type { Alert } from "./types";

interface AlertsPanelProps {
  alerts: Alert[]
}

export const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const getAlertIcon = (type: string) => {
    const iconClass = "w-4 h-4"
    switch (type) {
      case "critical":
        return <AlertTriangle className={`${iconClass} text-red-600`} />
      case "warning":
        return <AlertTriangle className={`${iconClass} text-yellow-600`} />
      case "error":
        return <AlertTriangle className={`${iconClass} text-red-600`} />
      case "info":
        return <Info className={`${iconClass} text-blue-600`} />
      case "maintenance":
        return <Info className={`${iconClass} text-purple-600`} />
      default:
        return <Info className={iconClass} />
    }
  }

  const getAlertColor = (type: string) => {
    const colors = {
      critical: "bg-red-100 text-red-800 border-red-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      error: "bg-red-100 text-red-800 border-red-200",
      info: "bg-blue-100 text-blue-800 border-blue-200",
      maintenance: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800 border-gray-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      security: "bg-red-100 text-red-800 border-red-200",
      operations: "bg-blue-100 text-blue-800 border-blue-200",
      maintenance: "bg-purple-100 text-purple-800 border-purple-200",
      system: "bg-green-100 text-green-800 border-green-200",
      compliance: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    })
  }

  const unreadAlerts = alerts.filter((alert) => !alert.isRead)
  const criticalAlerts = alerts.filter((alert) => alert.priority === "critical")
  const highAlerts = alerts.filter((alert) => alert.priority === "high")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Alertas del Sistema
          {unreadAlerts.length > 0 && (
            <Badge className="bg-red-100 text-red-800 border-red-200">{unreadAlerts.length}</Badge>
          )}
        </CardTitle>
        <Button variant="outline" size="sm">
          Marcar como leídas
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas ({alerts.length})</TabsTrigger>
            <TabsTrigger value="critical">Críticas ({criticalAlerts.length})</TabsTrigger>
            <TabsTrigger value="high">Altas ({highAlerts.length})</TabsTrigger>
            <TabsTrigger value="unread">No leídas ({unreadAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="critical">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {criticalAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="high">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {highAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {unreadAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  function AlertCard({ alert }: { alert: Alert }) {
    return (
      <div
        className={`p-4 border rounded-lg ${alert.isRead ? "opacity-60" : ""} ${
          !alert.isRead ? "bg-gray-50 border-l-4 border-l-blue-500" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getAlertIcon(alert.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-medium text-sm">{alert.title}</span>
                <Badge className={getAlertColor(alert.type)} variant="outline">
                  {alert.type === "critical"
                    ? "Crítica"
                    : alert.type === "warning"
                      ? "Advertencia"
                      : alert.type === "error"
                        ? "Error"
                        : alert.type === "maintenance"
                          ? "Mantenimiento"
                          : "Info"}
                </Badge>
                <Badge className={getPriorityColor(alert.priority)} variant="outline">
                  {alert.priority.toUpperCase()}
                </Badge>
                <Badge className={getCategoryColor(alert.category)} variant="outline">
                  {alert.category.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-3">{alert.message}</p>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(alert.timestamp)} - {formatDate(alert.timestamp)}
                </div>

                {alert.assignedTo && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="truncate">{alert.assignedTo}</span>
                  </div>
                )}

                {alert.estimatedResolution && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    ETA: {alert.estimatedResolution}
                  </div>
                )}

                {alert.affectedAreas.length > 0 && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{alert.affectedAreas.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )
  }
}
