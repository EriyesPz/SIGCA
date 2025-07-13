import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Warehouse, MapPin, Thermometer, Droplets, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { WarehouseOccupancy } from "./types";

interface WarehouseOccupancyCardProps {
  warehouses: WarehouseOccupancy[]
}

export const WarehouseOccupancyCard = ({ warehouses }: WarehouseOccupancyCardProps) => {
  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return "text-red-600"
    if (rate >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "bg-green-100 text-green-800 border-green-200"
      case "down":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatLastInspection = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 24) {
      return `Hace ${diffHours}h`
    }
    return `Hace ${Math.floor(diffHours / 24)}d`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Warehouse className="w-5 h-5" />
          Ocupación de Almacenes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="occupancy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="occupancy">Ocupación</TabsTrigger>
            <TabsTrigger value="conditions">Condiciones</TabsTrigger>
          </TabsList>

          <TabsContent value="occupancy" className="space-y-6">
            {warehouses.map((warehouse) => (
              <div key={warehouse.warehouse} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{warehouse.warehouse}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getOccupancyColor(warehouse.occupancyRate)}`}>
                      {warehouse.occupancyRate.toFixed(1)}%
                    </span>
                    <Badge className={getTrendColor(warehouse.utilizationTrend)} variant="outline">
                      {getTrendIcon(warehouse.utilizationTrend)}
                    </Badge>
                  </div>
                </div>

                <Progress value={warehouse.occupancyRate} className="h-3" />

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center">
                    <p className="font-medium text-green-600">{warehouse.occupiedLocations}</p>
                    <p className="text-muted-foreground">Ocupadas</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-blue-600">{warehouse.availableLocations}</p>
                    <p className="text-muted-foreground">Disponibles</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-orange-600">{warehouse.reservedLocations}</p>
                    <p className="text-muted-foreground">Reservadas</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Capacidad: {warehouse.capacity.toLocaleString()} kg
                  </span>
                  <span className="text-xs text-muted-foreground">{warehouse.totalLocations} ubicaciones totales</span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="conditions" className="space-y-6">
            {warehouses.map((warehouse) => (
              <div key={warehouse.warehouse} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm">{warehouse.warehouse}</span>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatLastInspection(warehouse.lastInspection)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">{warehouse.temperature}°C</p>
                      <p className="text-xs text-muted-foreground">Temperatura</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{warehouse.humidity}%</p>
                      <p className="text-xs text-muted-foreground">Humedad</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Última inspección: {formatLastInspection(warehouse.lastInspection)}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
