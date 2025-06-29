import type { WarehouseLocation } from "@/lib/types"

export const warehouses: WarehouseLocation[] = [
  {
    id: "WH-001",
    name: "Main Distribution Center",
    racks: [
      {
        id: "R-001",
        name: "Rack Alpha-01",
        levels: 4,
        columns: 6,
        occupiedPositions: new Set(["1-1", "1-3", "2-2", "3-4", "4-1"]),
        locations: [],
      },
      {
        id: "R-002",
        name: "Rack Beta-02",
        levels: 3,
        columns: 4,
        occupiedPositions: new Set(["1-1", "2-3"]),
        locations: [],
      },
      {
        id: "R-003",
        name: "Rack Gamma-03",
        levels: 5,
        columns: 8,
        occupiedPositions: new Set(["1-2", "1-4", "3-6", "5-1", "5-8"]),
        locations: [],
      },
    ],
  },
  {
    id: "WH-002",
    name: "Cold Storage Facility",
    racks: [
      {
        id: "R-004",
        name: "Cold Rack Charlie-01",
        levels: 3,
        columns: 5,
        occupiedPositions: new Set(["1-1", "1-5", "2-3"]),
        locations: [],
      },
      {
        id: "R-005",
        name: "Cold Rack Delta-02",
        levels: 2,
        columns: 4,
        occupiedPositions: new Set(["1-2", "2-4"]),
        locations: [],
      },
    ],
  },
  {
    id: "WH-003",
    name: "Tech Equipment Storage",
    racks: [
      {
        id: "R-006",
        name: "Tech Rack Echo-01",
        levels: 4,
        columns: 6,
        occupiedPositions: new Set(["1-1", "1-6", "2-3", "3-2", "4-5"]),
        locations: [],
      },
    ],
  },
]

export const statusOptions = [
  { value: "en tránsito", label: "En Tránsito", color: "bg-blue-500" },
  { value: "almacenado", label: "Almacenado", color: "bg-green-500" },
  { value: "revisión", label: "En Revisión", color: "bg-yellow-500" },
  { value: "liberado", label: "Liberado", color: "bg-purple-500" },
  { value: "entregado", label: "Entregado", color: "bg-gray-500" },
]

export const documentTypes = [
  { value: "invoice", label: "Factura" },
  { value: "certificate", label: "Certificado" },
  { value: "photo", label: "Fotografía" },
  { value: "other", label: "Otro" },
]
