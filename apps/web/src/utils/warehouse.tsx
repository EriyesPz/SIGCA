import type { WarehouseData } from "@/lib/types"

export const buildWarehouseTree = (rows: any[]): WarehouseData => {
  const tree: any = {}

  rows.forEach((row) => {
    const wId = row.warehouse
    const rId = row.rackCode

    tree[wId] ??= { name: row.warehouse, racks: {} }
    tree[wId].racks[rId] ??= {
      id: rId,
      name: row.rack,
      levels: 0,
      columns: 0,
      locations: [],
    }

    const rack = tree[wId].racks[rId]
    rack.locations.push({
      id: `${rId}-L${row.level}-C${row.column}`,
      level: row.level,
      column: row.column,
      status: row.status ?? (row.isOccupied ? "occupied" : "available"),
      trackingCode: row.trackingCode,
      description: row.description,
    })

    rack.levels = Math.max(rack.levels, row.level)
    const colNumber = typeof row.column === "string" ? row.column.toUpperCase().charCodeAt(0) - 64 : Number(row.column)
    rack.columns = Math.max(rack.columns, colNumber)
  })

  return tree
}
