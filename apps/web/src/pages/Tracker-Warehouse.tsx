import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Building2,
  ArrowLeft,
  Search,
  Layers,
  MapPin,
  Grid as GridIcon,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  LocationDetailsModal,
  RackLocationsModal,
} from "@/components/warehouse";
import type { Location, Rack, Warehouse } from "@/lib/types";
import { useLocationsByWarehouse } from "@/lib/locations";
import { useWarehouses } from "@/lib/warehouse";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { statusConfig } from "@/components/common/status-config";

type BackendExtras = {
  airWaybillNumber?: string;
  houseAirWaybillNumber?: string;
  masterAirWaybillNumber?: string;
  manifestNumber?: string;
  weightKg?: number;
  dimensionsCm?: { Width: number; Height: number; Length: number };
  rackCode?: string;
  isOccupied?: boolean;
};

type SelectedLocation = Location & {
  rack: Rack;
  warehouse: Warehouse;
} & BackendExtras;

/** 👇 Tipo enriquecido para filas de la tabla */
type EnrichedLocation = Location &
  BackendExtras & {
    warehouseId: string;
    warehouseName?: string;
    rackId: string;
    rackName?: string;
    statusNorm: string;
  };

const EmptyState = ({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center text-center p-10 border rounded-xl bg-white dark:bg-zinc-900">
    <div className="mb-3">{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
    {subtitle && (
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    )}
  </div>
);

const WarehouseCard = ({
  wh,
  onSelect,
}: {
  wh: {
    Id: string;
    Name: string;
    Code?: string;
    Address?: string;
    racksCount?: string | number;
    levelsCount?: string | number;
    columnsCount?: string | number;
  };
  onSelect: (id: string) => void;
}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-200 border-2 hover:border-blue-500/40 rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-blue-600/10 text-blue-700 dark:text-blue-300 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{wh.Name}</h3>
            <div className="text-xs text-muted-foreground truncate">
              {wh.Code || "Sin código"}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">
            {wh.Address || "Dirección no registrada"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-lg border p-2">
            <div className="text-[10px] text-muted-foreground">Racks</div>
            <div className="font-semibold">{wh.racksCount ?? "-"}</div>
          </div>
          <div className="rounded-lg border p-2">
            <div className="text-[10px] text-muted-foreground">Niveles</div>
            <div className="font-semibold">{wh.levelsCount ?? "-"}</div>
          </div>
          <div className="rounded-lg border p-2">
            <div className="text-[10px] text-muted-foreground">Columnas</div>
            <div className="font-semibold">{wh.columnsCount ?? "-"}</div>
          </div>
        </div>

        <Button
          className="w-full justify-between group/btn"
          onClick={() => onSelect(wh.Id)}
        >
          Ver ubicaciones
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </CardContent>
    </Card>
  );
};

export const WarehouseTracker = () => {
  // --- Estado UI global ---
  const [mode, setMode] = useState<"overview" | "locations">("overview");
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [cargoQuery, setCargoQuery] = useState<string>("");

  // --- Modales ---
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRack] = useState<(Rack & { warehouse: Warehouse }) | null>(
    null
  );
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);

  // --- Datos: Almacenes ---
  const { data: allWarehouses = [], isLoading: isWhLoading } = useWarehouses();

  // --- Datos: Ubicaciones por almacén ---
  const {
    data: warehouseData,
    isLoading: isLocLoading,
    error: locError,
  } = useLocationsByWarehouse(selectedWarehouse);

  // --- Normalizar / enriquecer a EnrichedLocation[] ---
  const enrichedLocations: EnrichedLocation[] = useMemo(() => {
    const raw: (Location & Partial<BackendExtras> & Record<string, any>)[] =
      (warehouseData as any[]) || [];
    return raw.map((loc, idx) => {
      const warehouseId = (loc as any).warehouseId ?? (loc as any).warehouse;
      const rackId =
        (loc as any).rackId ?? (loc as any).rackCode ?? `rack-${idx}`;
      const rackName = (loc as any).rackName ?? (loc as any).rack ?? "Rack";
      const warehouseName = (loc as any).warehouse;

      return {
        ...(loc as Location),
        airWaybillNumber: (loc as any).airWaybillNumber,
        houseAirWaybillNumber: (loc as any).houseAirWaybillNumber,
        masterAirWaybillNumber: (loc as any).masterAirWaybillNumber,
        manifestNumber: (loc as any).manifestNumber,
        weightKg: (loc as any).weightKg,
        dimensionsCm: (loc as any).dimensionsCm,
        rackCode: (loc as any).rackCode,
        isOccupied:
          (loc as any).status === "almacenado" ||
          (loc as any).status === "reservado",

        warehouseId: String(warehouseId),
        warehouseName,
        rackId: String(rackId),
        rackName,
        statusNorm: String((loc as any).status ?? "").toLowerCase(),
      };
    });
  }, [warehouseData]);

  // --- Filtro por almacén + filtros UI ---
  const filtered: EnrichedLocation[] = useMemo(() => {
    const q = cargoQuery.trim().toLowerCase();
    const st = filterStatus.toLowerCase();

    return enrichedLocations.filter((loc) => {
      const whOk = !selectedWarehouse || loc.warehouseId === selectedWarehouse;

      const statusOk =
        st === "all" ||
        loc.statusNorm === st ||
        (st === "ocupado" &&
          (loc.statusNorm === "almacenado" || loc.statusNorm === "reservado"));

      const searchOk =
        !q ||
        String((loc as any).trackingCode ?? "")
          .toLowerCase()
          .includes(q) ||
        String(loc.airWaybillNumber ?? "")
          .toLowerCase()
          .includes(q) ||
        String(loc.houseAirWaybillNumber ?? "")
          .toLowerCase()
          .includes(q) ||
        String(loc.masterAirWaybillNumber ?? "")
          .toLowerCase()
          .includes(q) ||
        String(loc.manifestNumber ?? "")
          .toLowerCase()
          .includes(q) ||
        String(loc.rackName ?? "")
          .toLowerCase()
          .includes(q) ||
        String(loc.rackId ?? "")
          .toLowerCase()
          .includes(q) ||
        String((loc as any).description ?? "")
          .toLowerCase()
          .includes(q);

      return whOk && statusOk && searchOk;
    });
  }, [enrichedLocations, cargoQuery, filterStatus, selectedWarehouse]);

  // --- Paginación en cliente ---
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const pageSafe = Math.min(page, totalPages);
  const pageSlice: EnrichedLocation[] = useMemo(() => {
    const start = (pageSafe - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, pageSafe, limit]);

  // --- Navegación entre modos ---
  const handleSelectWarehouse = (id: string) => {
    setSelectedWarehouse(id);
    setMode("locations");
    setPage(1);
    setFilterStatus("all");
    setCargoQuery("");
  };

  const handleBackToOverview = () => {
    setMode("overview");
    setSelectedWarehouse("");
    setCargoQuery("");
    setFilterStatus("all");
    setPage(1);
  };

  // --- Reset de página al cambiar filtros/búsqueda ---
  useEffect(() => {
    if (mode === "locations") {
      setPage(1);
    }
  }, [filterStatus, cargoQuery, mode]);

  // Fuente plana (para modales)
  const flatLocations = ((warehouseData as any[]) || []) as EnrichedLocation[];

  const handleRowClick = (row: EnrichedLocation) => {
    const original = (flatLocations as EnrichedLocation[]).find(
      (fl) =>
        fl.warehouseId === row.warehouseId &&
        fl.rackId === row.rackId &&
        (fl as any).level === (row as any).level &&
        (fl as any).column === (row as any).column
    );

    const sel: SelectedLocation = {
      ...(row as Location),
      rack: { Id: row.rackId, Name: row.rackName ?? "Rack" } as unknown as Rack,
      warehouse: {
        Id: row.warehouseId,
        Name:
          allWarehouses.find((w: any) => w.Id === row.warehouseId)?.Name ??
          "Almacén",
        Code:
          allWarehouses.find((w: any) => w.Id === row.warehouseId)?.Code ??
          undefined,
      } as unknown as Warehouse,
      airWaybillNumber: row.airWaybillNumber,
      houseAirWaybillNumber: row.houseAirWaybillNumber,
      masterAirWaybillNumber: row.masterAirWaybillNumber,
      manifestNumber: row.manifestNumber,
      weightKg: row.weightKg,
      dimensionsCm: row.dimensionsCm,
      rackCode: row.rackCode,
      isOccupied: row.isOccupied,
      ...(original ?? {}),
    };

    setSelectedLocation(sel);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Explorador de Almacenes
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Layers className="w-3.5 h-3.5" /> {allWarehouses.length} almacenes
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* --- OVERVIEW --- */}
        {mode === "overview" && (
          <>
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <GridIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold">Todos los almacenes</h2>
                  <p className="text-sm text-muted-foreground">
                    Elige un almacén para explorar sus ubicaciones (ocupadas o
                    disponibles).
                  </p>
                </div>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar almacén por nombre o código…"
                  value={warehouseSearch}
                  onChange={(e) => setWarehouseSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isWhLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-48 rounded-2xl border animate-pulse bg-muted/30"
                  />
                ))
              ) : allWarehouses.length === 0 ? (
                <EmptyState
                  title="Aún no hay almacenes"
                  subtitle="Crea al menos un almacén para comenzar."
                  icon={<Building2 className="w-8 h-8 text-muted-foreground" />}
                />
              ) : (
                allWarehouses
                  .filter((w: any) => {
                    const q = warehouseSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      w.Name?.toLowerCase().includes(q) ||
                      w.Code?.toLowerCase().includes(q)
                    );
                  })
                  .map((w: any) => (
                    <WarehouseCard
                      key={w.Id}
                      wh={w}
                      onSelect={handleSelectWarehouse}
                    />
                  ))
              )}
            </div>
          </>
        )}

        {/* --- LOCATIONS (tabla con colores/estilos de LocationsTable) --- */}
        {mode === "locations" && (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToOverview}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a almacenes
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {allWarehouses.find((w: any) => w.Id === selectedWarehouse)
                    ?.Name ?? "Almacén"}
                </Badge>
              </div>
            </div>

            {/* Controles con mismos componentes */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por tracking, AWB, rack, descripción…"
                  value={cargoQuery}
                  onChange={(e) => setCargoQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue placeholder="Estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${config.color}`}
                        />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="ocupado">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      Ocupado (almacenado/reservado)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabla shadcn/ui */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Rack</TableHead>
                      <TableHead>Posición</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>AWB / HAWB / MAWB</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      <TableHead>Dimensiones (cm)</TableHead>
                      <TableHead className="w-20">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLocLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Cargando ubicaciones…
                        </TableCell>
                      </TableRow>
                    ) : locError ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-red-600"
                        >
                          Error al cargar ubicaciones. Intenta de nuevo.
                        </TableCell>
                      </TableRow>
                    ) : pageSlice.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No hay ubicaciones que coincidan con los filtros.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageSlice.map((loc, i) => {
                        const dims = loc.dimensionsCm
                          ? `${loc.dimensionsCm?.Width ?? "-"}×${
                              loc.dimensionsCm?.Height ?? "-"
                            }×${loc.dimensionsCm?.Length ?? "-"}`
                          : "—";

                        const st = (loc as any)
                          .status as keyof typeof statusConfig;
                        const status = statusConfig[st] ?? {
                          label: (loc as any).status || "Desconocido",
                          bgColor: "bg-gray-100",
                          textColor: "text-gray-500",
                          borderColor: "border-gray-300",
                        };

                        return (
                          <TableRow
                            key={`${loc.warehouseId}-${loc.rackId}-${
                              (loc as any).level
                            }-${(loc as any).column}-${i}`}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm">
                                  {loc.rackName ?? loc.rackId}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {loc.rackId}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm">
                                {(loc as any).level}-{(loc as any).column}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${status.bgColor} ${status.textColor} ${status.borderColor} border text-xs`}
                              >
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {(loc as any).trackingCode ? (
                                <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                  {(loc as any).trackingCode}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  —
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs">
                              {loc.airWaybillNumber ?? "—"}
                              {loc.houseAirWaybillNumber ||
                              loc.masterAirWaybillNumber
                                ? " / "
                                : ""}
                              {loc.houseAirWaybillNumber ?? ""}
                              {loc.masterAirWaybillNumber
                                ? ` / ${loc.masterAirWaybillNumber}`
                                : ""}
                            </TableCell>
                            <TableCell className="max-w-[280px] truncate">
                              {(loc as any).description ?? "—"}
                            </TableCell>
                            <TableCell>{loc.weightKg ?? "—"}</TableCell>
                            <TableCell>{dims}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRowClick(loc)}
                                className="h-8 w-8 p-0"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación con los mismos estilos */}
              <div className="flex justify-end items-center gap-4 px-4 py-3 border-t bg-muted/30">
                <span className="text-sm text-muted-foreground">
                  Página {pageSafe} de {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pageSafe <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={pageSafe >= totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modales */}
      <LocationDetailsModal
        isOpen={isDetailOpen}
        onClose={setIsDetailOpen}
        selectedLocation={selectedLocation}
      />
      <RackLocationsModal
        isOpen={isRackModalOpen}
        onClose={setIsRackModalOpen}
        selectedRack={selectedRack}
        onLocationClick={(loc, rack, wh) => {
          // Reusa el mismo mapeo al tipo enriquecido para abrir el modal
          handleRowClick({
            ...(loc as unknown as EnrichedLocation),
            rackId: (rack as any)?.Id ?? (loc as any).rackId,
            rackName: (rack as any)?.Name ?? (loc as any).rackName,
            warehouseId: (wh as any)?.Id ?? (loc as any).warehouseId,
            warehouseName: (wh as any)?.Name ?? (loc as any).warehouseName,
            statusNorm: String((loc as any).status ?? "").toLowerCase(),
          });
        }}
      />
    </div>
  );
};
