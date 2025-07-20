export interface CargoMovement {
  id: string
  date: string
  type: "IN" | "OUT" | "DAMAGED" | "RETURNED"
  cargoCategory: string
  trackingCode: string
  description: string
  weightKg: number
  quantity: number
  warehouse: string
  createdAt: string
}

export interface DailyCargoSummary {
  date: string
  summary: CargoTypeSummary[]
  totals: {
    totalCargos: number
    totalWeight: number
    totalUnits: number
    byType: {
      IN: { count: number; weight: number; units: number }
      OUT: { count: number; weight: number; units: number }
      DAMAGED: { count: number; weight: number; units: number }
      RETURNED: { count: number; weight: number; units: number }
    }
  }
}

export interface CargoTypeSummary {
  type: "IN" | "OUT" | "DAMAGED" | "RETURNED"
  count: number
  totalWeight: number
  totalUnits: number
  items: CargoMovement[]
}

export interface ReportFilters {
  startDate: string
  endDate: string
}

export interface OverallSummary {
  totalReceived: number
  totalDispatched: number
  totalWeight: number
  totalUnits: number
  totalDamaged: number
  totalReturned: number
}
