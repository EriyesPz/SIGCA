import { useState } from "react"
import { Search, Package, Clock, QrCode, AlertTriangle, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/providers/theme-provider"

const cargoTypes = {
  general: { name: "General", color: "bg-green-500", icon: "📦" },
  courier: { name: "Courier", color: "bg-blue-500", icon: "📬" },
  explosivos: { name: "Peligrosos - Explosivos", color: "bg-red-500", icon: "💥" },
  gases: { name: "Peligrosos - Gases", color: "bg-orange-500", icon: "🧪" },
  combustibles: { name: "Peligrosos - Combustibles", color: "bg-yellow-500", icon: "🔥" },
  toxicos: { name: "Peligrosos - Sustancias tóxicas", color: "bg-purple-500", icon: "☠️" },
  corrosivos: { name: "Peligrosos - Sustancias corrosivas", color: "bg-amber-700", icon: "⚗️" },
  frio: { name: "Cuarto Frío", color: "bg-sky-500", icon: "❄️" },
  fresco: { name: "Cuarto Fresco", color: "bg-emerald-500", icon: "🌿" },
}

// Mock data for warehouse racks
const warehouseData = {
  "Zona A": [
    {
      id: "A1",
      name: "Rack General #1",
      type: "general",
      status: "ocupado",
      qr: true,
      cargo: {
        id: "AWB-2024-001",
        description: "Equipos electrónicos",
        time: "3 días",
        weight: "450 kg",
        status: "normal",
        destination: "San Pedro Sula",
        arrival: "2024-06-05",
        company: "Electro Honduras S.A.",
      },
    },
    {
      id: "A2",
      name: "Rack General #2",
      type: "general",
      status: "libre",
      qr: false,
      cargo: null,
    },
    {
      id: "A3",
      name: "Rack General #3",
      type: "general",
      status: "alerta",
      qr: true,
      cargo: {
        id: "AWB-2024-002",
        description: "Repuestos automotrices",
        time: "15 días",
        weight: "780 kg",
        status: "vencido",
        destination: "Tegucigalpa",
        arrival: "2024-05-24",
        company: "Auto Parts Honduras",
      },
    },
    {
      id: "A4",
      name: "Rack General #4",
      type: "general",
      status: "ocupado",
      qr: true,
      cargo: {
        id: "AWB-2024-003",
        description: "Maquinaria industrial",
        time: "7 días",
        weight: "1200 kg",
        status: "normal",
        destination: "La Ceiba",
        arrival: "2024-06-01",
        company: "Industrias Centroamericanas",
      },
    },
    {
      id: "A5",
      name: "Rack General #5",
      type: "general",
      status: "libre",
      qr: false,
      cargo: null,
    },
  ],
  "Zona B": [
    {
      id: "B1",
      name: "Rack Courier #1",
      type: "courier",
      status: "ocupado",
      qr: true,
      cargo: {
        id: "AWB-2024-004",
        description: "Paquetería express",
        time: "1 día",
        weight: "85 kg",
        status: "normal",
        destination: "Tegucigalpa",
        arrival: "2024-06-07",
        company: "Express Delivery Honduras",
      },
    },
    {
      id: "B2",
      name: "Rack Courier #2",
      type: "courier",
      status: "ocupado",
      qr: true,
      cargo: {
        id: "AWB-2024-005",
        description: "Documentos urgentes",
        time: "2 días",
        weight: "12 kg",
        status: "normal",
        destination: "San Pedro Sula",
        arrival: "2024-06-06",
        company: "Documentos Express",
      },
    },
    {
      id: "B3",
      name: "Rack Courier #3",
      type: "courier",
      status: "libre",
      qr: false,
      cargo: null,
    },
  ],
  "Zona C": [
    {
      id: "C1",
      name: "Rack Explosivos #1",
      type: "explosivos",
      status: "ocupado",
      qr: true,
      cargo: {
        id: "AWB-2024-006",
        description: "Material pirotécnico",
        time: "4 días",
        weight: "320 kg",
        status: "normal",
        destination: "Comayagua",
        arrival: "2024-06-04",
        company: "Pirotecnia Industrial",
      },
    },
    {
      id: "C2",
      name: "Rack Gases #1",
      type: "gases",
      status: "alerta",
      qr: true,
      cargo: {
        id: "AWB-2024-007",
        description: "Cilindros de gas industrial",
        time: "10 días",
        weight: "560 kg",
        status: "clasificación incorrecta",
        destination: "Choluteca",
        arrival: "2024-05-29",
        company: "Gases Industriales CA",
      },
    },
    {
      id: "C3",
      name: "Rack Combustibles #1",
      type: "combustibles",
      status: "ocupado",
      qr: true,
      cargo: {
        id: "AWB-2024-008",
        description: "Combustible de aviación",
        time: "6 días",
        weight: "890 kg",
        status: "normal",
        destination: "Roatán",
        arrival: "2024-06-02",
        company: "Combustibles Aéreos",
      },
    },
  ],
  "Zona D": [
    {
      id: "D1",
      name: "Rack Tóxicos #1",
      type: "toxicos",
      status: "ocupado",
      qr: true,
      cargo: {
        id: "AWB-2024-009",
        description: "Productos químicos industriales",
        time: "5 días",
        weight: "430 kg",
        status: "normal",
        destination: "El Progreso",
        arrival: "2024-06-03",
        company: "Químicos Industriales",
      },
    },
    {
      id: "D2",
      name: "Rack Corrosivos #1",
      type: "corrosivos",
      status: "libre",
      qr: false,
      cargo: null,
    },
  ],
  "Zona E": [
    {
      id: "E1",
      name: "Cuarto Frío #1",
      type: "frio",
      status: "ocupado",
      qr: true,
      cargo: {
        id: "AWB-2024-010",
        description: "Productos farmacéuticos",
        time: "2 días",
        weight: "175 kg",
        status: "normal",
        destination: "San Pedro Sula",
        arrival: "2024-06-06",
        company: "Farmacéutica Hondureña",
      },
    },
    {
      id: "E2",
      name: "Cuarto Fresco #1",
      type: "fresco",
      status: "alerta",
      qr: true,
      cargo: {
        id: "AWB-2024-011",
        description: "Productos agrícolas",
        time: "8 días",
        weight: "640 kg",
        status: "vencido",
        destination: "Tegucigalpa",
        arrival: "2024-05-31",
        company: "Agrícola del Valle",
      },
    },
  ],
}

const statusColors = {
  libre: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  ocupado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  alerta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
}

const statusLabels = {
  libre: "Libre",
  ocupado: "Ocupado",
  alerta: "Alerta",
}

const cargoStatusColors = {
  normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  vencido: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  "clasificación incorrecta": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
}

export const Warehouse = () => {
  useTheme()
  const [selectedZone, setSelectedZone] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRack, setSelectedRack] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Filter the warehouse data based on selected filters
  const filteredData = Object.entries(warehouseData)
    .filter(([zone]) => selectedZone === "all" || zone === selectedZone)
    .map(([zone, racks]) => [
      zone,
      racks.filter(
        (rack) =>
          (selectedType === "all" || rack.type === selectedType) &&
          (selectedStatus === "all" || rack.status === selectedStatus) &&
          (searchTerm === "" ||
            rack.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (rack.cargo?.id && rack.cargo.id.toLowerCase().includes(searchTerm.toLowerCase()))),
      ),
    ])
    .filter(([_, racks]) => (racks as any[]).length > 0)

  const handleRackClick = (rack: any) => {
    setSelectedRack(rack)
    setIsDetailOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SIGCA - Mapa Visual del Almacén</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                Aeropuerto Internacional de Honduras
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search" className="text-sm font-medium mb-1 block">
                  Buscar
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="ID, Rack o Guía aérea..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="zone" className="text-sm font-medium mb-1 block">
                  Zona
                </Label>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las zonas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las zonas</SelectItem>
                    {Object.keys(warehouseData).map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type" className="text-sm font-medium mb-1 block">
                  Tipo de carga
                </Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {Object.entries(cargoTypes).map(([key, { name }]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium mb-1 block">
                  Estado
                </Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="libre">Libre</SelectItem>
                    <SelectItem value="ocupado">Ocupado</SelectItem>
                    <SelectItem value="alerta">Alerta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Map */}
        <div className="grid grid-cols-1 gap-6">
          <Tabs defaultValue="map" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="map">Vista de Mapa</TabsTrigger>
              <TabsTrigger value="list">Vista de Lista</TabsTrigger>
            </TabsList>

            <TabsContent value="map">
              <div className="grid grid-cols-1 gap-6">
                {filteredData.map(([zone, racks]) => (
                  <Card key={String(zone)} className="overflow-hidden">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{typeof zone === "string" ? zone : ""}</h2>
                    </div>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {(racks as any[]).map((rack) => (
                          <TooltipProvider key={rack.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`
                                    relative rounded-lg border dark:border-gray-700 overflow-hidden
                                    transition-all duration-200 cursor-pointer
                                    hover:shadow-md hover:scale-105
                                    ${rack.status === "alerta" ? "animate-pulse-slow" : ""}
                                  `}
                                  onClick={() => handleRackClick(rack)}
                                >
                                  {/* Color strip based on cargo type */}
                                  <div
                                    className={`h-2 w-full ${cargoTypes[rack.type as keyof typeof cargoTypes].color}`}
                                  />

                                  <div className="p-3">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-medium text-sm">{rack.id}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {cargoTypes[rack.type as keyof typeof cargoTypes].icon}
                                      </Badge>
                                    </div>

                                    <h3 className="text-sm font-semibold mb-2 truncate" title={rack.name}>
                                      {rack.name}
                                    </h3>

                                    <div className="flex justify-between items-center">
                                      <Badge className={`${statusColors[rack.status as keyof typeof statusColors]}`}>
                                        {statusLabels[rack.status as keyof typeof statusLabels]}
                                      </Badge>

                                      {rack.qr && <QrCode className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                                    </div>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <div className="text-center">
                                  <p className="font-semibold">{rack.name}</p>
                                  <p className="text-sm">{cargoTypes[rack.type as keyof typeof cargoTypes].name}</p>
                                  <p className="text-xs">{statusLabels[rack.status as keyof typeof statusLabels]}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Nombre</th>
                          <th className="px-4 py-3 text-left">Tipo</th>
                          <th className="px-4 py-3 text-left">Estado</th>
                          <th className="px-4 py-3 text-left">Zona</th>
                          <th className="px-4 py-3 text-left">Guía Aérea</th>
                          <th className="px-4 py-3 text-left">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        {filteredData.flatMap(([zone, racks]) =>
                          (racks as any[]).map((rack) => (
                            <tr key={rack.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="px-4 py-3">{rack.id}</td>
                              <td className="px-4 py-3">{rack.name}</td>
                              <td className="px-4 py-3">
                                <Badge
                                  className={`${cargoTypes[rack.type as keyof typeof cargoTypes].color} text-white`}
                                >
                                  {cargoTypes[rack.type as keyof typeof cargoTypes].name}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={`${statusColors[rack.status as keyof typeof statusColors]}`}>
                                  {statusLabels[rack.status as keyof typeof statusLabels]}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">{typeof zone === "string" ? zone : ""}</td>
                              <td className="px-4 py-3">{rack.cargo?.id || "-"}</td>
                              <td className="px-4 py-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRackClick(rack)}
                                  disabled={rack.status === "libre"}
                                >
                                  Ver detalles
                                </Button>
                              </td>
                            </tr>
                          )),
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Legend */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Leyenda</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(cargoTypes).map(([key, { name, color, icon }]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${color}`}></div>
                  <span className="text-sm">
                    {icon} {name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cargo Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {selectedRack?.name}
            </SheetTitle>
            <SheetDescription>Información detallada del rack y su carga</SheetDescription>
          </SheetHeader>

          {selectedRack && (
            <div className="mt-6 space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Información del Rack</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="font-medium">{selectedRack.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <Badge className={`${cargoTypes[selectedRack.type as keyof typeof cargoTypes].color} text-white`}>
                      {cargoTypes[selectedRack.type as keyof typeof cargoTypes].name}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <Badge className={`${statusColors[selectedRack.status as keyof typeof statusColors]}`}>
                      {statusLabels[selectedRack.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedRack.cargo ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información de Carga</h3>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Guía Aérea</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{selectedRack.cargo.id}</p>
                      {selectedRack.qr && <QrCode className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Descripción</p>
                    <p>{selectedRack.cargo.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tiempo de Permanencia</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <p>{selectedRack.cargo.time}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p>{selectedRack.cargo.weight}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <Badge
                        className={`${cargoStatusColors[selectedRack.cargo.status as keyof typeof cargoStatusColors]}`}
                      >
                        {selectedRack.cargo.status}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Destino</p>
                      <p>{selectedRack.cargo.destination}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Fecha de Llegada</p>
                      <p>{selectedRack.cargo.arrival}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Empresa</p>
                      <p>{selectedRack.cargo.company}</p>
                    </div>
                  </div>

                  {selectedRack.status === "alerta" && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-300">Alerta</p>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          {selectedRack.cargo.status === "vencido"
                            ? "Esta carga ha excedido su tiempo máximo de almacenamiento."
                            : "Esta carga está mal clasificada y requiere revisión."}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button className="w-full">
                      Ver más detalles
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Este rack está libre y no contiene carga.</p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
