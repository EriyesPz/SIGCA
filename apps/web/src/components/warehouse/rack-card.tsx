import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3X3, Building2 } from "lucide-react"
import { LocationCell } from "./location-cell"
import type { Rack, Warehouse, Location } from "@/lib/types";

interface RackCardProps {
  rack: Rack
  warehouse: Warehouse
  viewMode: "all" | "by_warehouse"
  onRackClick: (rack: Rack, warehouse: Warehouse) => void
  onLocationClick: (location: Location, rack: Rack, warehouse: Warehouse) => void
}

export const RackCard = ({ rack, warehouse, viewMode, onRackClick, onLocationClick }: RackCardProps) => {
  const totalLocations = rack.locations.length
  const occupiedLocations = rack.locations.filter((loc) => loc.status === "occupied").length
  const occupancyRate = Math.round((occupiedLocations / totalLocations) * 100)

  const locationsByLevel = rack.locations.reduce((acc: any, location) => {
    if (!acc[location.level]) {
      acc[location.level] = []
    }
    acc[location.level].push(location)
    return acc
  }, {})

  const handleRackClick = () => {
    onRackClick(rack, warehouse)
  }

  return (
    <div onClick={handleRackClick} className="cursor-pointer">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{rack.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{rack.id}</p>
              {viewMode === "all" && rack.warehouseName && (
                <div className="flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{rack.warehouseName}</p>
                </div>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {occupancyRate}% Lleno
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Grid3X3 className="w-4 h-4" />
              {rack.levels}L × {rack.columns}C
            </span>
            <span>
              {occupiedLocations}/{totalLocations} Ocupado
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.keys(locationsByLevel)
            .sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
            .map((level) => (
              <div key={level} className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Nivel {level}</div>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${rack.columns}, 1fr)`,
                  }}
                >
                  {locationsByLevel[level]
                    .sort((a: any, b: any) => a.column - b.column)
                    .map((location: any) => (
                      <LocationCell
                        key={location.id}
                        location={location}
                        rack={rack}
                        warehouse={warehouse}
                        onLocationClick={onLocationClick}
                      />
                    ))}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
