// components/warehouse/location-table.tsx
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  Eye,
  Search,
  ArrowUpDown,
  Building2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { statusConfig } from "@/components/common/status-config";
import type { Location, Rack, Warehouse } from "@/lib/types";

interface LocationsTableProps {
  warehouseLocations: Record<string, Warehouse>;
  allWarehouses: { Id: string; Name: string }[];
  onLocationClick: (
    location: Location,
    rack: Rack,
    warehouse: Warehouse
  ) => void;
  page: number;
  limit: number;
  totalCount: number; // viene del backend para server paging
  onPageChange: (newPage: number) => void;
  viewMode?: "all";
  selectedWarehouse?: string;
  setSelectedWarehouse?: (id: string) => void;
  filterStatus: string; // lo usa el backend cuando estás en server paging
  setFilterStatus: (status: string) => void;

  // 🔎 NUEVO: búsqueda controlada desde el padre
  searchTerm: string;
  onSearchChange: (v: string) => void;
}

export const LocationsTable = ({
  warehouseLocations,
  allWarehouses,
  onLocationClick,
  page,
  limit,
  totalCount,
  onPageChange,
  viewMode = "all",
  selectedWarehouse = "all",
  setSelectedWarehouse,
  filterStatus,
  setFilterStatus,
  searchTerm,
  onSearchChange,
}: LocationsTableProps) => {
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // 👉 En global (sin almacén seleccionado) usamos paginación del servidor
  const serverPaging = viewMode === "all" && selectedWarehouse === "all";

  // Reset a página 1 cuando cambian filtros locales SOLO si paginamos en cliente
  useEffect(() => {
    if (!serverPaging) {
      onPageChange(1);
    }
    // searchTerm lo controla el padre y él mismo resetea la página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWarehouse, filterStatus]);

  const allLocations = useMemo(() => {
    return Object.entries(warehouseLocations).flatMap(
      ([warehouseId, warehouse]: [string, any]) =>
        Object.entries(warehouse.racks).flatMap(([, rack]: [string, any]) =>
          rack.locations.map((location: any) => ({
            ...location,
            warehouseId,
            warehouseName: warehouse.name,
            rackId: rack.id,
            rackName: rack.name,
            warehouse,
            rack,
          }))
        )
    );
  }, [warehouseLocations]);

  // Filtros/Búsqueda locales SOLO en client paging (cuando hay almacén seleccionado)
  const filteredLocations = useMemo(() => {
    if (serverPaging) {
      // En server paging no tocamos la lista (ya viene filtrada/paginada por el back)
      return allLocations;
    }

    const term = searchTerm.trim().toLowerCase();

    return allLocations.filter((location) => {
      const matchesStatus =
        filterStatus === "all" || location.status === filterStatus;

      const matchesSearch =
        term === "" ||
        location.id?.toLowerCase().includes(term) ||
        location.warehouseName?.toLowerCase().includes(term) ||
        location.rackName?.toLowerCase().includes(term) ||
        location.trackingCode?.toLowerCase().includes(term) ||
        location.description?.toLowerCase().includes(term) ||
        location.houseAirWaybillNumber?.toLowerCase().includes(term) ||
        location.airWaybillNumber?.toLowerCase().includes(term); // AWB

      const matchesWarehouse =
        viewMode === "all"
          ? selectedWarehouse === "all" ||
            location.warehouseId === selectedWarehouse
          : true;

      return matchesStatus && matchesSearch && matchesWarehouse;
    });
  }, [
    allLocations,
    serverPaging,
    filterStatus,
    searchTerm,
    selectedWarehouse,
    viewMode,
  ]);

  const sortedLocations = useMemo(() => {
    const list = [...filteredLocations];
    return list.sort((a, b) => {
      let aValue = (a as any)[sortField];
      let bValue = (b as any)[sortField];

      if (sortField === "position") {
        aValue = `L${a.level}C${a.column}`;
        bValue = `L${b.level}C${b.column}`;
      }

      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue === bValue) return 0;
      if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredLocations, sortField, sortDirection]);

  // 👇 Paginación: server vs client
  const currentPageLocations = useMemo(() => {
    if (serverPaging) {
      // Ya viene una sola página desde el backend
      return sortedLocations;
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    return sortedLocations.slice(start, end);
  }, [serverPaging, sortedLocations, page, limit]);

  // 👇 Total pages: server vs client
  const totalPages = useMemo(() => {
    if (serverPaging) {
      return Math.max(1, Math.ceil(totalCount / limit));
    }
    return Math.max(1, Math.ceil(filteredLocations.length / limit));
  }, [serverPaging, totalCount, limit, filteredLocations.length]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        <div className="flex items-center gap-1">
          {children}
          <ArrowUpDown className="w-3 h-3" />
        </div>
      </Button>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <span className="font-medium">
            {serverPaging
              ? `${totalCount} Ubicacione${
                  totalCount !== 1 ? "s" : ""
                } (totales)`
              : `${filteredLocations.length} Ubicacione${
                  filteredLocations.length !== 1 ? "s" : ""
                }`}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por tracking, AWB o HAWB…"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)} // 👈 padre controla (backend/cliente)
              className="pl-10 w-full sm:w-72"
            />
          </div>

          {viewMode === "all" && setSelectedWarehouse && (
            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Almacén" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los almacenes</SelectItem>
                {allWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse.Id} value={warehouse.Id}>
                    {warehouse.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* En serverPaging, el backend ya filtra por status (hook) */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    {config.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <SortableHeader field="id">ID Ubicación</SortableHeader>
                <SortableHeader field="warehouseName">Almacén</SortableHeader>
                <SortableHeader field="rackName">Rack</SortableHeader>
                <SortableHeader field="position">Posición</SortableHeader>
                <SortableHeader field="status">Estado</SortableHeader>
                <SortableHeader field="houseAirWaybillNumber">
                  Guía
                </SortableHeader>
                <SortableHeader field="trackingCode">Tracking</SortableHeader>
                <SortableHeader field="description">Descripción</SortableHeader>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageLocations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No se encontraron ubicaciones
                  </TableCell>
                </TableRow>
              ) : (
                currentPageLocations.map((location) => {
                  const status = statusConfig[
                    location.status as keyof typeof statusConfig
                  ] ?? {
                    label: location.status || "Desconocido",
                    bgColor: "bg-gray-100",
                    textColor: "text-gray-500",
                    borderColor: "border-gray-300",
                  };

                  return (
                    <TableRow
                      key={location.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-mono text-sm">
                        {location.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {location.warehouseName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{location.rackName}</span>
                        <div className="text-xs text-muted-foreground">
                          {location.rackId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {location.level}-{location.column}
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
                        <span className="font-mono text-sm">
                          {location.houseAirWaybillNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        {location.trackingCode ? (
                          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {location.trackingCode}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {location.description ? (
                          <span className="text-sm">
                            {location.description}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onLocationClick(
                              location,
                              location.rack,
                              location.warehouse
                            )
                          }
                          className="h-8 w-8 p-0"
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
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-4 pt-2">
        <span className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
