export interface DashboardMetrics {
  totalCargo: number
  cargoInTransit: number
  cargoStored: number
  cargoExited: number
  totalWeight: number
  occupancyRate: number
  dailyEntries: number
  dailyExits: number
  averageProcessingTime: number
  efficiency: number
  criticalAlerts: number
  pendingTasks: number
  activeUsers: number
  systemUptime: number
  storageCapacity: number
  utilizationRate: number
  monthlyGrowth: number
  costPerOperation: number
  energyConsumption: number
  maintenanceScheduled: number
}

export interface RecentActivity {
  id: string
  type: "entry" | "exit" | "transfer" | "return" | "maintenance" | "inspection"
  trackingCode: string
  description: string
  timestamp: string
  user: string
  status: "completed" | "pending" | "error" | "in-progress"
  priority: "low" | "medium" | "high" | "critical"
  location?: string
  duration?: number
  cost?: number
}

export interface WarehouseOccupancy {
  warehouse: string
  totalLocations: number
  occupiedLocations: number
  occupancyRate: number
  availableLocations: number
  reservedLocations: number
  maintenanceLocations: number
  temperature: number
  humidity: number
  lastInspection: string
  capacity: number
  utilizationTrend: "up" | "down" | "stable"
}

export interface DailyActivity {
  date: string
  entries: number
  exits: number
  transfers: number
  returns: number
  inspections: number
  maintenance: number
  revenue: number
  costs: number
  efficiency: number
}

export interface Alert {
  id: string
  type: "warning" | "error" | "info" | "critical" | "maintenance"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: "low" | "medium" | "high" | "critical"
  category: "security" | "operations" | "maintenance" | "system" | "compliance"
  assignedTo?: string
  estimatedResolution?: string
  affectedAreas: string[]
}

export interface QuickStat {
  label: string
  value: string | number
  change: number
  changeType: "increase" | "decrease" | "neutral"
  icon: string
  color: string
  target?: number
  unit?: string
  description?: string
}

export interface PerformanceMetric {
  name: string
  current: number
  target: number
  unit: string
  trend: "up" | "down" | "stable"
  category: "efficiency" | "quality" | "cost" | "time"
  lastUpdated: string
}

export interface WeatherData {
  temperature: number
  humidity: number
  conditions: string
  impact: "none" | "low" | "medium" | "high"
  forecast: string
}

export interface StaffMetrics {
  totalStaff: number
  activeStaff: number
  onBreak: number
  overtime: number
  productivity: number
  attendance: number
  shifts: {
    morning: number
    afternoon: number
    night: number
  }
}

export interface InventoryMetrics {
  totalItems: number
  lowStock: number
  overstock: number
  expiringSoon: number
  damaged: number
  value: number
  turnoverRate: number
  accuracy: number
}

export interface SecurityMetrics {
  accessAttempts: number
  securityIncidents: number
  cameraStatus: number
  alarmStatus: "active" | "inactive" | "maintenance"
  lastSecurityCheck: string
  vulnerabilities: number
}

export interface MaintenanceSchedule {
  id: string
  equipment: string
  type: "preventive" | "corrective" | "emergency"
  scheduledDate: string
  priority: "low" | "medium" | "high" | "critical"
  estimatedDuration: number
  assignedTechnician: string
  status: "scheduled" | "in-progress" | "completed" | "overdue"
}

export interface CostAnalysis {
  operationalCosts: number
  maintenanceCosts: number
  energyCosts: number
  laborCosts: number
  totalCosts: number
  costPerUnit: number
  budgetVariance: number
  projectedSavings: number
}
