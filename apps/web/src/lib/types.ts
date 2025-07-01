export interface UserCreateInput {
  Username: string;
  Email: string;
  Password: string;
}

export interface UserCreatedResponse {
  userId: string;
  message: string;
}

export interface LoginInput {
  Email: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  userName: string;
  email: string;
}

export interface Location {
  id: string
  level: number
  column: number
  status: string
  trackingCode?: string | null
  description?: string | null
  entryDate?: string | null
  exitDate?: string | null
  assignedUser?: string | null
  weight?: string | null
  dimensions?: string | null
}

export interface Rack {
  id: string
  name: string
  levels: number
  columns: number
  locations: Location[]
  warehouseName?: string
  warehouseLocation?: string
  warehouseId?: string
}

export interface Warehouse {
  name: string
  location?: string
  racks: Record<string, Rack>
}

export interface WarehouseData {
  [key: string]: Warehouse
}

export interface CargoFormData {
  trackingCode: string
  description: string
  status: "en tránsito" | "almacenado" | "revisión" | "liberado" | "entregado"
  weightKg: number
  quantity: number
  entryDate: string
  isPerishable: boolean
  warehouseId: string
  rackId: string
  level: number
  column: number
  documents: DocumentUpload[]
  createdBy: string
  createdAt?: string
}

export interface DocumentUpload {
  id: string
  file: File
  type: "invoice" | "certificate" | "photo" | "other"
  metadata: Record<string, string>
  preview?: string
}

export interface WarehouseLocation {
  id: string
  name: string
  racks: Rack[]
}

export interface Rack {
  id: string
  name: string
  levels: number
  columns: number
  occupiedPositions: Set<string>
}

export interface Position {
  level: number;
  column: string;
  isOccupied: boolean;
  trackingCode?: string | null;
  status?: string | null;
  description?: string | null;
}