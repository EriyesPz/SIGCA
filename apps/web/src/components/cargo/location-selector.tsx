"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, Lightbulb } from "lucide-react"
import { warehouses } from "@/data/warehouse-data"
import type { WarehouseLocation, Rack, Position } from "@/lib/types"

interface LocationSelectorProps {
  warehouseId: string
  rackId: string
  level: number
  column: number
  onLocationChange: (warehouseId: string, rackId: string, level: number, column: number) => void
}

export const LocationSelector = ({ warehouseId, rackId, level, column, onLocationChange }: LocationSelectorProps) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseLocation | null>(null)
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null)
  const [availablePositions, setAvailablePositions] = useState<Position[]>([])
  const [suggestedPosition, setSuggestedPosition] = useState<Position | null>(null)

  useEffect(() => {
    if (warehouseId) {
      const warehouse = warehouses.find((w) => w.id === warehouseId)
      setSelectedWarehouse(warehouse || null)
    }
  }, [warehouseId])

  useEffect(() => {
    if (selectedWarehouse && rackId) {
      const rack = selectedWarehouse.racks.find((r) => r.id === rackId)
      setSelectedRack(rack || null)

      if (rack) {
        // Generate available positions
        const positions: Position[] = []
        for (let l = 1; l <= rack.levels; l++) {
          for (let c = 1; c <= rack.columns; c++) {
            positions.push({
              level: l,
              column: c,
              isOccupied: rack.occupiedPositions.has(`${l}-${c}`),
            })
          }
        }
        setAvailablePositions(positions)

        // Find suggested position (first available)
        const suggested = positions.find((p) => !p.isOccupied)
        setSuggestedPosition(suggested || null)
      }
    }
  }, [selectedWarehouse, rackId])

  const handleWarehouseChange = (value: string) => {
    onLocationChange(value, "", 0, 0)
  }

  const handleRackChange = (value: string) => {
    onLocationChange(warehouseId, value, 0, 0)
  }

  const handleLevelChange = (value: string) => {
    onLocationChange(warehouseId, rackId, Number.parseInt(value), column)
  }

  const handleColumnChange = (value: string) => {
    onLocationChange(warehouseId, rackId, level, Number.parseInt(value))
  }

  const handlePositionClick = (pos: Position) => {
    if (!pos.isOccupied) {
      onLocationChange(warehouseId, rackId, pos.level, pos.column)
    }
  }

  const applySuggestion = () => {
    if (suggestedPosition) {
      onLocationChange(warehouseId, rackId, suggestedPosition.level, suggestedPosition.column)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Asignación de Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warehouse Selection */}
        <div className="space-y-2">
          <Label htmlFor="warehouse">Almacén</Label>
          <Select value={warehouseId} onValueChange={handleWarehouseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar almacén" />
            </SelectTrigger>
            <SelectContent>
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rack Selection */}
        {selectedWarehouse && (
          <div className="space-y-2">
            <Label htmlFor="rack">Rack</Label>
            <Select value={rackId} onValueChange={handleRackChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rack" />
              </SelectTrigger>
              <SelectContent>
                {selectedWarehouse.racks.map((rack) => (
                  <SelectItem key={rack.id} value={rack.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{rack.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {rack.levels}L × {rack.columns}C
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedWarehouse && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Mapa de Ubicaciones</Label>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span>Ocupado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded border-2 border-blue-700" />
                  <span>Seleccionado</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 space-y-6">
              {selectedWarehouse.racks.map((rack) => {
                const rackPositions: Position[] = []
                for (let l = 1; l <= rack.levels; l++) {
                  for (let c = 1; c <= rack.columns; c++) {
                    rackPositions.push({
                      level: l,
                      column: c,
                      isOccupied: rack.occupiedPositions.has(`${l}-${c}`),
                    })
                  }
                }

                return (
                  <div key={rack.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{rack.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {rack.levels}L × {rack.columns}C
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {Array.from({ length: rack.levels }, (_, levelIndex) => {
                        const currentLevel = rack.levels - levelIndex
                        return (
                          <div key={currentLevel} className="space-y-1">
                            <div className="text-xs font-medium text-gray-600">Nivel {currentLevel}</div>
                            <div
                              className="grid gap-1"
                              style={{
                                gridTemplateColumns: `repeat(${rack.columns}, 1fr)`,
                              }}
                            >
                              {Array.from({ length: rack.columns }, (_, columnIndex) => {
                                const currentColumn = columnIndex + 1
                                const position = rackPositions.find(
                                  (p) => p.level === currentLevel && p.column === currentColumn,
                                )
                                const isSelected =
                                  rackId === rack.id && level === currentLevel && column === currentColumn
                                const isOccupied = position?.isOccupied || false

                                return (
                                  <button
                                    key={`${currentLevel}-${currentColumn}`}
                                    onClick={() => {
                                      if (!isOccupied) {
                                        onLocationChange(warehouseId, rack.id, currentLevel, currentColumn)
                                      }
                                    }}
                                    disabled={isOccupied}
                                    className={`
                                      w-10 h-10 rounded text-xs font-medium transition-all duration-200
                                      ${
                                        isSelected
                                          ? "bg-blue-500 text-white border-2 border-blue-700 shadow-md"
                                          : isOccupied
                                            ? "bg-red-500 text-white cursor-not-allowed opacity-60"
                                            : "bg-green-500 text-white hover:bg-green-600 cursor-pointer hover:shadow-md"
                                      }
                                    `}
                                    title={`${rack.name} - Nivel ${currentLevel}, Columna ${currentColumn} - ${
                                      isOccupied ? "Ocupado" : "Disponible"
                                    }`}
                                  >
                                    {currentColumn}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Level and Column Selection */}
        {selectedRack && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Nivel</Label>
              <Select value={level.toString()} onValueChange={handleLevelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: selectedRack.levels }, (_, i) => i + 1).map((l) => (
                    <SelectItem key={l} value={l.toString()}>
                      Nivel {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="column">Columna</Label>
              <Select value={column.toString()} onValueChange={handleColumnChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Columna" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: selectedRack.columns }, (_, i) => i + 1).map((c) => (
                    <SelectItem key={c} value={c.toString()}>
                      Columna {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* AI Suggestion - Updated for warehouse level */}
        {selectedWarehouse && (!rackId || !level || !column) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Sugerencia Inteligente</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Haz clic directamente en el mapa para seleccionar una posición disponible
            </p>
          </div>
        )}

        {/* Position Grid Visualization - Show after warehouse selection */}
        

        {/* Selected Position Summary */}
        {warehouseId && rackId && level && column && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Ubicación Seleccionada</span>
            </div>
            <div className="text-sm text-green-700">
              <p>
                <strong>Almacén:</strong> {selectedWarehouse?.name}
              </p>
              <p>
                <strong>Rack:</strong> {selectedRack?.name}
              </p>
              <p>
                <strong>Posición:</strong> Nivel {level}, Columna {column}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
