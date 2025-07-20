"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, RotateCcw } from "lucide-react"
import type { ReportFilters } from "./types";

interface DateFiltersProps {
  filters: ReportFilters
  onFiltersChange: (filters: ReportFilters) => void
  onResetFilters: () => void
}

export const DateFilters = ({ filters, onFiltersChange, onResetFilters }: DateFiltersProps) => {
  const handleStartDateChange = (value: string) => {
    onFiltersChange({ ...filters, startDate: value })
  }

  const handleEndDateChange = (value: string) => {
    onFiltersChange({ ...filters, endDate: value })
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">Filtros de Fecha:</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-600">
                  Fecha Inicio
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-40"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-600">
                  Fecha Fin
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={onResetFilters} className="flex items-center gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
