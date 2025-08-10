import { useState, useMemo, useEffect } from "react";
import {
  LocationDetailsModal,
  RackLocationsModal,
  LocationsTable,
} from "@/components/warehouse";
import { buildWarehouseTree } from "@/utils/warehouse";
import type { Location, Rack, Warehouse } from "@/lib/types";
import { useLocations, useLocationsByWarehouse } from "@/lib/locations";
import { useWarehouses } from "@/lib/warehouse";
import { LocationStatus } from "@/components/common/locations";

export const WarehouseLocationTracker = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [cargoQuery, setCargoQuery] = useState<string>(""); // 🔎 búsqueda global/cliente

  // Extras que vienen del backend:
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
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  type SelectedRack = Rack & { warehouse: Warehouse };
  const [selectedRack] = useState<SelectedRack | null>(null);
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);

  // 🔁 Global (server paging): el backend soporta status + q
  const {
    data: pagedData,
    isLoading: isPagedLoading,
    error: pagedError,
  } = useLocations(
    page,
    limit,
    filterStatus as "all" | LocationStatus | undefined,
    cargoQuery // 👈 se envía como ?q= al backend
  );

  // 📦 Por almacén (client paging)
  const {
    data: warehouseData,
    isLoading: isWarehouseLoading,
    error: warehouseError,
  } = useLocationsByWarehouse(selectedWarehouse);

  const { data: allWarehouses } = useWarehouses();

  const isFilteringByWarehouse = selectedWarehouse !== "all";

  // Normaliza para la tabla (nombres de almacén/rack e IDs)
  const enrichedLocations = useMemo(() => {
    const raw =
      isFilteringByWarehouse && warehouseData
        ? warehouseData
        : pagedData?.data || [];

    return raw.map((loc: any, idx: number) => ({
      ...loc,
      warehouseId: loc.warehouseId ?? loc.warehouse,
      warehouseName: loc.warehouse,
      rackId: loc.rackId ?? loc.rackCode ?? `rack-${idx}`,
      rackName: loc.rackName ?? loc.rack ?? "Rack Desconocido",
    }));
  }, [isFilteringByWarehouse, warehouseData, pagedData]);

  // Para el árbol de racks/ubicaciones
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

      // AÑADIDOS (vienen del backend)
      airWaybillNumber: loc.airWaybillNumber ?? null,
      houseAirWaybillNumber: loc.houseAirWaybillNumber ?? null,
      masterAirWaybillNumber: loc.masterAirWaybillNumber ?? null,
      manifestNumber: loc.manifestNumber ?? null,
      weightKg: loc.weightKg ?? null,
      dimensionsCm: loc.dimensionsCm ?? null,
    }));
  }, [enrichedLocations]);

  const warehouseLocations = useMemo(() => {
    return buildWarehouseTree(rowsForTree);
  }, [rowsForTree]);

  const totalCount = isFilteringByWarehouse
    ? warehouseData?.length || 0
    : pagedData?.total || 0;

  const isLoading = isFilteringByWarehouse
    ? isWarehouseLoading
    : isPagedLoading;

  const error = isFilteringByWarehouse ? warehouseError : pagedError;

  // Resetear a página 1 si cambian filtros o la búsqueda
  useEffect(() => {
    setPage(1);
  }, [selectedWarehouse, filterStatus, cargoQuery]);

  // Fuente plana de datos originales del backend (para extra fields)
  const flatLocations = isFilteringByWarehouse
    ? (warehouseData as any[]) || []
    : (pagedData?.data as any[]) || [];

  const handleLocationClick = (
    location: Location,
    rack: Rack,
    warehouse: Warehouse
  ) => {
    // Buscar el registro original del backend que coincide con la celda clickeada
    const original = (flatLocations as any[]).find(
      (fl) =>
        (fl.warehouseId ?? fl.warehouse) === (location as any).warehouseId &&
        (fl.rackId ?? fl.rackCode) === (location as any).rackId &&
        fl.level === (location as any).level &&
        fl.column === (location as any).column
    );

    // Mezcla: lo de la tabla + rack/warehouse + extras del backend
    setSelectedLocation({
      ...(location as any),
      rack,
      warehouse,
      ...(original ?? {}),
    });
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pl-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Tracker de Ubicaciones</h1>
        <p className="text-slate-400 mt-1 sm:mt-2">
          Lista completa de todas las ubicaciones
        </p>
      </div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Body */}
        {isLoading && <div className="p-6 text-sm">Cargando ubicaciones…</div>}
        {error && <div className="p-6 text-red-600">Error al cargar datos</div>}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          <LocationsTable
            warehouseLocations={warehouseLocations}
            allWarehouses={allWarehouses || []}
            page={page}
            limit={limit}
            totalCount={totalCount}
            onPageChange={setPage}
            selectedWarehouse={selectedWarehouse}
            setSelectedWarehouse={setSelectedWarehouse}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            viewMode="all"
            onLocationClick={handleLocationClick}
            searchTerm={cargoQuery} // 🔎 pasa query a la tabla
            onSearchChange={setCargoQuery} // 🔁 actualiza query (backend/cliente)
          />
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
    </div>
  );
};
