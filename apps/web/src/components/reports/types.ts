export interface CargoEntryFilters  {
  startDate: string;
  endDate: string;
  trackingCode: string;
  status: string;
  user: string;
  warehouse: string;
  cargoType: string;
}

export interface CargoEntry {
  id: string;
  trackingCode: string;
  description: string;
  category: string;
  weightKg: number;
  quantity: number;
  entryDate: string;
  status: string;
  warehouse: string;
  location: {
    rack: string;
    level: number;
    column: number;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  createdBy: string;
  createdAt: string;
}

export interface InternalTransfer {
  id: string;
  trackingCode: string;
  cargoDescription: string;
  transferDate: string;
  previousLocation: {
    warehouse: string;
    rack: string;
    level: number;
    column: number;
  };
  newLocation: {
    warehouse: string;
    rack: string;
    level: number;
    column: number;
  };
  transferredBy: string;
  reason: string;
  notes?: string;
}

export interface CargoReturn {
  id: string;
  trackingCode: string;
  cargoDescription: string;
  previousStatus: string;
  newStatus: string;
  changeType: string;
  changeDate: string;
  performedBy: string;
  reason: string;
  notes?: string;
}

export interface CargoExit {
  id: string;
  trackingCode: string;
  cargoDescription: string;
  exitDate: string;
  receiver: string;
  destination: string;
  exitType: string;
  verifiedBy: string;
  deliveryResponsible: string;
  transportMethod: string;
  notes?: string;
}

export interface CargoMovement {
  id: string;
  date: string;
  type: "entrada" | "salida";
  cargoType: string;
  trackingCode: string;
  description: string;
  weightKg: number;
  quantity: number;
  status: string;
  warehouse: string;
}

export interface DailyReport {
  date: string;
  entries: CargoSummary[];
  exits: CargoSummary[];
  totals: {
    totalEntries: number;
    totalExits: number;
    totalWeightIn: number;
    totalWeightOut: number;
    totalUnitsIn: number;
    totalUnitsOut: number;
  };
}

export interface CargoSummary {
  cargoType: string;
  count: number;
  totalWeight: number;
  totalUnits: number;
  items: CargoMovement[];
}

export interface CargoTypeFilters {
  startDate: string;
  endDate: string;
  cargoType: string;
  warehouse: string;
}
