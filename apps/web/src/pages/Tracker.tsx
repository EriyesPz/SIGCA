import { useState, useMemo, useEffect } from "react";
import { Package, Grid3X3 } from "lucide-react";
import {
  LocationDetailsModal,
  RackLocationsModal,
  LocationsTable,
} from "@/components/warehouse";
import { buildWarehouseTree } from "@/utils/warehouse";
import type { Location, Rack, Warehouse } from "@/lib/types";
import { useLocations, useLocationsByWarehouse } from "@/lib/locations";
import { useWarehouses } from "@/lib/warehouse";

export const WarehouseLocationTracker = () => {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);

  const {
    data: pagedData,
    isLoading: isPagedLoading,
    error: pagedError,
  } = useLocations(page, limit);

  const {
    data: warehouseData,
    isLoading: isWarehouseLoading,
    error: warehouseError,
  } = useLocationsByWarehouse(selectedWarehouse);

  const { data: allWarehouses } = useWarehouses();

  const isFilteringByWarehouse = selectedWarehouse !== "all";

  const enrichedLocations = useMemo(() => {
    if (isFilteringByWarehouse && warehouseData) {
      console.log("[Tracker] Datos crudos por almacén", warehouseData);

      return warehouseData.map((loc: any, idx: number) => ({
        ...loc,
        rackId: loc.rackId ?? loc.rackCode ?? `rack-${idx}`,
        rackName: loc.rackName ?? loc.rack ?? "Rack Desconocido",
      }));
    }

    /* paginación global */
    const rows = (pagedData?.data || []).map((loc: any, idx: number) => ({
      ...loc,
      warehouseId: loc.warehouseId ?? loc.warehouse,
      warehouseName: loc.warehouse,
      rackId: loc.rackId ?? loc.rackCode ?? `rack-${idx}`,
      rackName: loc.rackName ?? loc.rack ?? "Rack Desconocido",
    }));

    console.log("[Tracker] Datos crudos paginados", rows);
    return rows;
  }, [isFilteringByWarehouse, warehouseData, pagedData, selectedWarehouse]);
  
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
    }));
  }, [enrichedLocations]);

  const warehouseLocations = useMemo(() => {
    const tree = buildWarehouseTree(rowsForTree);
    console.log("[Tracker] warehouseLocations tree", tree);
    return tree;
  }, [rowsForTree]);

  const totalCount = isFilteringByWarehouse
    ? warehouseData?.length || 0
    : pagedData?.total || 0;

  const isLoading = isFilteringByWarehouse
    ? isWarehouseLoading
    : isPagedLoading;
  const error = isFilteringByWarehouse ? warehouseError : pagedError;

  useEffect(() => {
    setPage(1);
  }, [selectedWarehouse]);

  const handleLocationClick = (
    location: Location,
    rack: Rack,
    warehouse: Warehouse
  ) => {
    setSelectedLocation({ ...location, rack, warehouse });
    setIsDetailOpen(true);
  };

  const handleRackClick = (rack: Rack, warehouse: Warehouse) => {
    setSelectedRack({ ...rack, warehouse });
    setIsRackModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* ──────────────── header fijo ──────────────── */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tracker de Ubicaciones de Almacén
          </h1>
        </div>
      </header>

      {isLoading && <div className="p-6 text-sm">Cargando ubicaciones…</div>}
      {error && <div className="p-6 text-red-600">Error al cargar datos</div>}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Grid3X3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold">Ubicaciones</h2>
            <p className="text-muted-foreground">
              Lista completa de todas las ubicaciones
            </p>
          </div>
        </div>

        <LocationsTable
          warehouseLocations={warehouseLocations}
          allWarehouses={allWarehouses || []}
          page={page}
          limit={limit}
          totalCount={totalCount}
          onPageChange={setPage}
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={setSelectedWarehouse}
          viewMode="all"
          onLocationClick={handleLocationClick}
        />
      </div>

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
        onRackClick={handleRackClick}
      />
    </div>
  );
};
