"use client";

import { useState, useMemo } from "react";
import { Package, Grid3X3, Building2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RackCard,
  FilterPanel,
  StatusLegend,
  QuickStats,
  LocationDetailsModal,
  RackLocationsModal,
  LocationsTable
} from "@/components/warehouse";
import { buildWarehouseTree } from "@/utils/warehouse";
import type { Location, Rack, Warehouse } from "@/lib/types";
import { useLocations } from "@/lib/locations";

export const WarehouseLocationTracker = () => {
  const { data = [], isLoading, error } = useLocations();
  const warehouseLocations = useMemo(() => buildWarehouseTree(data), [data]);

  const [viewMode, setViewMode] = useState<"all" | "by_warehouse">("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRack, setSelectedRack] = useState<any>(null);
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);

  const resetFilters = () => {
    setSelectedWarehouse("all");
    setSelectedStatus("all");
    setSearchTerm("");
  };

  const getFilteredData = () => {
    let filtered = warehouseLocations;

    if (viewMode === "by_warehouse") {
      if (selectedWarehouse !== "all") {
        filtered = {
          [selectedWarehouse]: warehouseLocations[selectedWarehouse],
        };
      }
    } else {
      const allLocationsFlattened: any = {};

      Object.entries(warehouseLocations).forEach(([warehouseId, warehouse]) => {
        if (selectedWarehouse === "all" || warehouseId === selectedWarehouse) {
          Object.entries(warehouse.racks).forEach(([rackId, rack]) => {
            allLocationsFlattened[rackId] = {
              ...rack,
              warehouseName: warehouse.name,
              warehouseLocation: warehouse.location,
              warehouseId: warehouseId,
            };
          });
        }
      });

      filtered = {
        "all-locations": {
          name: "All Locations",
          location: "Combined View",
          racks: allLocationsFlattened,
        },
      };
    }

    Object.keys(filtered).forEach((warehouseId) => {
      const warehouse = filtered[warehouseId];
      Object.keys(warehouse.racks).forEach((rackId) => {
        const rack = warehouse.racks[rackId];
        rack.locations = rack.locations.filter((location: any) => {
          const matchesStatus =
            selectedStatus === "all" || location.status === selectedStatus;
          const matchesSearch =
            searchTerm === "" ||
            (location.trackingCode &&
              location.trackingCode
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (location.description &&
              location.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()));

          return matchesStatus && matchesSearch;
        });
      });
    });

    return filtered;
  };

  const filteredData = getFilteredData();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tracker de Ubicaciones de Almacen 
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Tabs
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as "all" | "by_warehouse")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all" className="text-xs">
                    Todas las Ubicaciones
                  </TabsTrigger>
                  <TabsTrigger value="by_warehouse" className="text-xs">
                    Ubicaciones por Almacen
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      {isLoading && <div className="p-6 text-sm">Loading warehouse data…</div>}
      {error && <div className="p-6 text-red-600">Error loading locations</div>}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel - Only show for by_warehouse view */}
          {viewMode === "by_warehouse" && (
            <div className="lg:w-80 space-y-6">
              <FilterPanel
                warehouseLocations={warehouseLocations}
                selectedWarehouse={selectedWarehouse}
                selectedStatus={selectedStatus}
                searchTerm={searchTerm}
                onWarehouseChange={setSelectedWarehouse}
                onStatusChange={setSelectedStatus}
                onSearchChange={setSearchTerm}
                onResetFilters={resetFilters}
              />

              <StatusLegend />

              <QuickStats filteredData={filteredData} />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="space-y-8">
              {viewMode === "all" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Grid3X3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h2 className="text-2xl font-bold">
                        All Warehouse Locations
                      </h2>
                      <p className="text-muted-foreground">
                        Complete list of all locations across warehouses
                      </p>
                    </div>
                  </div>

                  <LocationsTable
                    warehouseLocations={warehouseLocations}
                    onLocationClick={handleLocationClick}
                  />
                </div>
              ) : (
                Object.entries(filteredData).map(([warehouseId, warehouse]) => (
                  <div key={warehouseId} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h2 className="text-2xl font-bold">{warehouse.name}</h2>
                        <p className="text-muted-foreground">
                          {warehouse.location}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {Object.values(warehouse.racks).map((rack) => (
                        <RackCard
                          key={rack.id}
                          rack={rack}
                          warehouse={warehouse}
                          viewMode={viewMode}
                          onRackClick={handleRackClick}
                          onLocationClick={handleLocationClick}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
