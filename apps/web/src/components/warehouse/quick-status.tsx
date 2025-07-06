import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WarehouseData } from "@/lib/types";

interface QuickStatsProps {
  filteredData: WarehouseData
}

export const QuickStats = ({ filteredData }: QuickStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadisticas rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(filteredData).map(([warehouseId, warehouse]) => {
          const totalLocations = Object.values(warehouse.racks).reduce(
            (acc: number, rack) => acc + rack.locations.length,
            0,
          )
          const occupiedLocations = Object.values(warehouse.racks).reduce(
            (acc: number, rack) => acc + rack.locations.filter((loc) => loc.status === "occupied").length,
            0,
          )
          const occupancyRate = Math.round((occupiedLocations / totalLocations) * 100)

          return (
            <div key={warehouseId} className="space-y-1">
              <div className="font-medium text-sm">{warehouse.name}</div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {occupiedLocations}/{totalLocations} almacenado
                </span>
                <span>{occupancyRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
