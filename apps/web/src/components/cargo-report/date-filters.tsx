import { CalendarDays, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { ReportFilters } from "./types"

interface DateFiltersProps {
  filters: ReportFilters
  onFiltersChange: (f: ReportFilters) => void
  onResetFilters: () => void
}

export const DateFilters = ({
  filters,
  onFiltersChange,
  onResetFilters,
}: DateFiltersProps) => {
  /* helpers ---------- */
  const change = (k: keyof ReportFilters, v: string) =>
    onFiltersChange({ ...filters, [k]: v })

  /* ui ---------- */
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* bloque izquierda */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* título */}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Filtros de Fecha
              </span>
            </div>

            {/* rangos de fecha */}
            <div className="flex items-center gap-4">
              {/* inicio */}
              <div className="space-y-1">
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
                  onChange={(e) => change("startDate", e.target.value)}
                  className="w-40"
                />
              </div>

              {/* fin */}
              <div className="space-y-1">
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
                  onChange={(e) => change("endDate", e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>

          {/* botón reset */}
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="flex items-center gap-2 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
