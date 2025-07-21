import { useState } from "react";
import {
  Filter,
  Download,
  Calendar,
  Search,
  Shield,
  AlertTriangle,
  DollarSign,
  Scale,
  Truck,
  MapPin,
  Clock,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

interface CargaIlegal {
  codigo: string;
  descripcion: string;
  categoria: string;
  peso: number;
  cantidad: number;
  fechaDeteccion: string;
  fechaIngreso: string;
  origen: string;
  destino: string;
  transportista: string;
  numeroManifiesto: string;
  tipoInfraccion: string;
  nivelRiesgo: "Bajo" | "Medio" | "Alto" | "Crítico";
  valorEstimado: number;
  agenciaDetectora: string;
  responsableDeteccion: string;
  estadoInvestigacion: "Iniciada" | "En Proceso" | "Suspendida" | "Cerrada";
  estadoLegal: "Pendiente" | "En Proceso Legal" | "Sancionado" | "Absuelto";
  multa: number;
  ubicacionRetencion: string;
  documentosIncautados: string[];
  autorizacionRequerida: string;
  accionesTomadas: string[];
  numeroCaso: string;
  observaciones: string;
  creadoPor: string;
}

const cargasIlegales: CargaIlegal[] = [
  {
    codigo: "ILL-2024-001",
    descripcion:
      "Medicamentos controlados sin licencia - Antibióticos x500 cajas",
    categoria: "Farmacéuticos Controlados",
    peso: 75.3,
    cantidad: 500,
    fechaDeteccion: "15/1/2024",
    fechaIngreso: "14/1/2024",
    origen: "Mumbai, India",
    destino: "Lima, Perú",
    transportista: "Global Freight Lines SAC",
    numeroManifiesto: "MF-2024-0785",
    tipoInfraccion: "Importación sin autorización DIGEMID",
    nivelRiesgo: "Alto",
    valorEstimado: 125000,
    agenciaDetectora: "SUNAT - Control Aduanero",
    responsableDeteccion: "Inspector Carlos Mendoza",
    estadoInvestigacion: "En Proceso",
    estadoLegal: "En Proceso Legal",
    multa: 75000,
    ubicacionRetencion: "Almacén SUNAT - Callao Sector 7",
    documentosIncautados: [
      "factura_comercial.pdf",
      "packing_list.pdf",
      "certificado_falso.pdf",
    ],
    autorizacionRequerida: "Registro Sanitario DIGEMID",
    accionesTomadas: [
      "Retención de mercancía",
      "Apertura de proceso sancionador",
      "Notificación a DIGEMID",
    ],
    numeroCaso: "SUNAT-2024-ILL-001",
    observaciones: "Documentación falsificada detectada en revisión física",
    creadoPor: "Carlos Mendoza",
  },
  {
    codigo: "ILL-2024-002",
    descripcion:
      "Equipos electrónicos - Celulares sin homologación MTC x200 unidades",
    categoria: "Electrónicos No Homologados",
    peso: 45.8,
    cantidad: 200,
    fechaDeteccion: "16/1/2024",
    fechaIngreso: "15/1/2024",
    origen: "Shenzhen, China",
    destino: "Arequipa, Perú",
    transportista: "Asia Pacific Cargo SA",
    numeroManifiesto: "MF-2024-0798",
    tipoInfraccion: "Importación sin homologación MTC",
    nivelRiesgo: "Medio",
    valorEstimado: 85000,
    agenciaDetectora: "MTC - Dirección de Fiscalización",
    responsableDeteccion: "Técnico María Gonzales",
    estadoInvestigacion: "Iniciada",
    estadoLegal: "Pendiente",
    multa: 45000,
    ubicacionRetencion: "Depósito Temporal Arequipa - Zona B3",
    documentosIncautados: [
      "especificaciones_tecnicas.pdf",
      "lista_modelos.pdf",
    ],
    autorizacionRequerida: "Certificado de Homologación MTC",
    accionesTomadas: [
      "Retención preventiva",
      "Solicitud de documentación",
      "Coordinación con MTC",
    ],
    numeroCaso: "MTC-2024-FIS-012",
    observaciones: "Modelos no registrados en base de datos MTC",
    creadoPor: "María Gonzales",
  },
  {
    codigo: "ILL-2024-003",
    descripcion:
      "Productos químicos industriales - Precursores químicos x50 tambores",
    categoria: "Químicos Controlados",
    peso: 2500.0,
    cantidad: 50,
    fechaDeteccion: "18/1/2024",
    fechaIngreso: "17/1/2024",
    origen: "Rotterdam, Países Bajos",
    destino: "Iquitos, Perú",
    transportista: "European Chemical Transport BV",
    numeroManifiesto: "MF-2024-0812",
    tipoInfraccion: "Importación de precursores sin autorización",
    nivelRiesgo: "Crítico",
    valorEstimado: 350000,
    agenciaDetectora: "DEVIDA - Control de Precursores",
    responsableDeteccion: "Agente Luis Fernández",
    estadoInvestigacion: "En Proceso",
    estadoLegal: "En Proceso Legal",
    multa: 200000,
    ubicacionRetencion: "Almacén Especializado DEVIDA - Lima",
    documentosIncautados: [
      "msds_productos.pdf",
      "certificados_origen.pdf",
      "autorizacion_fabricante.pdf",
      "declaracion_uso.pdf",
    ],
    autorizacionRequerida: "Licencia DEVIDA para precursores químicos",
    accionesTomadas: [
      "Incautación inmediata",
      "Análisis químico",
      "Investigación penal",
      "Coordinación PNP",
    ],
    numeroCaso: "DEVIDA-2024-PREC-005",
    observaciones: "Sustancias compatibles con elaboración de drogas ilícitas",
    creadoPor: "Luis Fernández",
  },
  {
    codigo: "ILL-2024-004",
    descripcion:
      "Textiles infantiles - Ropa con químicos tóxicos x1000 prendas",
    categoria: "Textiles No Conformes",
    peso: 125.7,
    cantidad: 1000,
    fechaDeteccion: "19/1/2024",
    fechaIngreso: "18/1/2024",
    origen: "Dhaka, Bangladesh",
    destino: "Trujillo, Perú",
    transportista: "Textile Express Logistics SAC",
    numeroManifiesto: "MF-2024-0825",
    tipoInfraccion: "Productos con sustancias tóxicas prohibidas",
    nivelRiesgo: "Alto",
    valorEstimado: 25000,
    agenciaDetectora: "SENASA - Control de Productos",
    responsableDeteccion: "Inspector Ana Martínez",
    estadoInvestigacion: "Cerrada",
    estadoLegal: "Sancionado",
    multa: 35000,
    ubicacionRetencion: "Almacén SENASA - Trujillo Sector 2",
    documentosIncautados: [
      "analisis_laboratorio.pdf",
      "certificados_calidad.pdf",
    ],
    autorizacionRequerida: "Certificado de Conformidad Técnica",
    accionesTomadas: [
      "Destrucción de mercancía",
      "Multa aplicada",
      "Notificación a importador",
    ],
    numeroCaso: "SENASA-2024-TOX-008",
    observaciones: "Niveles de formaldehído 10 veces superior al permitido",
    creadoPor: "Ana Martínez",
  },
  {
    codigo: "ILL-2024-005",
    descripcion:
      "Alimentos procesados - Conservas vencidas relabeteadas x300 latas",
    categoria: "Alimentos No Aptos",
    peso: 95.4,
    cantidad: 300,
    fechaDeteccion: "20/1/2024",
    fechaIngreso: "19/1/2024",
    origen: "Valparaíso, Chile",
    destino: "Cusco, Perú",
    transportista: "Andean Food Transport EIRL",
    numeroManifiesto: "MF-2024-0834",
    tipoInfraccion: "Manipulación fraudulenta de fechas de vencimiento",
    nivelRiesgo: "Alto",
    valorEstimado: 8500,
    agenciaDetectora: "DIGESA - Control Sanitario",
    responsableDeteccion: "Inspector Roberto Silva",
    estadoInvestigacion: "En Proceso",
    estadoLegal: "En Proceso Legal",
    multa: 25000,
    ubicacionRetencion: "Frigorífico DIGESA - Cusco",
    documentosIncautados: [
      "etiquetas_originales.pdf",
      "registro_fotografico.pdf",
      "acta_inspeccion.pdf",
    ],
    autorizacionRequerida: "Registro Sanitario de Alimentos",
    accionesTomadas: [
      "Decomiso inmediato",
      "Análisis microbiológico",
      "Denuncia penal",
    ],
    numeroCaso: "DIGESA-2024-ALI-015",
    observaciones: "Evidencia de alteración de etiquetas con fechas falsas",
    creadoPor: "Roberto Silva",
  },
  {
    codigo: "ILL-2024-006",
    descripcion:
      "Autopartes automotrices - Frenos falsificados marca Toyota x150 juegos",
    categoria: "Autopartes Falsificadas",
    peso: 680.2,
    cantidad: 150,
    fechaDeteccion: "21/1/2024",
    fechaIngreso: "20/1/2024",
    origen: "Guangzhou, China",
    destino: "Lima, Perú",
    transportista: "Auto Parts Logistics Peru SAC",
    numeroManifiesto: "MF-2024-0847",
    tipoInfraccion: "Falsificación de marca registrada",
    nivelRiesgo: "Crítico",
    valorEstimado: 95000,
    agenciaDetectora: "INDECOPI - Propiedad Intelectual",
    responsableDeteccion: "Especialista Patricia Ramos",
    estadoInvestigacion: "En Proceso",
    estadoLegal: "En Proceso Legal",
    multa: 180000,
    ubicacionRetencion: "Depósito INDECOPI - Lima Norte",
    documentosIncautados: [
      "muestras_productos.pdf",
      "analisis_comparativo.pdf",
      "reporte_toyota.pdf",
    ],
    autorizacionRequerida: "Licencia de uso de marca Toyota",
    accionesTomadas: [
      "Incautación",
      "Peritaje técnico",
      "Notificación a Toyota",
      "Proceso por delito",
    ],
    numeroCaso: "INDECOPI-2024-PI-023",
    observaciones:
      "Productos de calidad inferior que comprometen seguridad vial",
    creadoPor: "Patricia Ramos",
  },
  {
    codigo: "ILL-2024-007",
    descripcion: "Cosméticos - Cremas blanqueadoras con mercurio x80 frascos",
    categoria: "Cosméticos Prohibidos",
    peso: 15.6,
    cantidad: 80,
    fechaDeteccion: "22/1/2024",
    fechaIngreso: "21/1/2024",
    origen: "Lagos, Nigeria",
    destino: "Piura, Perú",
    transportista: "African Beauty Imports SAC",
    numeroManifiesto: "MF-2024-0856",
    tipoInfraccion: "Productos cosméticos con sustancias prohibidas",
    nivelRiesgo: "Crítico",
    valorEstimado: 12000,
    agenciaDetectora: "DIGEMID - Control de Cosméticos",
    responsableDeteccion: "Químico Farmacéutico José Torres",
    estadoInvestigacion: "Cerrada",
    estadoLegal: "Sancionado",
    multa: 50000,
    ubicacionRetencion: "Laboratorio DIGEMID - Destrucción",
    documentosIncautados: [
      "analisis_mercurio.pdf",
      "fotos_productos.pdf",
      "acta_destruccion.pdf",
    ],
    autorizacionRequerida: "Notificación Sanitaria Obligatoria (NSO)",
    accionesTomadas: [
      "Destrucción total",
      "Multa máxima",
      "Alerta sanitaria",
      "Prohibición importador",
    ],
    numeroCaso: "DIGEMID-2024-COS-011",
    observaciones:
      "Niveles de mercurio 500% superior al límite. Riesgo neurológico grave",
    creadoPor: "José Torres",
  },
];

export const IlegalCargo = () => {
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("01/15/2024");
  const [filtroFechaFin, setFiltroFechaFin] = useState("01/25/2024");
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroNivelRiesgo, setFiltroNivelRiesgo] = useState("todos");
  const [filtroEstadoLegal, setFiltroEstadoLegal] = useState("todos");
  const [] = useState("todos");

  const cargasFiltradas = cargasIlegales.filter((carga) => {
    return (
      filtroCodigo === "" ||
      carga.codigo.toLowerCase().includes(filtroCodigo.toLowerCase())
    );
  });

  const totalCargas = cargasFiltradas.length;
  const valorTotalIncautado = cargasFiltradas.reduce(
    (sum, carga) => sum + carga.valorEstimado,
    0
  );
  const multasTotales = cargasFiltradas.reduce(
    (sum, carga) => sum + carga.multa,
    0
  );
  const casosEnProceso = cargasFiltradas.filter(
    (carga) => carga.estadoInvestigacion === "En Proceso"
  ).length;

  // Datos para gráficos
  const datosPorCategoria = cargasFiltradas.reduce((acc, carga) => {
    acc[carga.categoria] = (acc[carga.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataCategoria = Object.entries(datosPorCategoria).map(
    ([categoria, cantidad]) => ({
      categoria:
        categoria.length > 20 ? categoria.substring(0, 20) + "..." : categoria,
      casos: cantidad,
      valor: cargasFiltradas
        .filter((c) => c.categoria === categoria)
        .reduce((sum, c) => sum + c.valorEstimado, 0),
    })
  );

  const datosNivelRiesgo = cargasFiltradas.reduce((acc, carga) => {
    acc[carga.nivelRiesgo] = (acc[carga.nivelRiesgo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataRiesgo = Object.entries(datosNivelRiesgo).map(
    ([nivel, cantidad]) => ({
      name: nivel,
      value: cantidad,
      porcentaje: ((cantidad / totalCargas) * 100).toFixed(1),
    })
  );

  const datosAgencias = cargasFiltradas.reduce((acc, carga) => {
    const agencia = carga.agenciaDetectora.split(" - ")[0];
    acc[agencia] = (acc[agencia] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataAgencias = Object.entries(datosAgencias).map(
    ([agencia, casos]) => ({
      agencia: agencia,
      casos: casos,
      eficiencia: Math.floor(Math.random() * 40) + 60, // Simulado
    })
  );

  const datosTemporales = cargasFiltradas
    .map((carga) => {
      const fecha = carga.fechaDeteccion;
      return {
        fecha: fecha,
        dia: fecha.split("/")[0],
        valor: carga.valorEstimado,
        multa: carga.multa,
      };
    })
    .sort((a, b) => parseInt(a.dia) - parseInt(b.dia));

  const chartDataTemporal = datosTemporales.reduce((acc, item) => {
    const existe = acc.find((d) => d.dia === item.dia);
    if (existe) {
      existe.casos += 1;
      existe.valor += item.valor;
      existe.multas += item.multa;
    } else {
      acc.push({
        dia: `${item.dia}/1`,
        casos: 1,
        valor: item.valor,
        multas: item.multa,
      });
    }
    return acc;
  }, [] as any[]);

  const datosEstadosLegales = cargasFiltradas.reduce((acc, carga) => {
    const key = `${carga.estadoLegal}-${carga.estadoInvestigacion}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataEstados = Object.entries(datosEstadosLegales).map(
    ([estado, cantidad]) => {
      const [estadoLegal, estadoInv] = estado.split("-");
      return {
        estado: estadoLegal,
        investigacion: estadoInv,
        cantidad: cantidad,
      };
    }
  );

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  const getBadgeVariant = (nivel: string) => {
    switch (nivel) {
      case "Bajo":
        return "secondary";
      case "Medio":
        return "default";
      case "Alto":
        return "destructive";
      case "Crítico":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "secondary";
      case "En Proceso Legal":
        return "default";
      case "Sancionado":
        return "destructive";
      case "Absuelto":
        return "secondary";
      default:
        return "default";
    }
  };

  const getInvestigacionBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Iniciada":
        return "secondary";
      case "En Proceso":
        return "default";
      case "Suspendida":
        return "destructive";
      case "Cerrada":
        return "secondary";
      default:
        return "default";
    }
  };
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="bg-gradient-to-r rounded-lg p-6 mb-6 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="h-8 w-8 text-red-500 dark:text-red-400" />
        <h1 className="text-3xl text-gray-900 dark:text-gray-100">Reporte de Cargas Ilegales</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-300">
        Análisis completo de cargas ilegales o no autorizadas detectadas en el sistema
      </p>
      </div>
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
        <div>
          <h3 className="text-gray-900 dark:text-gray-100">Reporte de Cargas Ilegales</h3>
          <p className="text-sm text-gray-400 dark:text-gray-400">
          {totalCargas} casos detectados • {filtroFechaInicio} - {filtroFechaFin}
          </p>
        </div>
        </div>
        <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
        >
          <Eye className="h-4 w-4 mr-2" />
          Vista previa
        </Button>
        <Button variant="destructive" size="sm">
          Generar reporte
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar Excel
        </Button>
        </div>
      </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        <h3 className="text-gray-900 dark:text-gray-100">Filtros de Cargas Ilegales</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
        <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Fecha Inicio</label>
        <div className="relative">
          <Input
          type="text"
          value={filtroFechaInicio}
          onChange={(e) => setFiltroFechaInicio(e.target.value)}
          className="bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pl-8"
          />
          <Calendar className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
        </div>
        </div>

        <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Fecha Fin</label>
        <div className="relative">
          <Input
          type="text"
          value={filtroFechaFin}
          onChange={(e) => setFiltroFechaFin(e.target.value)}
          className="bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pl-8"
          />
          <Calendar className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
        </div>
        </div>

        <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Código de Caso</label>
        <div className="relative">
          <Input
          type="text"
          placeholder="Buscar por código..."
          value={filtroCodigo}
          onChange={(e) => setFiltroCodigo(e.target.value)}
          className="bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white pl-8"
          />
          <Search className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
        </div>
        </div>

        <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Categoría</label>
        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}></Select>
            <label className="block text-sm mb-1">Categoría</label>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="dark:bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-700 border-slate-600">
                <SelectItem value="todos">Todas las categorías</SelectItem>
                <SelectItem value="farmaceuticos">
                  Farmacéuticos Controlados
                </SelectItem>
                <SelectItem value="electronicos">
                  Electrónicos No Homologados
                </SelectItem>
                <SelectItem value="quimicos">Químicos Controlados</SelectItem>
                <SelectItem value="textiles">Textiles No Conformes</SelectItem>
                <SelectItem value="alimentos">Alimentos No Aptos</SelectItem>
                <SelectItem value="autopartes">
                  Autopartes Falsificadas
                </SelectItem>
                <SelectItem value="cosmeticos">
                  Cosméticos Prohibidos
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Nivel de Riesgo</label>
            <Select
              value={filtroNivelRiesgo}
              onValueChange={setFiltroNivelRiesgo}
            >
              <SelectTrigger className="dark:bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Todos los niveles" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-700 border-slate-600">
                <SelectItem value="todos">Todos los niveles</SelectItem>
                <SelectItem value="bajo">Bajo</SelectItem>
                <SelectItem value="medio">Medio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
                <SelectItem value="critico">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Estado Legal</label>
            <Select
              value={filtroEstadoLegal}
              onValueChange={setFiltroEstadoLegal}
            >
              <SelectTrigger className="dark:bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-700 border-slate-600">
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="proceso">En Proceso Legal</SelectItem>
                <SelectItem value="sancionado">Sancionado</SelectItem>
                <SelectItem value="absuelto">Absuelto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" className="text-gray-300 border-gray-600">
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="dark:bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 dark:bg-red-900/30 rounded-lg">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Casos Detectados</p>
                <p className="text-2xl">{totalCargas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Valor Total Incautado</p>
                <p className="text-2xl">
                  S/ {valorTotalIncautado.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 dark:bg-orange-900/30 rounded-lg">
                <Scale className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Multas Aplicadas</p>
                <p className="text-2xl">S/ {multasTotales.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 dark:bg-blue-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Casos En Proceso</p>
                <p className="text-2xl">{casosEnProceso}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="dark:bg-slate-800 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-5 w-5 text-purple-400" />
          <h3>Análisis Gráfico de Cargas Ilegales</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de Casos por Categoría */}
          <Card className="dark:dark:bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Casos por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartDataCategoria}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="categoria"
                    stroke="#9ca3af"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                  <Bar dataKey="casos" fill="#ef4444" name="Casos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pie - Niveles de Riesgo */}
          <Card className="dark:bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-400" />
                Distribución por Nivel de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={chartDataRiesgo}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, porcentaje }) => `${name}: ${porcentaje}%`}
                  >
                    {chartDataRiesgo.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de Línea Temporal */}
          <Card className="dark:bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                Detecciones por Día
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartDataTemporal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="dia" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="casos"
                    stroke="#eab308"
                    strokeWidth={3}
                    dot={{ fill: "#eab308", r: 4 }}
                    name="Casos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Agencias Detectoras */}
          <Card className="dark:bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Casos por Agencia Detectora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartDataAgencias} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="agencia"
                    stroke="#9ca3af"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="casos" fill="#8b5cf6" name="Casos Detectados" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Área - Valores Incautados */}
          <Card className="dark:bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Valores y Multas por Día
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartDataTemporal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="dia" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => [
                      `S/ ${parseInt(value).toLocaleString()}`,
                      "",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stackId="1"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.6}
                    name="Valor Incautado"
                  />
                  <Area
                    type="monotone"
                    dataKey="multas"
                    stackId="2"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.6}
                    name="Multas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Barras Apiladas - Estados */}
          <Card className="dark:bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-400" />
                Estados Legal vs Investigación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartDataEstados}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="estado"
                    stroke="#9ca3af"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="cantidad"
                    fill="#ec4899"
                    name="Casos"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Details Table */}
      <div className="dark:bg-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3>Detalle de Cargas Ilegales Detectadas</h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-gray-300 min-w-32">
                  Código Caso
                </TableHead>
                <TableHead className="text-gray-300 min-w-64">
                  Descripción
                </TableHead>
                <TableHead className="text-gray-300">Categoría</TableHead>
                <TableHead className="text-gray-300">Peso (kg)</TableHead>
                <TableHead className="text-gray-300">Cantidad</TableHead>
                <TableHead className="text-gray-300">Origen</TableHead>
                <TableHead className="text-gray-300">Destino</TableHead>
                <TableHead className="text-gray-300">Transportista</TableHead>
                <TableHead className="text-gray-300">Nº Manifiesto</TableHead>
                <TableHead className="text-gray-300">Tipo Infracción</TableHead>
                <TableHead className="text-gray-300">Nivel Riesgo</TableHead>
                <TableHead className="text-gray-300">Valor Estimado</TableHead>
                <TableHead className="text-gray-300">
                  Agencia Detectora
                </TableHead>
                <TableHead className="text-gray-300">Responsable</TableHead>
                <TableHead className="text-gray-300">
                  Estado Investigación
                </TableHead>
                <TableHead className="text-gray-300">Estado Legal</TableHead>
                <TableHead className="text-gray-300">Multa</TableHead>
                <TableHead className="text-gray-300">
                  Ubicación Retención
                </TableHead>
                <TableHead className="text-gray-300">Fecha Detección</TableHead>
                <TableHead className="text-gray-300">
                  Autorización Requerida
                </TableHead>
                <TableHead className="text-gray-300">
                  Acciones Tomadas
                </TableHead>
                <TableHead className="text-gray-300">Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargasFiltradas.map((carga) => (
                <TableRow key={carga.codigo} className="border-slate-700">
                  <TableCell className="text-red-400">{carga.codigo}</TableCell>
                  <TableCell className="max-w-64">
                    {carga.descripcion}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-gray-300 border-gray-600"
                    >
                      {carga.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>{carga.peso}</TableCell>
                  <TableCell>{carga.cantidad}</TableCell>
                  <TableCell className="min-w-32">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs">{carga.origen}</span>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-32">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs">{carga.destino}</span>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-48">
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3 text-gray-400" />
                      <span className="text-xs">{carga.transportista}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-400 text-xs">
                    {carga.numeroManifiesto}
                  </TableCell>
                  <TableCell className="max-w-48 text-xs">
                    {carga.tipoInfraccion}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(carga.nivelRiesgo)}>
                      {carga.nivelRiesgo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-green-400">
                    S/ {carga.valorEstimado.toLocaleString()}
                  </TableCell>
                  <TableCell className="min-w-48 text-xs">
                    {carga.agenciaDetectora}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-6 h-6 dark:bg-blue-600 rounded-full flex items-center justify-center text-xs">
                      {carga.responsableDeteccion
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-xs">
                      {carga.responsableDeteccion}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getInvestigacionBadgeVariant(
                        carga.estadoInvestigacion
                      )}
                    >
                      {carga.estadoInvestigacion}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(carga.estadoLegal)}>
                      {carga.estadoLegal}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-orange-400">
                    S/ {carga.multa.toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-48 text-xs">
                    {carga.ubicacionRetencion}
                  </TableCell>
                  <TableCell className="text-xs">
                    {carga.fechaDeteccion}
                  </TableCell>
                  <TableCell className="max-w-48 text-xs">
                    {carga.autorizacionRequerida}
                  </TableCell>
                  <TableCell className="min-w-48">
                    <div className="flex flex-col gap-1">
                      {carga.accionesTomadas
                        .slice(0, 2)
                        .map((accion, index) => (
                          <span
                            key={index}
                            className="text-xs dark:bg-slate-700 px-2 py-1 rounded"
                          >
                            {accion}
                          </span>
                        ))}
                      {carga.accionesTomadas.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{carga.accionesTomadas.length - 2} más
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-64 text-xs"
                    title={carga.observaciones}
                  >
                    {carga.observaciones.length > 100
                      ? `${carga.observaciones.substring(0, 100)}...`
                      : carga.observaciones}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-slate-700 text-center text-sm text-gray-400">
          <p>Reporte generado el 21 de julio de 2025, 10:45</p>
          <p>
            Sistema de Control de Cargas Ilegales - {totalCargas} casos
            analizados
          </p>
          <p className="text-red-400 mt-1">
            ⚠️ Información clasificada - Solo personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
};
