import React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { statusConfig } from "@/components/common/status-config"
type LocationStatus = keyof typeof statusConfig

export interface Location {
  id: string
  level: number
  column: number
  status: LocationStatus
  trackingCode?: string
  description?: string
}

export interface Rack {
  id: string
  name: string
  levels: number
  columns: number
}

export interface Warehouse {
  id: string
  name: string
}

interface LocationCellProps {
  location: Location
  rack: Rack
  warehouse: Warehouse
  onClick?: (location: Location, rack: Rack, warehouse: Warehouse) => void
}

export const LocationCell: React.FC<LocationCellProps> = ({
  location,
  rack,
  warehouse,
  onClick,
}) => {
  const status = statusConfig[location.status]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onClick?.(location, rack, warehouse)}
            className={`
              flex h-12 w-12 items-center justify-center rounded-lg text-xs font-semibold text-white
              shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md
              ${status.color} ${status.borderColor}
            `}
            aria-label={`Nivel ${location.level} Columna ${location.column} (${status.label})`}
          >
            L{location.level}C{location.column}
          </button>
        </TooltipTrigger>

        <TooltipContent side="top">
          <div className="space-y-1 text-center">
            <p className="font-semibold">{location.id}</p>
            <p className="text-sm">{status.label}</p>

            {location.trackingCode && (
              <p className="font-mono text-xs">{location.trackingCode}</p>
            )}

            {location.description && (
              <p className="text-xs">{location.description}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
