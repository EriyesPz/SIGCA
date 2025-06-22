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
