import { Card, CardContent } from "@/components/ui/card";
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
import { RotateCcw, Filter } from "lucide-react";
import type { CargoEntryFilters } from "./types";

interface ReportFiltersComponentProps {
  filters: CargoEntryFilters;
  onFiltersChange: (filters: CargoEntryFilters) => void;
  onResetFilters: () => void;
  showStatusFilter?: boolean;
  showUserFilter?: boolean;        // reservado si luego lo usas por ID
  showWarehouseFilter?: boolean;   // ← usamos esto para renderizar el select
  showCargoTypeFilter?: boolean;
  title?: string;
  warehouseOptions?: { id: string; name: string }[]; // ← NUEVO
}

export const ReportFiltersComponent = ({
  filters,
  onFiltersChange,
  onResetFilters,
  showStatusFilter = false,
  showCargoTypeFilter = false,
  showWarehouseFilter = false,
  title = "Filtros del Reporte",
  warehouseOptions = [],
}: ReportFiltersComponentProps) => {
  const handleFilterChange = (key: keyof CargoEntryFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Title */}
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-700 dark:text-white">
              {title}
            </h3>
          </div>

          {/* Filters grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {/* Date range */}
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Fecha Inicio
              </Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Fecha Fin
              </Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>

            {/* Tracking code */}
            <div className="space-y-2">
              <Label
                htmlFor="trackingCode"
                className="text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Código de Seguimiento
              </Label>
              <Input
                id="trackingCode"
                type="text"
                placeholder="Buscar por código…"
                value={filters.trackingCode || ""}
                onChange={(e) =>
                  handleFilterChange("trackingCode", e.target.value)
                }
              />
            </div>

            {/* Estado */}
            {showStatusFilter && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Estado
                </Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(v) => handleFilterChange("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="almacenado">Almacenado</SelectItem>
                    <SelectItem value="en_transito">En Tránsito</SelectItem>
                    <SelectItem value="en_revision">En Revisión</SelectItem>
                    <SelectItem value="liberado">Liberado</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Almacén */}
            {showWarehouseFilter && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Almacén
                </Label>
                <Select
                  value={filters.warehouse || "all"}
                  onValueChange={(v) => handleFilterChange("warehouse", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar almacén" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los almacenes</SelectItem>
                    {warehouseOptions.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tipo de Carga */}
            {showCargoTypeFilter && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Tipo de Carga
                </Label>
                <Select
                  value={(filters as any).cargoType ?? "all"}
                  onValueChange={(v) =>
                    handleFilterChange("cargoType" as any, v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="electronica">Electrónica</SelectItem>
                    <SelectItem value="textil">Textil</SelectItem>
                    <SelectItem value="alimentaria">Alimentaria</SelectItem>
                    <SelectItem value="farmaceutica">Farmacéutica</SelectItem>
                    <SelectItem value="automotriz">Automotriz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Reset */}
          <div className="mt-4 flex justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
