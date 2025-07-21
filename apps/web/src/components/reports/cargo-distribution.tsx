import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from "@/components/ui";
import {
  FileText,
  Eye,
  Download,
  FileSpreadsheet,
  Filter,
  RotateCcw,
  Package,
  Warehouse,
  Archive,
  TrendingUp,
} from "lucide-react";

const mockData = [
  {
    codigo: "UBC-2024-001",
    descripcion: "Smartphones - Samsung Galaxy A54",
    almacen: "Almacen General",
    rack: "R-01",
    nivel: "N-03",
    columna: "C-05",
    categoria: "Electrónicos",
    cantidad: 45,
    capacidad: 60,
    utilizacion: 75,
    fechaActualizacion: "15/1/2024",
    responsable: "Juan Pérez",
  },
  {
    codigo: "UBC-2024-002",
    descripcion: "Ropa deportiva - Lote 30 piezas",
    almacen: "Almacen General",
    rack: "R-02",
    nivel: "N-02",
    columna: "C-12",
    categoria: "Textiles",
    cantidad: 28,
    capacidad: 40,
    utilizacion: 70,
    fechaActualizacion: "15/1/2024",
    responsable: "María González",
  },
  {
    codigo: "UBC-2024-003",
    descripcion: "Medicamentos varios - Pedido farmacia",
    almacen: "Almacen General",
    rack: "R-01",
    nivel: "N-01",
    columna: "C-08",
    categoria: "Farmacéuticos",
    cantidad: 120,
    capacidad: 150,
    utilizacion: 80,
    fechaActualizacion: "16/1/2024",
    responsable: "Carlos Rodríguez",
  },
  {
    codigo: "UBC-2024-004",
    descripcion: "Electrodomésticos - Licuadora y tostadora",
    almacen: "Almacen General",
    rack: "R-03",
    nivel: "N-04",
    columna: "C-03",
    categoria: "Electrodomésticos",
    cantidad: 18,
    capacidad: 25,
    utilizacion: 72,
    fechaActualizacion: "16/1/2024",
    responsable: "Ana Martínez",
  },
  {
    codigo: "UBC-2024-005",
    descripcion: "Artículos de oficina - Kit completo",
    almacen: "Almacen General",
    rack: "R-02",
    nivel: "N-01",
    columna: "C-15",
    categoria: "Oficina",
    cantidad: 85,
    capacidad: 100,
    utilizacion: 85,
    fechaActualizacion: "17/1/2024",
    responsable: "Luis Fernández",
  },
];

const getUtilizacionBadge = (utilizacion: number) => {
  if (utilizacion >= 80)
    return { variant: "destructive" as const, text: "Alta" };
  if (utilizacion >= 60) return { variant: "default" as const, text: "Media" };
  return { variant: "secondary" as const, text: "Baja" };
};

export const DistributionCargo = () => {
  const [fechaInicio, setFechaInicio] = useState("01/16/2024");
  const [fechaFin, setFechaFin] = useState("01/18/2024");

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-white">
                  Reporte de Distribución por Ubicación
                </h1>
                <p className="text-slate-400">
                  Análisis detallado de Rack, Nivel y Columna • 2024-01-16 -
                  2024-01-18
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista previa
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Descargar Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-slate-400" />
            <h2 className="text-slate-200">
              Filtros de Distribución por Ubicación
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Fecha Inicio
              </label>
              <Input
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Fecha Fin
              </label>
              <Input
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Rack</label>
              <Select>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Buscar por rack..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los racks</SelectItem>
                  <SelectItem value="R-01">Rack R-01</SelectItem>
                  <SelectItem value="R-02">Rack R-02</SelectItem>
                  <SelectItem value="R-03">Rack R-03</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Categoría
              </label>
              <Select>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="electronics">Electrónicos</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                  <SelectItem value="pharmaceuticals">Farmacéuticos</SelectItem>
                  <SelectItem value="appliances">Electrodomésticos</SelectItem>
                  <SelectItem value="office">Oficina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-600 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400">Total Ubicaciones</p>
                  <p className="text-2xl text-white">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Warehouse className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400">Ocupadas</p>
                  <p className="text-2xl text-white">18</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Archive className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400">Disponibles</p>
                  <p className="text-2xl text-white">6</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400">Utilización Promedio</p>
                  <p className="text-2xl text-white">76%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Detalle */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-slate-200">
              Detalle de Distribución por Ubicación
            </h3>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/50">
                  <TableHead className="text-slate-300">Código</TableHead>
                  <TableHead className="text-slate-300">Descripción</TableHead>
                  <TableHead className="text-slate-300">Almacen</TableHead>
                  <TableHead className="text-slate-300">Rack</TableHead>
                  <TableHead className="text-slate-300">Nivel</TableHead>
                  <TableHead className="text-slate-300">Columna</TableHead>
                  <TableHead className="text-slate-300">Categoría</TableHead>
                  <TableHead className="text-slate-300">Cantidad</TableHead>
                  <TableHead className="text-slate-300">Capacidad</TableHead>
                  <TableHead className="text-slate-300">Utilización</TableHead>
                  <TableHead className="text-slate-300">Fecha</TableHead>
                  <TableHead className="text-slate-300">Responsable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item, index) => {
                  const utilizacionBadge = getUtilizacionBadge(
                    item.utilizacion
                  );
                  return (
                    <TableRow
                      key={index}
                      className="border-slate-700 hover:bg-slate-700/50"
                    >
                      <TableCell className="text-slate-300">
                        {item.codigo}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {item.descripcion}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <Badge
                          variant="outline"
                          className="text-yellow-400 border-yellow-400"
                        >
                          {item.almacen}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-blue-400 border-blue-400"
                        >
                          {item.rack}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-green-400 border-green-400"
                        >
                          {item.nivel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-purple-400 border-purple-400"
                        >
                          {item.columna}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {item.categoria}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {item.cantidad}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {item.capacidad}
                      </TableCell>
                      <TableCell>
                        <Badge variant={utilizacionBadge.variant}>
                          {item.utilizacion}% - {utilizacionBadge.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {item.fechaActualizacion}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {item.responsable}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
