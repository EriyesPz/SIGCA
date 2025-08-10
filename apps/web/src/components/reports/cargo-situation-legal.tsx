import { useState } from "react";
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
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from "@/components/ui";
import { FileText, Download, Filter, RotateCcw } from "lucide-react";
import { PDFPreview } from "@/components/pdf";
import { generatePDF } from "@/utils/pdfExport";

const cargasData = [
  {
    codigo: "CLM-2024-001",
    descripcion: "Medicamentos varios - Lote farmacéutico",
    tipoSituacion: "Documentación Incompleta",
    subTipo: "Sanitaria",
    antiguedad: "8-30 días",
    ubicacion: "Bodega SAN-EHISA",
    cantidad: 150,
    capacidad: 200,
    utilizacion: "75%",
    fecha: "10/01/2024",
    responsable: "Ana Martínez",
    demora: 12,
    costoAlmacenaje: 2400,
  },
  {
    codigo: "CLM-2024-002",
    descripcion: "Equipos electrónicos - Smartphones",
    tipoSituacion: "Retención Judicial",
    subTipo: "Orden judicial",
    antiguedad: ">30 días",
    ubicacion: "Área Externa",
    cantidad: 45,
    capacidad: 60,
    utilizacion: "75%",
    fecha: "15/12/2023",
    responsable: "Carlos Rodríguez",
    demora: 45,
    costoAlmacenaje: 8900,
  },
  {
    codigo: "CLM-2024-003",
    descripcion: "Productos alimenticios - Perecederos",
    tipoSituacion: "Documentación Incompleta",
    subTipo: "Aduanal",
    antiguedad: "0-7 días",
    ubicacion: "Bodega SAN-EHISA",
    cantidad: 80,
    capacidad: 100,
    utilizacion: "80%",
    fecha: "18/01/2024",
    responsable: "María González",
    demora: 3,
    costoAlmacenaje: 450,
  },
  {
    codigo: "CLM-2024-004",
    descripcion: "Textiles - Ropa deportiva",
    tipoSituacion: "Retención Aduanal",
    subTipo: "Valoración pendiente",
    antiguedad: "8-30 días",
    ubicacion: "Bodega SAN-EHISA",
    cantidad: 28,
    capacidad: 40,
    utilizacion: "70%",
    fecha: "05/01/2024",
    responsable: "Luis Fernández",
    demora: 18,
    costoAlmacenaje: 3200,
  },
  {
    codigo: "CLM-2024-005",
    descripcion: "Maquinaria industrial - Repuestos",
    tipoSituacion: "Documentación Incompleta",
    subTipo: "Técnica",
    antiguedad: "8-30 días",
    ubicacion: "Área Externa",
    cantidad: 12,
    capacidad: 25,
    utilizacion: "48%",
    fecha: "12/01/2024",
    responsable: "Juan Pérez",
    demora: 14,
    costoAlmacenaje: 2800,
  },
];

const getSituacionColor = (tipo: string) => {
  switch (tipo) {
    case "Documentación Incompleta":
      return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
    case "Retención Judicial":
      return "bg-red-500/10 text-red-700 border-red-200";
    case "Retención Aduanal":
      return "bg-orange-500/10 text-orange-700 border-orange-200";
    default:
      return "bg-gray-500/10 text-gray-700 border-gray-200";
  }
};

const getAntiguedadColor = (antiguedad: string) => {
  switch (antiguedad) {
    case "0-7 días":
      return "bg-green-500/10 text-green-700 border-green-200";
    case "8-30 días":
      return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
    case ">30 días":
      return "bg-red-500/10 text-red-700 border-red-200";
    default:
      return "bg-gray-500/10 text-gray-700 border-gray-200";
  }
};

const getUtilizacionColor = (utilizacion: string) => {
  const percent = parseInt(utilizacion);
  if (percent >= 80) return "bg-red-500/10 text-red-700 border-red-200";
  if (percent >= 60)
    return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
  return "bg-green-500/10 text-green-700 border-green-200";
};

export const SituationLegal = () => {
  const [fechaInicio, setFechaInicio] = useState("01/16/2024");
  const [fechaFin, setFechaFin] = useState("01/18/2024");
  const [tipoSituacion, setTipoSituacion] = useState("todas");
  const [ubicacion, setUbicacion] = useState("todas");
  const [showPDF, setShowPDF] = useState(false);

  const pdfColumns = [
    { header: "Código", accessor: "codigo" },
    { header: "Descripción", accessor: "descripcion" },
    { header: "Situación", accessor: "tipoSituacion" },
    { header: "Subtipo", accessor: "subTipo" },
    { header: "Antigüedad", accessor: "antiguedad" },
    { header: "Ubicación", accessor: "ubicacion" },
    { header: "Cantidad", accessor: "cantidad" },
    {
      header: "Demora",
      accessor: "demora",
      render: (v: number) => `${v} días`,
    },
    {
      header: "Costo",
      accessor: "costoAlmacenaje",
      render: (v: number) => `$${v.toLocaleString()}`,
    },
  ];

  // Cálculos para los indicadores
  const totalCargas = cargasData.length;
  const cargasPendientes = cargasData.filter(
    (c) =>
      c.tipoSituacion === "Documentación Incompleta" ||
      c.tipoSituacion === "Retención Judicial" ||
      c.tipoSituacion === "Retención Aduanal"
  ).length;
  const porcentajePendientes = Math.round(
    (cargasPendientes / totalCargas) * 100
  );
  const demoraPromedio = Math.round(
    cargasData.reduce((acc, c) => acc + c.demora, 0) / totalCargas
  );
  const costoTotalAlmacenaje = cargasData.reduce(
    (acc, c) => acc + c.costoAlmacenaje,
    0
  );

  const summarySection = (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="text-center p-4 bg-red-50 border border-red-200 rounded">
        <div className="text-2xl font-bold text-red-600">{totalCargas}</div>
        <div className="text-sm text-gray-600">Total Cargas</div>
      </div>
      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded">
        <div className="text-2xl font-bold text-yellow-600">
          {cargasPendientes}
        </div>
        <div className="text-sm text-gray-600">Pendientes</div>
      </div>
      <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded">
        <div className="text-2xl font-bold text-blue-600">
          {porcentajePendientes}%
        </div>
        <div className="text-sm text-gray-600">% Pendiente</div>
      </div>
      <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded">
        <div className="text-2xl font-bold text-orange-600">
          {demoraPromedio}
        </div>
        <div className="text-sm text-gray-600">Días Promedio</div>
      </div>
    </div>
  );

  const analysisSection = (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">
          Indicadores Operacionales
        </h4>
        <ul className="text-sm space-y-1">
          <li>• Demora promedio: {demoraPromedio} días</li>
          <li>
            • Costo total almacenaje: ${costoTotalAlmacenaje.toLocaleString()}
          </li>
          <li>
            • Cargas críticas (&gt;30 días):{" "}
            {cargasData.filter((c) => c.antiguedad === ">30 días").length}
          </li>
          <li>
            • Productos perecederos afectados:{" "}
            {
              cargasData.filter(
                (c) =>
                  c.descripcion.includes("Perecederos") ||
                  c.descripcion.includes("alimenticios")
              ).length
            }
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones</h4>
        <ul className="text-sm space-y-1">
          <li>• Priorizar cargas perecederos</li>
          <li>• Revisar documentación sanitaria</li>
          <li>• Gestionar retenciones judiciales</li>
          <li>• Implementar alertas automáticas</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Situación Legal de Cargas
        </h1>
      </div>
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  generatePDF(
                    "Situación Legal de Cargas",
                    pdfColumns,
                    cargasData,
                    `Total cargas: ${totalCargas}\nPendientes: ${cargasPendientes}\n% Pendiente: ${porcentajePendientes}%\nDemora promedio: ${demoraPromedio} días`,
                    `• Priorizar cargas perecederas\n• Revisar documentación sanitaria\n• Gestionar retenciones judiciales\n• Implementar alertas automáticas`
                  )
                }
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Filtros */}
        <Card className=" dark:bg-slate-950 border-slate-700">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <CardTitle className="text-slate-200">
                Filtros de Situación Legal
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">
                  Fecha Inicio
                </label>
                <Input
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">
                  Fecha Fin
                </label>
                <Input
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">
                  Tipo de Situación
                </label>
                <Select value={tipoSituacion} onValueChange={setTipoSituacion}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue placeholder="Seleccionar tipo..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="todas">Todas las situaciones</SelectItem>
                    <SelectItem value="documentacion">
                      Documentación Incompleta
                    </SelectItem>
                    <SelectItem value="judicial">Retención Judicial</SelectItem>
                    <SelectItem value="aduanal">Retención Aduanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">
                  Ubicación
                </label>
                <Select value={ubicacion} onValueChange={setUbicacion}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue placeholder="Seleccionar ubicación..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="todas">Todas las ubicaciones</SelectItem>
                    <SelectItem value="bodega">Bodega SAN-EHISA</SelectItem>
                    <SelectItem value="externa">Área Externa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Indicadores Clave */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800 dark:bg-slate-950 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">
                    Total Cargas Analizadas
                  </p>
                  <p className="text-2xl font-semibold text-slate-200">
                    {totalCargas}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 dark:bg-slate-950 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">
                    Situación Legal Pendiente
                  </p>
                  <p className="text-2xl font-semibold text-slate-200">
                    {cargasPendientes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 dark:bg-slate-950 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">
                    % Situación Pendiente
                  </p>
                  <p className="text-2xl font-semibold text-slate-200">
                    {porcentajePendientes}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 dark:bg-slate-950 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">
                    Demora Promedio (días)
                  </p>
                  <p className="text-2xl font-semibold text-slate-200">
                    {demoraPromedio}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla Detallada */}
        <Card className="bg-slate-800 dark:bg-slate-950 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">
              Detalle de Situación Legal por Carga
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableHead className="text-slate-300">Código</TableHead>
                    <TableHead className="text-slate-300">
                      Descripción
                    </TableHead>
                    <TableHead className="text-slate-300">
                      Situación Legal
                    </TableHead>
                    <TableHead className="text-slate-300">Subtipo</TableHead>
                    <TableHead className="text-slate-300">Antigüedad</TableHead>
                    <TableHead className="text-slate-300">Ubicación</TableHead>
                    <TableHead className="text-slate-300">Cantidad</TableHead>
                    <TableHead className="text-slate-300">Capacidad</TableHead>
                    <TableHead className="text-slate-300">
                      Utilización
                    </TableHead>
                    <TableHead className="text-slate-300">Fecha</TableHead>
                    <TableHead className="text-slate-300">
                      Responsable
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cargasData.map((carga, index) => (
                    <TableRow
                      key={index}
                      className="border-slate-700 hover:bg-slate-700/30"
                    >
                      <TableCell className="text-slate-300 font-medium">
                        {carga.codigo}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {carga.descripcion}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getSituacionColor(carga.tipoSituacion)}
                        >
                          {carga.tipoSituacion}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {carga.subTipo}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getAntiguedadColor(carga.antiguedad)}
                        >
                          {carga.antiguedad}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {carga.ubicacion}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {carga.cantidad}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {carga.capacidad}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getUtilizacionColor(carga.utilizacion)}
                        >
                          {carga.utilizacion}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {carga.fecha}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {carga.responsable}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Impacto y Costos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 dark:bg-slate-950 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">
                Impacto Operacional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Demora promedio total:</span>
                <span className="text-slate-200 font-medium">
                  {demoraPromedio} días
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Costo total almacenaje:</span>
                <span className="text-slate-200 font-medium">
                  ${costoTotalAlmacenaje.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cargas &gt;30 días:</span>
                <span className="text-red-400 font-medium">
                  {cargasData.filter((c) => c.antiguedad === ">30 días").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">
                  Productos perecederos afectados:
                </span>
                <span className="text-yellow-400 font-medium">
                  {
                    cargasData.filter(
                      (c) =>
                        c.descripcion.includes("Perecederos") ||
                        c.descripcion.includes("alimenticios")
                    ).length
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 dark:bg-slate-950 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">
                Recomendaciones Prioritarias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-200 rounded-lg">
                <p className="text-red-300 text-sm">
                  • Priorizar cargas perecederos con antigüedad &gt;7 días
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-200 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  • Revisar documentación sanitaria pendiente
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-200 rounded-lg">
                <p className="text-blue-300 text-sm">
                  • Contactar autoridades para retenciones judiciales
                </p>
              </div>
              <div className="p-3 bg-green-500/10 border border-green-200 rounded-lg">
                <p className="text-green-300 text-sm">
                  • Implementar sistema de alertas automáticas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <PDFPreview
        isOpen={showPDF}
        onClose={() => setShowPDF(false)}
        title="Situación Legal de Cargas"
        columns={pdfColumns}
        data={cargasData}
        summarySection={summarySection}
        analysisSection={analysisSection}
        footerNote="Reporte generado automáticamente por el sistema SAN-EHISA"
        onExport={() =>
          generatePDF(
            "Situación Legal de Cargas",
            pdfColumns,
            cargasData,
            `Total cargas: ${totalCargas}\nPendientes: ${cargasPendientes}\n% Pendiente: ${porcentajePendientes}%\nDemora promedio: ${demoraPromedio} días`,
            `• Priorizar cargas perecederas\n• Revisar documentación sanitaria\n• Gestionar retenciones judiciales\n• Implementar alertas automáticas`
          )
        }
      />
    </div>
  );
};
