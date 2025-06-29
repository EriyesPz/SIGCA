import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw, Search, Building2 } from "lucide-react";
import { statusConfig } from "@/components/common/status-config";
import type { WarehouseData } from "@/lib/types";

interface FilterPanelProps {
  warehouseLocations: WarehouseData;
  selectedWarehouse: string;
  selectedStatus: string;
  searchTerm: string;
  onWarehouseChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onResetFilters: () => void;
}

export const FilterPanel = ({
  warehouseLocations,
  selectedWarehouse,
  selectedStatus,
  searchTerm,
  onWarehouseChange,
  onStatusChange,
  onSearchChange,
  onResetFilters,
}: FilterPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="warehouse">Almacen</Label>
          <Select value={selectedWarehouse} onValueChange={onWarehouseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Almacenes</SelectItem>
              {Object.entries(warehouseLocations).map(([id, warehouse]) => (
                <SelectItem key={id} value={id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {warehouse.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estados</Label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
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

        <div className="space-y-2">
          <Label htmlFor="search">Codigo de tracking</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search tracking code..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Button variant="outline" onClick={onResetFilters} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Limpiar
        </Button>
      </CardContent>
    </Card>
  );
};
