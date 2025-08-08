import type { WarehouseData } from "@/lib/types";

// Fila base que viene del backend/enriched
type Row = {
  warehouse: string;
  warehouseName?: string;
  rackCode: string;
  rack: string;
  level: number;
  column: string | number;
  status?: string;
  isOccupied?: boolean;
  trackingCode?: string | null;
  description?: string | null;

  // ➕ Extras que necesitas en tabla/modal
  airWaybillNumber?: string | null;
  houseAirWaybillNumber?: string | null;
  masterAirWaybillNumber?: string | null;
  manifestNumber?: string | null;
  weightKg?: number | null;
  dimensionsCm?: { Width: number; Height: number; Length: number } | null;
};

export const buildWarehouseTree = (rows: Row[]): WarehouseData => {
  const tree: any = {};

  rows.forEach((row) => {
    const wId = row.warehouse;
    const rId = row.rackCode;

    // Crea nodo de almacén
    tree[wId] ??= {
      name: row.warehouseName ?? row.warehouse,
      racks: {},
    };

    // Crea nodo de rack
    tree[wId].racks[rId] ??= {
      id: rId,
      name: row.rack,
      levels: 0,
      columns: 0,
      locations: [],
    };

    const rack = tree[wId].racks[rId];

    // Normaliza columna para el cómputo de 'columns'
    const colNumber =
      typeof row.column === "string"
        ? row.column.toUpperCase().charCodeAt(0) - 64
        : Number(row.column);

    // ⚠️ IMPORTANTE: arrastrar TODOS los campos del row
    rack.locations.push({
      ...row, // <- aquí viajan houseAirWaybillNumber, airWaybillNumber, etc.

      // y sobreescribimos/normalizamos claves "core" de la location:
      id: `${rId}:${row.level}-${row.column}`,
      level: row.level,
      column: row.column,
      status: row.status ?? (row.isOccupied ? "almacenado" : "disponible"),
      trackingCode: row.trackingCode ?? null,
      description: row.description ?? null,
    });

    // Actualiza métricas de rack
    rack.levels = Math.max(rack.levels, row.level);
    rack.columns = Math.max(rack.columns, colNumber);
  });

  return tree;
};
