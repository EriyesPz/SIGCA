import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

import { statusConfig } from "@/components/common/status-config";

export const LocationCell = ({
  location,
  rack,
  warehouse,
}: {
  location: any;
  rack: any;
  warehouse: any;
}) => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleLocationClick = (location: any, rack: any, warehouse: any) => {
    setSelectedLocation({ ...location, rack, warehouse });
    setIsDetailOpen(true);
  };

  const status = statusConfig[location.status as keyof typeof statusConfig];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 
              flex items-center justify-center text-white text-xs font-semibold
              shadow-sm hover:shadow-md transform hover:scale-105 border-2
              ${status.color} ${status.borderColor}
            `}
            onClick={() => handleLocationClick(location, rack, warehouse)}
          >
            L{location.level}C{location.column}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="text-center space-y-1">
            <p className="font-semibold">{location.id}</p>
            <p className="text-sm">{status.label}</p>
            {location.trackingCode && (
              <p className="text-xs font-mono">{location.trackingCode}</p>
            )}
            {location.description && (
              <p className="text-xs">{location.description}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
