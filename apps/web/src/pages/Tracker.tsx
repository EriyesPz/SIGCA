import { useState, useMemo } from "react"
import {
  Search,
  Package,
  Filter,
  RotateCcw,
  MapPin,
  Calendar,
  User,
  Truck,
  Clock,
  ChevronRight,
  Grid3X3,
  Building2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { statusConfig } from "@/components/common/status-config"
import { useLocations } from "@/lib/locations"

const getLocationsWithOccupancy = async () => {
  return warehouseData
}

const buildWarehouseTree = (rows: any[]) => {
  const tree: any = {}

  rows.forEach((row) => {
    const wId = row.warehouse
    const rId = row.rackCode

    tree[wId] ??= { name: row.warehouse, racks: {} }
    tree[wId].racks[rId] ??= {
      id: rId,
      name: row.rack,
      levels: 0,
      columns: 0,
      locations: [],
    }

    const rack = tree[wId].racks[rId]
    rack.locations.push({
      id: `${rId}-L${row.level}-C${row.column}`,
      level: row.level,
      column: row.column,
      status: row.status ?? (row.isOccupied ? "occupied" : "available"),
      trackingCode: row.trackingCode,
      description: row.description,
    })

    rack.levels = Math.max(rack.levels, row.level)
    const colNumber = typeof row.column === "string" ? row.column.toUpperCase().charCodeAt(0) - 64 : Number(row.column)
    rack.columns = Math.max(rack.columns, colNumber)
  })

  return tree
}

const warehouseData = {
  "WH-001": {
    name: "Main Distribution Center",
    location: "Zone A",
    racks: {
      "R-001": {
        id: "R-001",
        name: "Rack Alpha-01",
        levels: 4,
        columns: 6,
        locations: [
          {
            id: "R-001-L1-C1",
            level: 1,
            column: 1,
            status: "occupied",
            trackingCode: "TRK-2024-001",
            description: "Electronics - Laptops",
            entryDate: "2024-01-15",
            exitDate: null,
            assignedUser: "John Smith",
            weight: "45.2 kg",
            dimensions: "60x40x30 cm",
          },
          {
            id: "R-001-L1-C2",
            level: 1,
            column: 2,
            status: "available",
            trackingCode: null,
            description: null,
            entryDate: null,
            exitDate: null,
            assignedUser: null,
            weight: null,
            dimensions: null,
          },
          {
            id: "R-001-L1-C3",
            level: 1,
            column: 3,
            status: "reserved",
            trackingCode: "TRK-2024-002",
            description: "Medical Supplies",
            entryDate: "2024-01-16",
            exitDate: "2024-01-20",
            assignedUser: "Maria Garcia",
            weight: "12.8 kg",
            dimensions: "30x20x15 cm",
          },
          {
            id: "R-001-L1-C4",
            level: 1,
            column: 4,
            status: "in_transit",
            trackingCode: "TRK-2024-003",
            description: "Automotive Parts",
            entryDate: "2024-01-17",
            exitDate: null,
            assignedUser: "Carlos Rodriguez",
            weight: "78.5 kg",
            dimensions: "80x50x40 cm",
          },
          {
            id: "R-001-L1-C5",
            level: 1,
            column: 5,
            status: "occupied",
            trackingCode: "TRK-2024-004",
            description: "Textiles - Clothing",
            entryDate: "2024-01-14",
            exitDate: null,
            assignedUser: "Ana Lopez",
            weight: "23.1 kg",
            dimensions: "50x40x25 cm",
          },
          {
            id: "R-001-L1-C6",
            level: 1,
            column: 6,
            status: "maintenance",
            trackingCode: null,
            description: "Under maintenance",
            entryDate: null,
            exitDate: null,
            assignedUser: "Maintenance Team",
            weight: null,
            dimensions: null,
          },
          // Level 2
          {
            id: "R-001-L2-C1",
            level: 2,
            column: 1,
            status: "available",
            trackingCode: null,
            description: null,
            entryDate: null,
            exitDate: null,
            assignedUser: null,
            weight: null,
            dimensions: null,
          },
          {
            id: "R-001-L2-C2",
            level: 2,
            column: 2,
            status: "occupied",
            trackingCode: "TRK-2024-005",
            description: "Books & Publications",
            entryDate: "2024-01-13",
            exitDate: null,
            assignedUser: "David Chen",
            weight: "67.3 kg",
            dimensions: "70x45x35 cm",
          },
          // Add more levels and columns...
        ],
      },
      "R-002": {
        id: "R-002",
        name: "Rack Beta-02",
        levels: 3,
        columns: 4,
        locations: [
          {
            id: "R-002-L1-C1",
            level: 1,
            column: 1,
            status: "occupied",
            trackingCode: "TRK-2024-006",
            description: "Industrial Equipment",
            entryDate: "2024-01-12",
            exitDate: null,
            assignedUser: "Mike Johnson",
            weight: "156.7 kg",
            dimensions: "100x60x50 cm",
          },
        ],
      },
    },
  },
  "WH-002": {
    name: "Cold Storage Facility",
    location: "Zone B",
    racks: {
      "R-003": {
        id: "R-003",
        name: "Cold Rack Charlie-01",
        levels: 3,
        columns: 5,
        locations: [
          {
            id: "R-003-L1-C1",
            level: 1,
            column: 1,
            status: "occupied",
            trackingCode: "TRK-2024-007",
            description: "Frozen Foods",
            entryDate: "2024-01-18",
            exitDate: null,
            assignedUser: "Sarah Wilson",
            weight: "89.4 kg",
            dimensions: "60x40x40 cm",
          },
        ],
      },
    },
  },
}

export const WarehouseLocationTracker = () => {
  const { data = [], isLoading, error } = useLocations()

  const warehouseLocations = useMemo(() => buildWarehouseTree(data), [data])

  const [viewMode, setViewMode] = useState<"all" | "by_warehouse">("all")
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [selectedRack, setSelectedRack] = useState<any>(null)
  const [isRackModalOpen, setIsRackModalOpen] = useState(false)

  const resetFilters = () => {
    setSelectedWarehouse("all")
    setSelectedStatus("all")
    setSearchTerm("")
  }

  const getFilteredData = () => {
    let filtered = warehouseLocations

    if (viewMode === "by_warehouse") {
      if (selectedWarehouse !== "all") {
        filtered = {
          [selectedWarehouse]: warehouseLocations[selectedWarehouse],
        }
      }
    } else {
      const allLocationsFlattened: any = {}

      Object.entries(warehouseLocations).forEach(([warehouseId, warehouse]: [string, any]) => {
        if (selectedWarehouse === "all" || warehouseId === selectedWarehouse) {
          Object.entries(warehouse.racks).forEach(([rackId, rack]: [string, any]) => {
            allLocationsFlattened[rackId] = {
              ...rack,
              warehouseName: warehouse.name,
              warehouseLocation: warehouse.location,
              warehouseId: warehouseId,
            }
          })
        }
      })

      filtered = {
        "all-locations": {
          name: "All Locations",
          location: "Combined View",
          racks: allLocationsFlattened,
        },
      }
    }

    Object.keys(filtered).forEach((warehouseId) => {
      const warehouse = filtered[warehouseId]
      Object.keys(warehouse.racks).forEach((rackId) => {
        const rack = warehouse.racks[rackId]
        rack.locations = rack.locations.filter((location: any) => {
          const matchesStatus = selectedStatus === "all" || location.status === selectedStatus
          const matchesSearch =
            searchTerm === "" ||
            (location.trackingCode && location.trackingCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (location.description && location.description.toLowerCase().includes(searchTerm.toLowerCase()))

          return matchesStatus && matchesSearch
        })
      })
    })

    return filtered
  }

  const filteredData = getFilteredData()

  const handleLocationClick = (location: any, rack: any, warehouse: any) => {
    setSelectedLocation({ ...location, rack, warehouse })
    setIsDetailOpen(true)
  }

  const LocationCell = ({
    location,
    rack,
    warehouse,
  }: {
    location: any
    rack: any
    warehouse: any
  }) => {
    const status = statusConfig[location.status as keyof typeof statusConfig]

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
              onClick={(e) => {
                e.stopPropagation()
                handleLocationClick(location, rack, warehouse)
              }}
            >
              L{location.level}C{location.column}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="text-center space-y-1">
              <p className="font-semibold">{location.id}</p>
              <p className="text-sm">{status.label}</p>
              {location.trackingCode && <p className="text-xs font-mono">{location.trackingCode}</p>}
              {location.description && <p className="text-xs">{location.description}</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const RackCard = ({ rack, warehouse }: { rack: any; warehouse: any }) => {
    const totalLocations = rack.locations.length
    const occupiedLocations = rack.locations.filter((loc: any) => loc.status === "occupied").length
    const occupancyRate = Math.round((occupiedLocations / totalLocations) * 100)

    const locationsByLevel = rack.locations.reduce((acc: any, location: any) => {
      if (!acc[location.level]) {
        acc[location.level] = []
      }
      acc[location.level].push(location)
      return acc
    }, {})

    const handleRackClick = () => {
      setSelectedRack({ ...rack, warehouse })
      setIsRackModalOpen(true)
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
                {occupancyRate}% Full
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Grid3X3 className="w-4 h-4" />
                {rack.levels}L × {rack.columns}C
              </span>
              <span>
                {occupiedLocations}/{totalLocations} Occupied
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(locationsByLevel)
              .sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
              .map((level) => (
                <div key={level} className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Level {level}</div>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${rack.columns}, 1fr)`,
                    }}
                  >
                    {locationsByLevel[level]
                      .sort((a: any, b: any) => a.column - b.column)
                      .map((location: any) => (
                        <LocationCell key={location.id} location={location} rack={rack} warehouse={warehouse} />
                      ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Warehouse Location Tracker</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "all" | "by_warehouse")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all" className="text-xs">
                    All Locations
                  </TabsTrigger>
                  <TabsTrigger value="by_warehouse" className="text-xs">
                    By Warehouse
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {/* Botón de tema eliminado */}
            </div>
          </div>
        </div>
      </header>
      {isLoading && <div className="p-6 text-sm">Loading warehouse data…</div>}
      {error && <div className="p-6 text-red-600">Error loading locations</div>}

      {/* Main content is rendered below when not loading and no error */}
      {/* The main content area is already rendered below, so this block is not needed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      {Object.entries(warehouseLocations).map(([id, warehouse]: [string, any]) => (
                        <SelectItem key={id} value={id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {warehouse.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${config.color}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search">Tracking Code</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search tracking code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button variant="outline" onClick={resetFilters} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </CardContent>
            </Card>

            {/* Status Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Status Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${config.color}`} />
                    <span className="text-sm">{config.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(filteredData).map(([warehouseId, warehouse]: [string, any]) => {
                  const totalLocations = Object.values(warehouse.racks).reduce(
                    (acc: number, rack: any) => acc + rack.locations.length,
                    0,
                  )
                  const occupiedLocations = Object.values(warehouse.racks).reduce(
                    (acc: number, rack: any) =>
                      acc + rack.locations.filter((loc: any) => loc.status === "occupied").length,
                    0,
                  )
                  const occupancyRate = Math.round((occupiedLocations / totalLocations) * 100)

                  return (
                    <div key={warehouseId} className="space-y-1">
                      <div className="font-medium text-sm">{warehouse.name}</div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {occupiedLocations}/{totalLocations} occupied
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
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="space-y-8">
              {viewMode === "by_warehouse" ? (
                Object.entries(filteredData).map(([warehouseId, warehouse]: [string, any]) => (
                  <div key={warehouseId} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h2 className="text-2xl font-bold">{warehouse.name}</h2>
                        <p className="text-muted-foreground">{warehouse.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {Object.values(warehouse.racks).map((rack: any) => (
                        <RackCard key={rack.id} rack={rack} warehouse={warehouse} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Grid3X3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h2 className="text-2xl font-bold">All Warehouse Locations</h2>
                      <p className="text-muted-foreground">Combined view of all racks across warehouses</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {Object.entries(filteredData).flatMap(([warehouseId, warehouse]: [string, any]) =>
                      Object.values(warehouse.racks).map((rack: any) => (
                        <RackCard key={rack.id} rack={rack} warehouse={warehouse} />
                      )),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Panel */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Details
            </SheetTitle>
            <SheetDescription>
              {selectedLocation?.id} - {selectedLocation?.rack?.name}
            </SheetDescription>
          </SheetHeader>

          {selectedLocation && (
            <div className="mt-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge
                  className={`
                                        ${statusConfig[selectedLocation.status as keyof typeof statusConfig].bgColor}
                                        ${statusConfig[selectedLocation.status as keyof typeof statusConfig].textColor}
                                        ${
                                          statusConfig[selectedLocation.status as keyof typeof statusConfig].borderColor
                                        }
                                        border px-4 py-2
                                    `}
                >
                  {statusConfig[selectedLocation.status as keyof typeof statusConfig].label}
                </Badge>
              </div>

              {/* Location Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Location ID</p>
                    <p className="font-medium">{selectedLocation.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">
                      L{selectedLocation.level} C{selectedLocation.column}
                    </p>
                  </div>
                </div>

                <Separator />

                {selectedLocation.trackingCode && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Cargo Information</h3>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Tracking Code</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-medium">{selectedLocation.trackingCode}</p>
                          <Button variant="ghost" size="sm">
                            <Truck className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p>{selectedLocation.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="font-medium">{selectedLocation.weight}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Dimensions</p>
                          <p className="font-medium">{selectedLocation.dimensions}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Entry Date</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <p className="font-medium">{selectedLocation.entryDate}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Exit Date</p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <p className="font-medium">{selectedLocation.exitDate || "TBD"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Assigned User</p>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <p className="font-medium">{selectedLocation.assignedUser}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                {/* Warehouse Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Warehouse Information</h3>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Warehouse</p>
                    <p className="font-medium">{selectedLocation.warehouse?.name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rack</p>
                    <p className="font-medium">{selectedLocation.rack?.name}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2">
                  <Button className="w-full">
                    Update Status
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                  {selectedLocation.trackingCode && (
                    <Button variant="outline" className="w-full">
                      <Truck className="mr-2 w-4 h-4" />
                      Track Shipment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Rack Locations Modal */}
      <Sheet open={isRackModalOpen} onOpenChange={setIsRackModalOpen}>
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

          {selectedRack && (
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
                                              handleLocationClick(location, selectedRack, selectedRack.warehouse)
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
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
