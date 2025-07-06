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
import { Eye, Search, ArrowUpDown, Building2, Package } from "lucide-react";
import { statusConfig } from "@/components/common/status-config";
import type { Location, Rack, Warehouse } from "@/lib/types";

interface LocationsTableProps {
  warehouseLocations: any;
  onLocationClick: (
    location: Location,
    rack: Rack,
    warehouse: Warehouse
  ) => void;
}

export const LocationsTable = ({
  warehouseLocations,
  onLocationClick,
}: LocationsTableProps) => {
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const allLocations = Object.entries(warehouseLocations).flatMap(
    ([warehouseId, warehouse]: [string, any]) =>
      Object.entries(warehouse.racks).flatMap(([rackId, rack]: [string, any]) =>
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

  // Filter locations
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

    return matchesStatus && matchesSearch;
  });

  // Sort locations
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle special cases
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

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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
            {sortedLocations.length} Ubicacion
            {sortedLocations.length !== 1 ? "s" : ""}
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

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Estados</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    {key === "disponible"
                      ? "Disponible"
                      : key === "almacenado"
                      ? "Almacenado"
                      : key === "reservado"
                      ? "Reservado"
                      : key === "en_transito"
                      ? "En tránsito"
                      : key === "mantenimiento"
                      ? "En mantenimiento"
                      : config.label}
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
                <SortableHeader field="trackingCode">
                  Code de Tracking
                </SortableHeader>
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
                    No locations found matching your criteria
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
                          L{location.level}C{location.column}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`
                            ${status.bgColor} ${status.textColor} ${status.borderColor}
                            border text-xs
                          `}
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

      {/* Table Summary */}
      {sortedLocations.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>
              Disponible:{" "}
              {
                sortedLocations.filter((loc) => loc.status === "disponible")
                  .length
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>
              Almacenado:{" "}
              {
                sortedLocations.filter((loc) => loc.status === "almacenado")
                  .length
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>
              Reservado:{" "}
              {
                sortedLocations.filter((loc) => loc.status === "reservado")
                  .length
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>
              En transito:{" "}
              {
                sortedLocations.filter((loc) => loc.status === "en_transito")
                  .length
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span>
              Mantenimiento:{" "}
              {
                sortedLocations.filter((loc) => loc.status === "mantenimiento")
                  .length
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
