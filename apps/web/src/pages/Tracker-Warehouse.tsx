import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Building2,
  ArrowLeft,
  Search,
  Layers,
  MapPin,
  ChevronRight,
  Grid as GridIcon,
} from "lucide-react";
import {
  LocationDetailsModal,
  RackLocationsModal,
  LocationsTable,
} from "@/components/warehouse";
import { buildWarehouseTree } from "@/utils/warehouse";
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
} from "@/components/ui";

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
    racksCount?: string;
    levelsCount?: string;
    columnsCount?: string;
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

        {/* mini KPIs decorativos (placeholder sin llamadas extra) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-lg border p-2">
            <div className="text-[10px] text-muted-foreground">Racks</div>
            <div className="font-semibold">{wh.racksCount}</div>
          </div>
          <div className="rounded-lg border p-2">
            <div className="text-[10px] text-muted-foreground">Niveles</div>
            <div className="font-semibold">{wh.levelsCount}</div>
          </div>
          <div className="rounded-lg border p-2">
            <div className="text-[10px] text-muted-foreground">Columnas</div>
            <div className="font-semibold">{wh.columnsCount}</div>
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

  // --- Datos: Ubicaciones por almacén (client paging) ---
  const {
    data: warehouseData,
    isLoading: isLocLoading,
    error: locError,
  } = useLocationsByWarehouse(selectedWarehouse);

  // --- Normalizar para tabla/árbol ---
  const enrichedLocations = useMemo(() => {
    const raw = warehouseData || [];
    return raw.map((loc: any, idx: number) => ({
      ...loc,
      warehouseId: loc.warehouseId ?? loc.warehouse,
      warehouseName: loc.warehouse,
      rackId: loc.rackId ?? loc.rackCode ?? `rack-${idx}`,
      rackName: loc.rackName ?? loc.rack ?? "Rack Desconocido",
    }));
  }, [warehouseData]);

  const rowsForTree = useMemo(() => {
    return enrichedLocations.map((loc: any) => ({
      warehouse: loc.warehouseId,
      warehouseName: loc.warehouseName,
      rackCode: loc.rackId,
      rack: loc.rackName,
      level: loc.level,
      column: loc.column,
      status: loc.status,
      trackingCode: loc.trackingCode,
      description: loc.description,
      isOccupied: loc.status === "almacenado" || loc.status === "reservado",
      airWaybillNumber: loc.airWaybillNumber ?? null,
      houseAirWaybillNumber: loc.houseAirWaybillNumber ?? null,
      masterAirWaybillNumber: loc.masterAirWaybillNumber ?? null,
      manifestNumber: loc.manifestNumber ?? null,
      weightKg: loc.weightKg ?? null,
      dimensionsCm: loc.dimensionsCm ?? null,
    }));
  }, [enrichedLocations]);

  const warehouseLocations = useMemo(
    () => buildWarehouseTree(rowsForTree),
    [rowsForTree]
  );

  const totalCount = warehouseData?.length || 0;

  // --- Navegación entre modos ---
  const handleSelectWarehouse = (id: string) => {
    setSelectedWarehouse(id);
    setMode("locations");
    // reset UI de la vista de ubicaciones
    setPage(1);
    setFilterStatus("all");
    setCargoQuery("");
  };

  const handleBackToOverview = () => {
    setMode("overview");
    setSelectedWarehouse("");
    setCargoQuery("");
  };

  // --- Reset de página al cambiar filtros/búsqueda ---
  useEffect(() => {
    if (mode === "locations") {
      setPage(1);
    }
  }, [filterStatus, cargoQuery, mode]);

  // --- Fuente plana (para los modales, merge extras) ---
  const flatLocations = (warehouseData as any[]) || [];

  const handleLocationClick = (
    location: Location,
    rack: Rack,
    warehouse: Warehouse
  ) => {
    const original = (flatLocations as any[]).find(
      (fl) =>
        (fl.warehouseId ?? fl.warehouse) === (location as any).warehouseId &&
        (fl.rackId ?? fl.rackCode) === (location as any).rackId &&
        fl.level === (location as any).level &&
        fl.column === (location as any).column
    );
    setSelectedLocation({
      ...(location as any),
      rack,
      warehouse,
      ...(original ?? {}),
    });
    setIsDetailOpen(true);
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Todos los Almacenes
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
        {/* --- MODO OVERVIEW: grid de almacenes con búsqueda --- */}
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

        {/* --- MODO LOCATIONS: tabla del almacén seleccionado --- */}
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

            {isLocLoading && (
              <div className="p-6 text-sm">
                Cargando ubicaciones del almacén…
              </div>
            )}
            {locError && (
              <div className="p-6 text-sm text-red-600">
                Error al cargar ubicaciones. Intenta de nuevo.
              </div>
            )}

            {!isLocLoading && !locError && (
              <LocationsTable
                warehouseLocations={warehouseLocations}
                allWarehouses={allWarehouses || []}
                page={page}
                limit={limit}
                totalCount={totalCount}
                onPageChange={setPage}
                // Forzamos client paging pasando un almacén específico
                selectedWarehouse={selectedWarehouse}
                setSelectedWarehouse={(id) => {
                  handleSelectWarehouse(id);
                }}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                viewMode="all"
                onLocationClick={handleLocationClick}
                // Búsqueda (tracking / AWB / HAWB) en cliente
                searchTerm={cargoQuery}
                onSearchChange={setCargoQuery}
              />
            )}
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
        onLocationClick={handleLocationClick}
      />
    </div>
  );
};
