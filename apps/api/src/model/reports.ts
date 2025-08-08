import { db } from "./db";
import { CargoStatus } from "../types/cargo";

type CargoEntryParams = {
  from?: string;       // YYYY-MM-DD opcional
  to?: string;         // YYYY-MM-DD opcional
  warehouseId?: string;
};

type ExitReportParams = {
  from?: string;       // YYYY-MM-DD opcional
  to?: string;         // YYYY-MM-DD opcional
  warehouseId?: string;
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export const cargoEntry = async (params: CargoEntryParams = {}) => {
  // Construir filtro de fechas sólo si se pasan
  let entryDateFilter: { gte?: Date; lte?: Date } | undefined = undefined;

  if (params.from || params.to) {
    const gte = params.from ? startOfDay(new Date(params.from)) : undefined;
    const lte = params.to ? endOfDay(new Date(params.to)) : undefined;
    entryDateFilter = {};
    if (gte) entryDateFilter.gte = gte;
    if (lte) entryDateFilter.lte = lte;
  }

  const cargos = await db.cargo.findMany({
    where: {
      ...(entryDateFilter ? { EntryDate: entryDateFilter } : {}), // si no hay fechas, no filtra
      ...(params.warehouseId ? { WarehouseId: params.warehouseId } : {}),
    },
    include: {
      Warehouse: true,
      RackColumn: {
        include: {
          RackLevels: {
            include: {
              Racks: true,
            },
          },
        },
      },
      Users: true,
      CargoDocuments: {
        select: { Id: true },
      },
    },
    orderBy: { EntryDate: "desc" },
  });

  let totalWeightKg = 0;
  let totalWithLocation = 0;
  let totalWithDocuments = 0;

  const data = cargos.map((cargo) => {
    const rackLevel = cargo.RackColumn?.RackLevels;
    const rack = rackLevel?.Racks;

    const hasLocation =
      !!cargo.RackColumn?.ColumnCode && !!rackLevel?.LevelNumber && !!rack?.Name;
    const hasDocuments = cargo.CargoDocuments.length > 0;

    if (cargo.WeightKg) totalWeightKg += cargo.WeightKg;
    if (hasLocation) totalWithLocation += 1;
    if (hasDocuments) totalWithDocuments += 1;

    return {
      id: cargo.Id,
      trackingCode: cargo.TrackingCode ?? null,
      description: cargo.Description ?? null,
      status: cargo.Status,
      weightKg: cargo.WeightKg,
      volumeM3: cargo.VolumeM3,
      quantity: cargo.Quantity,
      entryDate: cargo.EntryDate,
      warehouse: {
        id: cargo.Warehouse?.Id ?? null,
        name: cargo.Warehouse?.Name ?? null,
      },
      location: {
        rackName: rack?.Name ?? null,
        rackCode: rack?.Code ?? null,
        levelNumber: rackLevel?.LevelNumber ?? null,
        columnCode: cargo.RackColumn?.ColumnCode ?? null,
      },
      airWaybill: {
        master: cargo.MasterAirWaybillNumber ?? null,
        house: cargo.HouseAirWaybillNumber ?? null,
      },
      originAirport: cargo.OriginAirport ?? null,
      destinationAirport: cargo.DestinationAirport ?? null,
      arrivalDate: cargo.ArrivalDate ?? null,
      createdBy: cargo.Users?.Name ?? cargo.Users?.User ?? null,
      isPerishable: cargo.IsPerishable,
      isHazardousMaterial: cargo.IsHazardousMaterial,
      isHighValue: cargo.IsHighValue,
      hasDocuments,
    };
  });

  return {
    filters: {
      from: params.from ?? null,
      to: params.to ?? null,
      warehouseId: params.warehouseId ?? null,
    },
    data,
    total: data.length,
    totalWeightKg,
    totalWithLocation,
    totalWithDocuments,
  };
};

export const cargoExitReport = async (params: ExitReportParams = {}) => {
  // Construir filtros dinámicos
  let dateFilter: any = { not: null }; // por defecto: tiene ExitDate
  if (params.from && params.to) {
    dateFilter = {
      gte: startOfDay(new Date(params.from)),
      lte: endOfDay(new Date(params.to)),
    };
  } else if (params.from && !params.to) {
    dateFilter = {
      gte: startOfDay(new Date(params.from)),
    };
  } else if (!params.from && params.to) {
    dateFilter = {
      lte: endOfDay(new Date(params.to)),
    };
  }

  const cargos = await db.cargo.findMany({
    where: {
      ExitDate: dateFilter,
      ...(params.warehouseId ? { WarehouseId: params.warehouseId } : {}),
    },
    include: {
      Warehouse: true,
      RackColumn: {
        include: {
          RackLevels: {
            include: {
              Racks: true,
            },
          },
        },
      },
      Users: true,
      Deliveries: {
        include: {
          Users: true,
        },
        orderBy: { DeliveredAt: "desc" },
        take: 1, // la entrega más reciente (si hay varias)
      },
      CargoDocuments: {
        select: { Id: true },
      },
    },
    orderBy: {
      ExitDate: "desc",
    },
  });

  let totalWeightKg = 0;
  let totalWithDocuments = 0;

  const data = cargos.map((cargo) => {
    const rackLevel = cargo.RackColumn?.RackLevels;
    const rack = rackLevel?.Racks;
    const delivery = cargo.Deliveries[0];
    const hasDocuments = cargo.CargoDocuments.length > 0;

    if (cargo.WeightKg) totalWeightKg += cargo.WeightKg;
    if (hasDocuments) totalWithDocuments += 1;

    return {
      id: cargo.Id,
      trackingCode: cargo.TrackingCode ?? null,
      description: cargo.Description ?? null,
      status: cargo.Status,
      weightKg: cargo.WeightKg,
      volumeM3: cargo.VolumeM3,
      quantity: cargo.Quantity,
      entryDate: cargo.EntryDate,
      exitDate: cargo.ExitDate,
      warehouse: {
        id: cargo.Warehouse?.Id ?? null,
        name: cargo.Warehouse?.Name ?? null,
      },
      location: {
        rackName: rack?.Name ?? null,
        rackCode: rack?.Code ?? null,
        levelNumber: rackLevel?.LevelNumber ?? null,
        columnCode: cargo.RackColumn?.ColumnCode ?? null,
      },
      airWaybill: {
        master: cargo.MasterAirWaybillNumber ?? null,
        house: cargo.HouseAirWaybillNumber ?? null,
      },
      originAirport: cargo.OriginAirport ?? null,
      destinationAirport: cargo.DestinationAirport ?? null,
      arrivalDate: cargo.ArrivalDate ?? null,
      departureDate: cargo.DepartureDate ?? null,
      createdBy: cargo.Users?.Name ?? cargo.Users?.User ?? null,

      // Entrega
      deliveredAt: delivery?.DeliveredAt ?? null,
      deliveredBy: delivery?.Users?.Name ?? delivery?.Users?.User ?? null,
      receiver: delivery?.Receiver ?? null,

      hasDocuments,
      isPerishable: cargo.IsPerishable,
      isHazardousMaterial: cargo.IsHazardousMaterial,
      isHighValue: cargo.IsHighValue,
      documentsCount: cargo.CargoDocuments.length,
    };
  });

  return {
    data,
    total: data.length,
    totalWeightKg,
    totalWithDocuments,
    range: {
      from: params.from ?? null,
      to: params.to ?? null,
    },
    warehouseId: params.warehouseId ?? null,
  };
};

export const cargoTransferReport = async () => {
  const transfers = await db.transfers.findMany({
    include: {
      Cargo: {
        select: {
          Id: true,
          TrackingCode: true,
          Description: true,
          WeightKg: true,
          VolumeM3: true,
          Quantity: true,
          EntryDate: true,
          ExitDate: true,
        },
      },
      Users: true,
      Warehouse_Transfers_FromWarehouseIdToWarehouse: true,
      Warehouse_Transfers_ToWarehouseIdToWarehouse: true,
    },
    orderBy: {
      TransferDate: "desc",
    },
  });

  let totalWeightKg = 0;

  // Obtener todos los IDs de racks, niveles y columnas únicos para optimizar las consultas
  const rackIds = new Set<string>();
  const levelIds = new Set<string>();
  const columnIds = new Set<string>();

  transfers.forEach((transfer) => {
    if (transfer.FromRackId) rackIds.add(transfer.FromRackId);
    if (transfer.ToRackId) rackIds.add(transfer.ToRackId);
    if (transfer.FromLevelId) levelIds.add(transfer.FromLevelId);
    if (transfer.ToLevelId) levelIds.add(transfer.ToLevelId);
    if (transfer.FromColumnId) columnIds.add(transfer.FromColumnId);
    if (transfer.ToColumnId) columnIds.add(transfer.ToColumnId);
  });

  // Consultar todos los racks, niveles y columnas necesarios
  const racks = await db.racks.findMany({
    where: { Id: { in: Array.from(rackIds) } },
    select: { Id: true, Name: true },
  });

  const levels = await db.rackLevels.findMany({
    where: { Id: { in: Array.from(levelIds) } },
    select: { Id: true, LevelNumber: true },
  });

  const columns = await db.rackColumns.findMany({
    where: { Id: { in: Array.from(columnIds) } },
    select: { Id: true, ColumnCode: true },
  });

  // Crear mapas para acceso rápido
  const rackMap = new Map(racks.map((rack) => [rack.Id, rack]));
  const levelMap = new Map(levels.map((level) => [level.Id, level]));
  const columnMap = new Map(columns.map((column) => [column.Id, column]));

  const data = transfers.map((transfer) => {
    const cargo = transfer.Cargo;
    if (cargo?.WeightKg) totalWeightKg += cargo.WeightKg;

    // Obtener detalles del rack, nivel y columna de origen
    const fromRack = transfer.FromRackId
      ? rackMap.get(transfer.FromRackId)
      : null;
    const fromLevel = transfer.FromLevelId
      ? levelMap.get(transfer.FromLevelId)
      : null;
    const fromColumn = transfer.FromColumnId
      ? columnMap.get(transfer.FromColumnId)
      : null;

    // Obtener detalles del rack, nivel y columna de destino
    const toRack = transfer.ToRackId ? rackMap.get(transfer.ToRackId) : null;
    const toLevel = transfer.ToLevelId
      ? levelMap.get(transfer.ToLevelId)
      : null;
    const toColumn = transfer.ToColumnId
      ? columnMap.get(transfer.ToColumnId)
      : null;

    return {
      transferId: transfer.Id,
      transferDate: transfer.TransferDate,
      notes: transfer.Notes ?? null,

      cargo: {
        id: cargo?.Id,
        trackingCode: cargo?.TrackingCode ?? null,
        description: cargo?.Description ?? null,
        weightKg: cargo?.WeightKg,
        volumeM3: cargo?.VolumeM3,
        quantity: cargo?.Quantity,
        entryDate: cargo?.EntryDate,
        exitDate: cargo?.ExitDate,
      },

      fromLocation: {
        warehouse:
          transfer.Warehouse_Transfers_FromWarehouseIdToWarehouse?.Name ?? null,
        rackId: transfer.FromRackId ?? null,
        rackName: fromRack?.Name ?? null,
        levelId: transfer.FromLevelId ?? null,
        levelNumber: fromLevel?.LevelNumber ?? null,
        columnId: transfer.FromColumnId ?? null,
        columnCode: fromColumn?.ColumnCode ?? null,
      },

      toLocation: {
        warehouse:
          transfer.Warehouse_Transfers_ToWarehouseIdToWarehouse?.Name ?? null,
        rackId: transfer.ToRackId ?? null,
        rackName: toRack?.Name ?? null,
        levelId: transfer.ToLevelId ?? null,
        levelNumber: toLevel?.LevelNumber ?? null,
        columnId: transfer.ToColumnId ?? null,
        columnCode: toColumn?.ColumnCode ?? null,
      },

      transferredBy: transfer.Users?.Name ?? transfer.Users?.User ?? null,
    };
  });

  return {
    data,
    total: data.length,
    totalWeightKg,
  };
};

export const distributionByLocationReport = async () => {
  const cargos = await db.cargo.findMany({
    where: {
      ExitDate: null,
      ColumnId: {
        not: null,
      },
    },
    include: {
      Warehouse: true,
      RackColumn: {
        include: {
          RackLevels: {
            include: {
              Racks: {
                include: {
                  Warehouse: true,
                },
              },
            },
          },
        },
      },
      Users: true,
    },
    orderBy: {
      EntryDate: "asc",
    },
  });

  const result = cargos.map((cargo) => {
    const rackLevel = cargo.RackColumn?.RackLevels;
    const rack = rackLevel?.Racks;
    const warehouse = cargo.Warehouse;
    const capacity = rack?.Capacity ?? 100;
    const utilization = Math.min(
      Math.round((cargo.Quantity / capacity) * 100),
      100
    );

    let utilizationLevel = "Baja";
    if (utilization >= 75) utilizationLevel = "Alta";
    else if (utilization >= 50) utilizationLevel = "Media";

    return {
      codigo: cargo.TrackingCode ?? `CGX-${cargo.Id.slice(0, 8)}`,
      descripcion: cargo.Description ?? "-",
      almacen: warehouse?.Name ?? "Sin Almacén",
      rack: rack?.Code ?? rack?.Name ?? "Sin Rack",
      nivel: `${rackLevel?.LevelNumber.toString()}`,
      columna: cargo.RackColumn?.ColumnCode ?? "Sin Columna",
      categoria: cargo.CargoType ?? "Sin categoría",
      cantidad: cargo.Quantity,
      capacidad: capacity,
      utilizacion: `${utilization}% - ${utilizationLevel}`,
      fecha: cargo.EntryDate.toLocaleDateString("es-HN"),
      responsable: cargo.Users?.Name ?? cargo.Users?.User ?? "Sin usuario",
    };
  });

  return {
    total: result.length,
    data: result,
  };
};


export const cargoReturnReentryReport = async () => {
  const cambios = await db.cargoStatusHistory.findMany({
    where: {
      NewStatus: {
        in: ["revision", "almacenado", "rechazado"], // nuevos estados relevantes
      },
      PreviousStatus: {
        not: null,
      },
    },
    include: {
      Cargo: {
        select: {
          TrackingCode: true,
          Description: true,
          DamageDescription: true,
        },
      },
      Users: {
        select: {
          Name: true,
          User: true,
        },
      },
    },
    orderBy: {
      ChangedAt: "desc",
    },
  });

  const data = cambios.map((record) => {
    const { PreviousStatus, NewStatus } = record;

    let tipoCambio = "correccion";
    if (PreviousStatus === "entregado" && NewStatus === "almacenado") {
      tipoCambio = "reingreso";
    } else if (PreviousStatus === "liberado" && NewStatus === "revision") {
      tipoCambio = "devolucion";
    } else if (NewStatus === "rechazado") {
      tipoCambio = "rechazo";
    }

    return {
      codigo: record.Cargo?.TrackingCode ?? "Sin Código",
      descripcion: record.Cargo?.Description ?? "-",
      estadoAnterior: PreviousStatus,
      nuevoEstado: NewStatus,
      tipoCambio,
      fechaCambio: record.ChangedAt.toLocaleDateString("es-HN"),
      realizadoPor: record.Users?.Name ?? record.Users?.User ?? "Desconocido",
      motivo: record.Cargo?.DamageDescription ?? "Sin motivo registrado",
    };
  });

  const total = data.length;
  const devoluciones = data.filter((r) => r.tipoCambio === "devolucion").length;
  const reingresos = data.filter((r) => r.tipoCambio === "reingreso").length;
  const rechazos = data.filter((r) => r.tipoCambio === "rechazo").length;

  return {
    resumen: {
      totalCasos: total,
      devoluciones,
      reingresos,
      rechazos,
    },
    data,
  };
};

export const averageCargoStayReport = async () => {
  const cargos = await db.cargo.findMany({
    select: {
      Id: true,
      TrackingCode: true,
      Description: true,
      Status: true,
      EntryDate: true,
      ExitDate: true,
      CargoType: true,
      Warehouse: { select: { Id: true, Name: true } },
    },
    orderBy: { EntryDate: "asc" },
  });

  const now = new Date();
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const daysBetween = (start: Date, end: Date) =>
    Math.max(0, Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY));

  // Detalle por carga
  const details = cargos.map((c) => {
    const end = c.ExitDate ?? now;
    const days = daysBetween(new Date(c.EntryDate), new Date(end));
    return {
      id: c.Id,
      trackingCode: c.TrackingCode ?? null,
      description: c.Description ?? null,
      status: c.Status,
      entryDate: c.EntryDate,
      exitDate: c.ExitDate, // null si sigue en almacén
      warehouse: {
        id: c.Warehouse?.Id ?? null,
        name: c.Warehouse?.Name ?? null,
      },
      category: c.CargoType ?? null,
      daysInWarehouse: days,
      isClosed: !!c.ExitDate,
    };
  });

  // Helpers de agregación
  const avg = (arr: number[]) =>
    arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0;

  const closedDays = details.filter(d => d.isClosed).map(d => d.daysInWarehouse);
  const openDays   = details.filter(d => !d.isClosed).map(d => d.daysInWarehouse);
  const allDays    = details.map(d => d.daysInWarehouse);

  // Agrupación por almacén
  const byWarehouseMap = new Map<string, {
    warehouseId: string | null;
    warehouse: string | null;
    count: number;
    closedCount: number;
    openCount: number;
    avgDays: number; // se recalcula luego
    _days: number[];
  }>();

  for (const d of details) {
    const key = d.warehouse.id ?? "null";
    if (!byWarehouseMap.has(key)) {
      byWarehouseMap.set(key, {
        warehouseId: d.warehouse.id,
        warehouse: d.warehouse.name,
        count: 0,
        closedCount: 0,
        openCount: 0,
        avgDays: 0,
        _days: [],
      });
    }
    const g = byWarehouseMap.get(key)!;
    g.count += 1;
    g._days.push(d.daysInWarehouse);
    d.isClosed ? (g.closedCount += 1) : (g.openCount += 1);
  }

  const byWarehouse = Array.from(byWarehouseMap.values()).map(g => ({
    warehouseId: g.warehouseId,
    warehouse: g.warehouse,
    count: g.count,
    openCount: g.openCount,
    closedCount: g.closedCount,
    avgDays: avg(g._days),
  }));

  // Agrupación por categoría (CargoType)
  const byCategoryMap = new Map<string, {
    category: string | null;
    count: number;
    avgDays: number;
    _days: number[];
  }>();

  for (const d of details) {
    const key = d.category ?? "Sin categoría";
    if (!byCategoryMap.has(key)) {
      byCategoryMap.set(key, { category: d.category ?? "Sin categoría", count: 0, avgDays: 0, _days: [] });
    }
    const g = byCategoryMap.get(key)!;
    g.count += 1;
    g._days.push(d.daysInWarehouse);
  }

  const byCategory = Array.from(byCategoryMap.values()).map(g => ({
    category: g.category,
    count: g.count,
    avgDays: avg(g._days),
  }));

  // Resumen general
  const summary = {
    totalCargos: details.length,
    closedCount: closedDays.length,
    openCount: openDays.length,
    averageDaysOverall:    avg(allDays),
    averageDaysClosedOnly: avg(closedDays),
    averageDaysOpenOnly:   avg(openDays),
  };

  return {
    summary,
    byWarehouse,
    byCategory,
    data: details, // detalle por carga
  };
};

type ReportType = "Entradas" | "Salidas" | "Devoluciones" | "Dañadas";

export type DailyCargoByTypeParams = {
  from?: string;   // YYYY-MM-DD (opcional)
  to?: string;     // YYYY-MM-DD (opcional)
  warehouseId?: string;
};

// --- helpers de fecha y formato ---
const dayKey     = (d: Date) => d.toISOString().slice(0, 10);
const toNumber   = (n: number | null | undefined) => (typeof n === "number" ? n : 0);

// --- reglas mapeadas a tu enum CargoStatus ---
const isReturnTransition = (prev?: string | null, next?: string | null) => {
  const p = (prev ?? "").toLowerCase();
  const n = (next ?? "").toLowerCase();

  // Devuelta explícita
  if (n === CargoStatus.DEVOLUCION) return true;

  // Regresada a almacén para revisión / devolución
  if (p === CargoStatus.LIBERADO && n === CargoStatus.EN_REVISION) return true;
  if (p === CargoStatus.ENTREGADA && (n === CargoStatus.REINGRESO || n === CargoStatus.ALMACENADO)) return true;

  return false;
};

const isDamagedTransition = (next?: string | null, damageReported?: boolean | null) => {
  const n = (next ?? "").toLowerCase();
  return (
    damageReported === true ||
    n === CargoStatus.DANIADO ||
    n === CargoStatus.NO_CONFORME ||
    n === CargoStatus.RECHAZADO ||
    n === CargoStatus.EN_REVISION
  );
};

// ---- obtiene min/max de fechas si el usuario no manda filtros ----
async function getAutoRange() {
  const [aggCargo, aggChanges] = await Promise.all([
    db.cargo.aggregate({
      _min: { EntryDate: true, ExitDate: true },
      _max: { EntryDate: true, ExitDate: true },
    }),
    db.cargoStatusHistory.aggregate({
      _min: { ChangedAt: true },
      _max: { ChangedAt: true },
    }),
  ]);

  const mins = [aggCargo._min.EntryDate, aggCargo._min.ExitDate, aggChanges._min.ChangedAt].filter(Boolean) as Date[];
  const maxs = [aggCargo._max.EntryDate, aggCargo._max.ExitDate, aggChanges._max.ChangedAt].filter(Boolean) as Date[];

  if (mins.length === 0 || maxs.length === 0) {
    const today = new Date();
    return { from: startOfDay(today), to: endOfDay(today), hasData: false };
  }

  const minDate = mins.reduce((a, b) => (a < b ? a : b));
  const maxDate = maxs.reduce((a, b) => (a > b ? a : b));
  return { from: startOfDay(minDate), to: endOfDay(maxDate), hasData: true };
}

// ----------------------------------------------------------------------------------
// Reporte diario – Carga por tipo (Entradas, Salidas, Devoluciones, Dañadas)
// Fechas opcionales: si faltan, se usa el rango existente en la BD.
// ----------------------------------------------------------------------------------
export const dailyCargoByTypeReport = async (params: DailyCargoByTypeParams) => {
  // 1) Resolver rango
  let from: Date;
  let to: Date;

  if (params.from && params.to) {
    from = startOfDay(new Date(params.from));
    to = endOfDay(new Date(params.to));
  } else {
    const auto = await getAutoRange();
    from = auto.from;
    to = auto.to;
  }

  const warehouseFilter = params.warehouseId ? { WarehouseId: params.warehouseId } : {};

  // 2) ENTRADAS (EntryDate en rango)
  const entries = await db.cargo.findMany({
    where: { EntryDate: { gte: from, lte: to }, ...warehouseFilter },
    select: {
      Id: true, TrackingCode: true, Description: true,
      CargoType: true, WeightKg: true, Quantity: true, EntryDate: true,
      Warehouse: { select: { Name: true } },
    },
    orderBy: { EntryDate: "asc" },
  });

  // 3) SALIDAS (ExitDate en rango)
  const exits = await db.cargo.findMany({
    where: { ExitDate: { gte: from, lte: to }, ...warehouseFilter },
    select: {
      Id: true, TrackingCode: true, Description: true,
      CargoType: true, WeightKg: true, Quantity: true, ExitDate: true,
      Warehouse: { select: { Name: true } },
    },
    orderBy: { ExitDate: "asc" },
  });

  // 4) CAMBIOS DE ESTADO (para Devoluciones / Dañadas)
  const changes = await db.cargoStatusHistory.findMany({
    where: { ChangedAt: { gte: from, lte: to } },
    include: {
      Cargo: {
        select: {
          Id: true, TrackingCode: true, Description: true,
          CargoType: true, WeightKg: true, Quantity: true,
          DamageReported: true,
          Warehouse: { select: { Name: true, Id: true } },
        },
      },
    },
    orderBy: { ChangedAt: "asc" },
  });

  // Si filtran por warehouse, aplicar sobre cambios (no está en la tabla, pero sí en Cargo)
  const filteredChanges = params.warehouseId
    ? changes.filter((c) => c.Cargo?.Warehouse?.Id === params.warehouseId)
    : changes;

  // Helper para item de detalle
  const makeItem = (row: {
    id: string;
    code?: string | null;
    desc?: string | null;
    category?: string | null;
    weight?: number | null;
    qty?: number | null;
    warehouse?: string | null;
    date: Date;
    type: ReportType;
  }) => ({
    code: row.code ?? `CGX-${row.id.slice(0, 6)}`,
    description: row.desc ?? "-",
    category: row.category ?? "Sin categoría",
    weightKg: toNumber(row.weight),
    quantity: toNumber(row.qty),
    warehouse: row.warehouse ?? "Sin almacén",
    time: row.date.toTimeString().slice(0, 5), // HH:mm
    type: row.type,
  });

  // Estructura de agrupación
  type GroupBucket = {
    type: ReportType;
    count: number;
    totalWeightKg: number;
    totalUnits: number;
    items: ReturnType<typeof makeItem>[];
  };

  const grouped = new Map<string, Map<ReportType, GroupBucket>>();
  const upsertBucket = (key: string, type: ReportType) => {
    if (!grouped.has(key)) grouped.set(key, new Map());
    const byType = grouped.get(key)!;
    if (!byType.has(type)) {
      byType.set(type, { type, count: 0, totalWeightKg: 0, totalUnits: 0, items: [] });
    }
    return byType.get(type)!;
  };

  // Agregar Entradas
  for (const e of entries) {
    const dk = dayKey(e.EntryDate);
    const b = upsertBucket(dk, "Entradas");
    b.count += 1;
    b.totalWeightKg += toNumber(e.WeightKg);
    b.totalUnits += toNumber(e.Quantity);
    b.items.push(
      makeItem({
        id: e.Id,
        code: e.TrackingCode,
        desc: e.Description,
        category: e.CargoType,
        weight: e.WeightKg,
        qty: e.Quantity,
        warehouse: e.Warehouse?.Name,
        date: e.EntryDate,
        type: "Entradas",
      })
    );
  }

  // Agregar Salidas
  for (const s of exits) {
    const dk = dayKey(s.ExitDate!);
    const b = upsertBucket(dk, "Salidas");
    b.count += 1;
    b.totalWeightKg += toNumber(s.WeightKg);
    b.totalUnits += toNumber(s.Quantity);
    b.items.push(
      makeItem({
        id: s.Id,
        code: s.TrackingCode,
        desc: s.Description,
        category: s.CargoType,
        weight: s.WeightKg,
        qty: s.Quantity,
        warehouse: s.Warehouse?.Name,
        date: s.ExitDate!,
        type: "Salidas",
      })
    );
  }

  // Agregar Devoluciones y Dañadas
  let devolucionesCount = 0;
  let danadasCount = 0;

  for (const c of filteredChanges) {
    const prev = c.PreviousStatus ?? undefined;
    const next = c.NewStatus ?? undefined;

    let detected: ReportType | null = null;
    if (isReturnTransition(prev, next)) {
      detected = "Devoluciones";
      devolucionesCount += 1;
    } else if (isDamagedTransition(next, c.Cargo?.DamageReported)) {
      detected = "Dañadas";
      danadasCount += 1;
    }

    if (!detected) continue;

    const dk = dayKey(c.ChangedAt);
    const b = upsertBucket(dk, detected);
    const wt = c.Cargo?.WeightKg ?? 0;
    const qt = c.Cargo?.Quantity ?? 0;

    b.count += 1;
    b.totalWeightKg += toNumber(wt);
    b.totalUnits += toNumber(qt);
    b.items.push(
      makeItem({
        id: c.Cargo?.Id ?? c.Id,
        code: c.Cargo?.TrackingCode,
        desc: c.Cargo?.Description,
        category: c.Cargo?.CargoType,
        weight: wt,
        qty: qt,
        warehouse: c.Cargo?.Warehouse?.Name,
        date: c.ChangedAt,
        type: detected,
      })
    );
  }

  // KPIs globales
  const recibidas = entries.length;
  const despachadas = exits.length;
  const pesoTotal = [...grouped.values()]
    .flatMap((m) => Array.from(m.values()))
    .reduce((sum, g) => sum + g.totalWeightKg, 0);
  const unidadesTotales = [...grouped.values()]
    .flatMap((m) => Array.from(m.values()))
    .reduce((sum, g) => sum + g.totalUnits, 0);

  // Ordenar salida por día
  const groupedOut = Array.from(grouped.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, buckets]) => ({
      date, // YYYY-MM-DD
      types: Array.from(buckets.values()).sort((a, b) => a.type.localeCompare(b.type)),
    }));

  return {
    meta: {
      range: { from: dayKey(from), to: dayKey(to) },
      registros: groupedOut.reduce(
        (n, d) => n + d.types.reduce((m, t) => m + t.count, 0),
        0
      ),
    },
    summary: {
      recibidas,
      despachadas,
      pesoTotalKg: Number(pesoTotal.toFixed(1)),
      unidadesTotales,
      danadas: danadasCount,
      devueltas: devolucionesCount,
    },
    grouped: groupedOut,
  };
};
