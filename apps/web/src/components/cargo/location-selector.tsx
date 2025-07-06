"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, Package, Lightbulb } from "lucide-react";
import { useWarehouses } from "@/lib/warehouse";
import { useRacksByWarehouse } from "@/lib/rack";
import { useLocationsByRack } from "@/lib/locations";
import type { Position } from "@/lib/types";

interface LocationSelectorProps {
  warehouseId: string;
  rackId: string;
  level: number;
  column: string;
  onLocationChange: (
    warehouseId: string,
    rackId: string,
    level: number,
    column: string
  ) => void;
}

export const LocationSelector = ({
  warehouseId,
  rackId,
  level,
  column,
  onLocationChange,
}: LocationSelectorProps) => {
  const [availablePositions, setAvailablePositions] = useState<Position[]>([]);
  const [suggestedPosition, setSuggestedPosition] = useState<Position | null>(
    null
  );

  const { data: warehousesData = [], isLoading } = useWarehouses();
  const { data: racksData = [], isLoading: isLoadingRacks } =
    useRacksByWarehouse(warehouseId);
  const { data: locationsData = [] } = useLocationsByRack(rackId);

  const selectedWarehouse = warehousesData.find((w: any) => w.Id === warehouseId);
  const selectedRack = racksData.find((r: any) => r.Id === rackId);

  useEffect(() => {
    if (Array.isArray(locationsData)) {
      const isSame =
        JSON.stringify(locationsData) === JSON.stringify(availablePositions);
      if (!isSame) {
        setAvailablePositions(locationsData);
        const suggested = locationsData.find((p) => !p.isOccupied);
        setSuggestedPosition(suggested || null);
      }
    }
  }, [locationsData]);

  const handleWarehouseChange = (value: string) => {
    onLocationChange(value, "", 0, "");
  };

  const handleRackChange = (value: string) => {
    onLocationChange(warehouseId, value, 0, "");
  };

  const handleLevelChange = (value: string) => {
    onLocationChange(warehouseId, rackId, Number.parseInt(value), column);
  };

  const handleColumnChange = (value: string) => {
    onLocationChange(warehouseId, rackId, level, value);
  };

  const handlePositionClick = (pos: Position) => {
    if (!pos.isOccupied) {
      onLocationChange(warehouseId, rackId, pos.level, pos.column);
    }
  };

  const applySuggestion = () => {
    if (suggestedPosition) {
      onLocationChange(
        warehouseId,
        rackId,
        suggestedPosition.level,
        suggestedPosition.column
      );
    }
  };

  const levels = [...new Set(availablePositions.map((p) => p.level))].sort(
    (a, b) => b - a
  );
  const columns = [...new Set(availablePositions.map((p) => p.column))].sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Asignación de Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="warehouse">Almacén</Label>
          <Select value={warehouseId} onValueChange={handleWarehouseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar almacén" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Cargando...
                </div>
              ) : (
                warehousesData.map((w: any) => (
                  <SelectItem key={w.Id} value={w.Id}>
                    {w.Name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {warehouseId && (
          <div className="space-y-2">
            <Label htmlFor="rack">Rack</Label>
            <Select value={rackId} onValueChange={handleRackChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rack" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingRacks ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Cargando...
                  </div>
                ) : (
                  racksData.map((rack: any) => (
                    <SelectItem key={rack.Id} value={rack.Id}>
                      {rack.Name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {availablePositions.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Mapa de Ubicaciones</Label>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span>Almacenado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded border-2 border-blue-700" />
                  <span>Seleccionado</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              {levels.map((lvl) => {
                const row = availablePositions
                  .filter((p) => p.level === lvl)
                  .sort((a, b) => a.column.localeCompare(b.column));

                return (
                  <div key={lvl}>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Nivel {lvl}
                    </div>
                    <div className="overflow-x-auto">
                      <div
                        className="grid gap-1 min-w-max"
                        style={{
                          gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                        }}
                      >
                        {row.map((pos) => {
                          const isSelected =
                            pos.level === level && pos.column === column;
                          return (
                            <button
                              key={`${pos.level}-${pos.column}`}
                              onClick={() => handlePositionClick(pos)}
                              disabled={pos.isOccupied}
                              className={`w-10 h-10 rounded text-xs font-medium transition-all duration-200
                              ${
                                isSelected
                                  ? "bg-blue-500 text-white border-2 border-blue-700 shadow-md"
                                  : pos.isOccupied
                                  ? "bg-red-500 text-white cursor-not-allowed opacity-60"
                                  : "bg-green-500 text-white hover:bg-green-600 cursor-pointer hover:shadow-md"
                              }`}
                              title={`Nivel ${pos.level}, Columna ${pos.column}`}
                            >
                              {pos.column}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedRack && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nivel</Label>
              <Select
                value={level.toString()}
                onValueChange={handleLevelChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((l) => (
                    <SelectItem key={l} value={l.toString()}>
                      Nivel {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Columna</Label>
              <Select value={column} onValueChange={handleColumnChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Columna" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((c) => (
                    <SelectItem key={c} value={c}>
                      Columna {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {suggestedPosition && (!rackId || !level || !column) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Sugerencia Inteligente
              </span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Puedes hacer clic en una ubicación disponible o{" "}
              <button
                onClick={applySuggestion}
                className="text-blue-600 underline hover:text-blue-800 font-medium"
              >
                aplicar sugerencia
              </button>
            </p>
          </div>
        )}

        {warehouseId && rackId && level && column && (
          <div className="bg-green-50 dark:bg-green-600 border border-green-200 dark:border-green-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-green-600 dark:text-green-300" />
              <span className="text-sm font-medium text-green-800 dark:text-white">
                Ubicación Seleccionada
              </span>
            </div>
            <div className="text-sm text-green-700 dark:text-white">
              <p>
                <strong>Almacén:</strong> {selectedWarehouse?.Name}
              </p>
              <p>
                <strong>Rack:</strong> {selectedRack?.Name}
              </p>
              <p>
                <strong>Posición:</strong> Nivel {level}, Columna {column}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
