import type { CargoMovement, DailyCargoSummary, CargoTypeSummary, OverallSummary } from "@/components/cargo-report/types";

export const generateDailyCargoReports = (movements: CargoMovement[]): DailyCargoSummary[] => {
  const groupedByDate = movements.reduce(
    (acc, movement) => {
      if (!acc[movement.date]) {
        acc[movement.date] = []
      }
      acc[movement.date].push(movement)
      return acc
    },
    {} as Record<string, CargoMovement[]>,
  )

  return Object.entries(groupedByDate)
    .map(([date, dayMovements]) => {
      const groupByType = (type: "IN" | "OUT" | "DAMAGED" | "RETURNED"): CargoTypeSummary => {
        const typeMovements = dayMovements.filter((m) => m.type === type)
        return {
          type,
          count: typeMovements.length,
          totalWeight: typeMovements.reduce((sum, item) => sum + item.weightKg, 0),
          totalUnits: typeMovements.reduce((sum, item) => sum + item.quantity, 0),
          items: typeMovements,
        }
      }

      const inSummary = groupByType("IN")
      const outSummary = groupByType("OUT")
      const damagedSummary = groupByType("DAMAGED")
      const returnedSummary = groupByType("RETURNED")

      return {
        date,
        summary: [inSummary, outSummary, damagedSummary, returnedSummary].filter((s) => s.count > 0),
        totals: {
          totalCargos: dayMovements.length,
          totalWeight: dayMovements.reduce((sum, item) => sum + item.weightKg, 0),
          totalUnits: dayMovements.reduce((sum, item) => sum + item.quantity, 0),
          byType: {
            IN: { count: inSummary.count, weight: inSummary.totalWeight, units: inSummary.totalUnits },
            OUT: { count: outSummary.count, weight: outSummary.totalWeight, units: outSummary.totalUnits },
            DAMAGED: {
              count: damagedSummary.count,
              weight: damagedSummary.totalWeight,
              units: damagedSummary.totalUnits,
            },
            RETURNED: {
              count: returnedSummary.count,
              weight: returnedSummary.totalWeight,
              units: returnedSummary.totalUnits,
            },
          },
        },
      }
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export const calculateOverallSummary = (reports: DailyCargoSummary[]): OverallSummary => {
  return reports.reduce(
    (acc, report) => ({
      totalReceived: acc.totalReceived + report.totals.byType.IN.count,
      totalDispatched: acc.totalDispatched + report.totals.byType.OUT.count,
      totalWeight: acc.totalWeight + report.totals.totalWeight,
      totalUnits: acc.totalUnits + report.totals.totalUnits,
      totalDamaged: acc.totalDamaged + report.totals.byType.DAMAGED.count,
      totalReturned: acc.totalReturned + report.totals.byType.RETURNED.count,
    }),
    {
      totalReceived: 0,
      totalDispatched: 0,
      totalWeight: 0,
      totalUnits: 0,
      totalDamaged: 0,
      totalReturned: 0,
    },
  )
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  })
}

export const formatWeight = (weight: number): string => {
  return `${weight.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`
}

export const formatNumber = (num: number): string => {
  return num.toLocaleString("es-ES")
}

export const getTypeColor = (type: "IN" | "OUT" | "DAMAGED" | "RETURNED"): string => {
  const colors = {
    IN: "text-green-600 bg-green-50 border-green-200",
    OUT: "text-blue-600 bg-blue-50 border-blue-200",
    DAMAGED: "text-red-600 bg-red-50 border-red-200",
    RETURNED: "text-orange-600 bg-orange-50 border-orange-200",
  }
  return colors[type]
}

export const getTypeIcon = (type: "IN" | "OUT" | "DAMAGED" | "RETURNED"): string => {
  const icons = {
    IN: "↗️",
    OUT: "↙️",
    DAMAGED: "⚠️",
    RETURNED: "↩️",
  }
  return icons[type]
}
