import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  allWarehouses: { Id: string; Name: string }[]; // <- nuevo
  onLocationClick: (
    location: Location,
    rack: Rack,
    warehouse: Warehouse
  ) => void;
  page: number;
  limit: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
}

export const LocationsTable = ({
  warehouseLocations,
  allWarehouses,
  onLocationClick,
  page,
  limit,
  totalCount,
  onPageChange,
}: LocationsTableProps) => {
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const allLocations = Object.entries(warehouseLocations).flatMap(
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

  const filteredLocations = allLocations.filter((location) => {
    const matchesStatus =
      filterStatus === "all" || location.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      location.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.rackName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (location.trackingCode &&
        location.trackingCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (location.description &&
        location.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesWarehouse =
      selectedWarehouse === "all" || location.warehouseId === selectedWarehouse;

    return matchesStatus && matchesSearch && matchesWarehouse;
  });

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "position") {
      aValue = `L${a.level}C${a.column}`;
      bValue = `L${b.level}C${b.column}`;
    }

    if (aValue === null || aValue === undefined) aValue = "";
    if (bValue === null || bValue === undefined) bValue = "";

    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    return sortDirection === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : aValue < bValue
      ? 1
      : -1;
  });

  const totalPages = Math.ceil(totalCount / limit);

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
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <span className="font-medium">
            {totalCount} Ubicación{totalCount !== 1 ? "es" : ""}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar ubicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

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

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <SortableHeader field="id">ID Ubicacion</SortableHeader>
                <SortableHeader field="warehouseName">Almacen</SortableHeader>
                <SortableHeader field="rackName">Rack</SortableHeader>
                <SortableHeader field="position">Posicion</SortableHeader>
                <SortableHeader field="status">Estado</SortableHeader>
                <SortableHeader field="trackingCode">Tracking</SortableHeader>
                <SortableHeader field="description">Descripcion</SortableHeader>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLocations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No se encontraron ubicaciones
                  </TableCell>
                </TableRow>
              ) : (
                sortedLocations.map((location) => {
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

      {/* Pagination Controls */}
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
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
