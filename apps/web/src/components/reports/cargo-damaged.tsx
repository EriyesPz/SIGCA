"use client"

import { useState } from "react"
import {
  Filter,
  Download,
  FileText,
  Calendar,
  Search,
  Package,
  Weight,
  Hash,
  FileCheck,
} from "lucide-react"
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui"
import { generatePDF } from "@/utils/pdfExport";
import { generateExcelReport } from "@/utils/excelExport";

interface CargoDamaged {
  codigo: string
  descripcion: string
  categoria: string
  peso: number
  cantidad: number
  fechaIngreso: string
  ubicacion: string
  motivoDaño: string
  documentos: string[]
  creadoPor: string
  fechaDaño: string
  nivelDaño: "Leve" | "Moderado" | "Severo" | "Total"
}

const cargasDañadas: CargoDamaged[] = [
  {
    codigo: "TRK-2024-002",
    descripcion: "Camisetas polo algodón - Lote 50 unidades",
    categoria: "Textiles",
    peso: 12.5,
    cantidad: 50,
    fechaIngreso: "14/1/2024",
    ubicacion: "B2-1-5",
    motivoDaño: "Humedad por filtración en almacén",
    documentos: ["reporte_daño.pdf", "fotos_evidencia.pdf"],
    creadoPor: "María García",
    fechaDaño: "16/1/2024",
    nivelDaño: "Moderado",
  },
  {
    codigo: "TRK-2024-007",
    descripcion: "Electrodomésticos - Licuadoras industriales x5",
    categoria: "Electrónicos",
    peso: 45.0,
    cantidad: 5,
    fechaIngreso: "18/1/2024",
    ubicacion: "A1-3-2",
    motivoDaño: "Caída durante manipulación",
    documentos: [
      "acta_incidente.pdf",
      "evaluacion_tecnica.pdf",
      "fotos_daño.pdf",
    ],
    creadoPor: "Carlos Fernández",
    fechaDaño: "19/1/2024",
    nivelDaño: "Severo",
  },
  {
    codigo: "TRK-2024-012",
    descripcion: "Medicamentos refrigerados - Lote INS-2024",
    categoria: "Farmacéuticos",
    peso: 15.8,
    cantidad: 200,
    fechaIngreso: "20/1/2024",
    ubicacion: "F1-2-1",
    motivoDaño: "Falla en sistema de refrigeración",
    documentos: ["reporte_temperatura.pdf", "certificado_perdida.pdf"],
    creadoPor: "Ana Martínez",
    fechaDaño: "21/1/2024",
    nivelDaño: "Total",
  },
  {
    codigo: "TRK-2024-015",
    descripcion: "Envases de vidrio - Botellas decorativas x100",
    categoria: "Decoración",
    peso: 28.3,
    cantidad: 100,
    fechaIngreso: "22/1/2024",
    ubicacion: "C3-1-4",
    motivoDaño: "Rotura por manipulación inadecuada",
    documentos: ["reporte_incidente.pdf"],
    creadoPor: "Luis Fernández",
    fechaDaño: "22/1/2024",
    nivelDaño: "Leve",
  },
]

export const CargoDamaged = () => {
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("01/15/2024")
  const [filtroFechaFin, setFiltroFechaFin] = useState("01/25/2024")
  const [filtroCodigo, setFiltroCodigo] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [filtroNivelDaño, setFiltroNivelDaño] = useState("todos")

  const cargasFiltradas = cargasDañadas.filter((carga) => {
    return (
      (filtroCodigo === "" ||
        carga.codigo.toLowerCase().includes(filtroCodigo.toLowerCase())) &&
      (filtroCategoria === "todos" ||
        carga.categoria.toLowerCase() === filtroCategoria) &&
      (filtroNivelDaño === "todos" ||
        carga.nivelDaño.toLowerCase() === filtroNivelDaño)
    )
  })

  const totalCargas = cargasFiltradas.length
  const pesoTotal = cargasFiltradas.reduce((sum, carga) => sum + carga.peso, 0)
  const totalUnidades = cargasFiltradas.reduce(
    (sum, carga) => sum + carga.cantidad,
    0,
  )
  const conDocumentos = cargasFiltradas.filter(
    (carga) => carga.documentos.length > 0,
  ).length

  const getBadgeVariant = (nivel: string) => {
    switch (nivel) {
      case "Leve":
        return "secondary"
      case "Moderado":
        return "default"
      case "Severo":
      case "Total":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-gray-100 p-6">
      {/* Title Section */}
      <div className="bg-gradient-to-r  rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-8 w-8 text-red-500 dark:text-red-400" />
          <h1 className="text-3xl">Reporte de Cargas Dañadas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Lista completa de cargas con daños registrados y documentos adjuntos
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-red-500 dark:text-red-400" />
            <div>
              <h3 className="font-medium">Reporte de Cargas Dañadas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalCargas} registros • {filtroFechaInicio} - {filtroFechaFin}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Vista previa
            </Button>
            <Button variant="destructive" size="sm">
              Generar reporte
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <h3 className="font-medium">Filtros de Cargas Dañadas</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Fecha Inicio</label>
            <div className="relative">
              <Input
                type="text"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pl-8"
              />
              <Calendar className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Fecha Fin</label>
            <div className="relative">
              <Input
                type="text"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pl-8"
              />
              <Calendar className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Código de Seguimiento</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por código..."
                value={filtroCodigo}
                onChange={(e) => setFiltroCodigo(e.target.value)}
                className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pl-8"
              />
              <Search className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Categoría</label>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600">
                <SelectItem value="todos">Todas las categorías</SelectItem>
                <SelectItem value="textiles">Textiles</SelectItem>
                <SelectItem value="electronicos">Electrónicos</SelectItem>
                <SelectItem value="farmaceuticos">Farmacéuticos</SelectItem>
                <SelectItem value="decoracion">Decoración</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Nivel de Daño</label>
            <Select value={filtroNivelDaño} onValueChange={setFiltroNivelDaño}>
              <SelectTrigger className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Todos los niveles" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600">
                <SelectItem value="todos">Todos los niveles</SelectItem>
                <SelectItem value="leve">Leve</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="severo">Severo</SelectItem>
                <SelectItem value="total">Total</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={() => {
              setFiltroCodigo("")
              setFiltroCategoria("todos")
              setFiltroNivelDaño("todos")
            }}>
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Package className="h-6 w-6 text-red-500 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Cargas Dañadas
                </p>
                <p className="text-2xl">{totalCargas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Weight className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Peso Total Afectado
                </p>
                <p className="text-2xl">{pesoTotal.toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Hash className="h-6 w-6 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Unidades Afectadas
                </p>
                <p className="text-2xl">{totalUnidades}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <FileCheck className="h-6 w-6 text-orange-500 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Con Documentación
                </p>
                <p className="text-2xl">{conDocumentos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Table */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="font-medium">Detalle de Cargas Dañadas</h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-slate-700">
                {[
                  "Código",
                  "Descripción",
                  "Categoría",
                  "Peso (kg)",
                  "Cantidad",
                  "Fecha Ingreso",
                  "Fecha Daño",
                  "Nivel Daño",
                  "Ubicación",
                  "Motivo",
                  "Documentos",
                  "Creado Por",
                ].map((h) => (
                  <TableHead key={h} className="text-gray-600 dark:text-gray-300">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargasFiltradas.map((carga) => (
                <TableRow key={carga.codigo} className="border-gray-200 dark:border-slate-700">
                  <TableCell className="text-blue-600 dark:text-blue-400">
                    {carga.codigo}
                  </TableCell>
                  <TableCell>{carga.descripcion}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                      {carga.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>{carga.peso}</TableCell>
                  <TableCell>{carga.cantidad}</TableCell>
                  <TableCell>{carga.fechaIngreso}</TableCell>
                  <TableCell>{carga.fechaDaño}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(carga.nivelDaño)}>
                      {carga.nivelDaño}
                    </Badge>
                  </TableCell>
                  <TableCell>{carga.ubicacion}</TableCell>
                  <TableCell
                    className="max-w-48 truncate"
                    title={carga.motivoDaño}
                  >
                    {carga.motivoDaño}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {carga.documentos.map((doc, index) => (
                        <a
                          key={index}
                          href="#"
                          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-xs truncate max-w-32"
                          title={doc}
                        >
                          {doc}
                        </a>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center text-xs text-white">
                      {carga.creadoPor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-sm">{carga.creadoPor}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Reporte generado el 21 de julio de 2025, 09:20</p>
          <p>Sistema de Gestión de Almacén - {totalCargas} registros encontrados</p>
        </div>
      </div>
    </div>
  )
}
