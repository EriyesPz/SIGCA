import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Grid3X3, Building2 } from "lucide-react"
import { statusConfig } from "@/components/common/status-config"
import type { Rack, Location } from "@/lib/types";

interface RackLocationsModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  selectedRack: any
  onLocationClick: (location: Location, rack: Rack, warehouse: any) => void
}

export const RackLocationsModal = ({ isOpen, onClose, selectedRack, onLocationClick }: RackLocationsModalProps) => {
  if (!selectedRack) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Rack Locations
          </SheetTitle>
          <SheetDescription>
            {selectedRack?.name} - {selectedRack?.warehouse?.name}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Rack Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{selectedRack.name}</h3>
              <Badge variant="outline">
                {Math.round(
                  (selectedRack.locations.filter((loc: any) => loc.status === "occupied").length /
                    selectedRack.locations.length) *
                    100,
                )}
                % Full
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Grid3X3 className="w-4 h-4" />
                {selectedRack.levels}L × {selectedRack.columns}C
              </span>
              <span>
                {selectedRack.locations.filter((loc: any) => loc.status === "occupied").length}/
                {selectedRack.locations.length} Occupied
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {selectedRack.warehouse?.name}
              </span>
            </div>
          </div>

          {/* Locations Grid */}
          <div className="space-y-4">
            <h4 className="font-medium">All Locations</h4>
            <div className="max-h-96 overflow-y-auto overflow-x-auto border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4 min-w-max">
                {Object.keys(
                  selectedRack.locations.reduce((acc: any, location: any) => {
                    if (!acc[location.level]) {
                      acc[location.level] = []
                    }
                    acc[location.level].push(location)
                    return acc
                  }, {}),
                )
                  .sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
                  .map((level) => {
                    const locationsInLevel = selectedRack.locations.filter(
                      (loc: any) => loc.level === Number.parseInt(level),
                    )
                    return (
                      <div key={level} className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground sticky left-0 bg-background/90 backdrop-blur-sm px-2 py-1 rounded">
                          Level {level}
                        </div>
                        <div
                          className="grid gap-3"
                          style={{
                            gridTemplateColumns: `repeat(${selectedRack.columns}, minmax(64px, 1fr))`,
                            minWidth: `${selectedRack.columns * 80}px`,
                          }}
                        >
                          {locationsInLevel
                            .sort((a: any, b: any) => a.column - b.column)
                            .map((location: any) => {
                              const status = statusConfig[location.status as keyof typeof statusConfig]
                              return (
                                <TooltipProvider key={location.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={`
                                          w-16 h-16 rounded-lg cursor-pointer transition-all duration-200 
                                          flex flex-col items-center justify-center text-white text-xs font-semibold
                                          shadow-sm hover:shadow-md transform hover:scale-105 border-2
                                          ${status.color} ${status.borderColor}
                                        `}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          onLocationClick(location, selectedRack, selectedRack.warehouse)
                                        }}
                                      >
                                        <span>L{location.level}</span>
                                        <span>C{location.column}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <div className="text-center space-y-1">
                                        <p className="font-semibold">{location.id}</p>
                                        <p className="text-sm">{status.label}</p>
                                        {location.trackingCode && (
                                          <p className="text-xs font-mono">{location.trackingCode}</p>
                                        )}
                                        {location.description && <p className="text-xs">{location.description}</p>}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            })}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Scroll Instructions */}
            <div className="text-xs text-muted-foreground text-center bg-muted/30 rounded p-2">
              💡 Use scroll to navigate through all locations horizontally and vertically
            </div>
          </div>

          {/* Status Summary */}
          <div className="space-y-3">
            <h4 className="font-medium">Status Summary</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(statusConfig).map(([statusKey, config]) => {
                const count = selectedRack.locations.filter((loc: any) => loc.status === statusKey).length
                return (
                  <div key={statusKey} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${config.color}`} />
                      <span className="text-sm">{config.label}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
