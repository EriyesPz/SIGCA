import { db } from "./db";

export const cargoEntry = async () => {
  const cargos = await db.cargo.findMany({
    where: {
      EntryDate: {
        not: undefined,
      },
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
        select: {
          Id: true,
        },
      },
    },
    orderBy: {
      EntryDate: "desc",
    },
  });

  let totalWeightKg = 0;
  let totalWithLocation = 0;
  let totalWithDocuments = 0;

  const data = cargos.map((cargo) => {
    const rackLevel = cargo.RackColumn?.RackLevels;
    const rack = rackLevel?.Racks;

    const hasLocation =
      cargo.RackColumn?.ColumnCode && rackLevel?.LevelNumber && rack?.Name;

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
    data,
    total: data.length,
    totalWeightKg,
    totalWithLocation,
    totalWithDocuments,
  };
};

export const cargoExitReport = async () => {
  const cargos = await db.cargo.findMany({
    where: {
      ExitDate: {
        not: null,
      },
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
      deliveredAt: delivery?.DeliveredAt ?? null,
      deliveredBy: delivery?.Users?.Name ?? null,
      receiver: delivery?.Receiver ?? null,
      hasDocuments,
      isPerishable: cargo.IsPerishable,
      isHazardousMaterial: cargo.IsHazardousMaterial,
      isHighValue: cargo.IsHighValue,
    };
  });

  return {
    data,
    total: data.length,
    totalWeightKg,
    totalWithDocuments,
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

  transfers.forEach(transfer => {
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
    select: { Id: true, Name: true }
  });

  const levels = await db.rackLevels.findMany({
    where: { Id: { in: Array.from(levelIds) } },
    select: { Id: true, LevelNumber: true }
  });

  const columns = await db.rackColumns.findMany({
    where: { Id: { in: Array.from(columnIds) } },
    select: { Id: true, ColumnCode: true }
  });

  // Crear mapas para acceso rápido
  const rackMap = new Map(racks.map(rack => [rack.Id, rack]));
  const levelMap = new Map(levels.map(level => [level.Id, level]));
  const columnMap = new Map(columns.map(column => [column.Id, column]));

  const data = transfers.map((transfer) => {
    const cargo = transfer.Cargo;
    if (cargo?.WeightKg) totalWeightKg += cargo.WeightKg;

    // Obtener detalles del rack, nivel y columna de origen
    const fromRack = transfer.FromRackId ? rackMap.get(transfer.FromRackId) : null;
    const fromLevel = transfer.FromLevelId ? levelMap.get(transfer.FromLevelId) : null;
    const fromColumn = transfer.FromColumnId ? columnMap.get(transfer.FromColumnId) : null;

    // Obtener detalles del rack, nivel y columna de destino
    const toRack = transfer.ToRackId ? rackMap.get(transfer.ToRackId) : null;
    const toLevel = transfer.ToLevelId ? levelMap.get(transfer.ToLevelId) : null;
    const toColumn = transfer.ToColumnId ? columnMap.get(transfer.ToColumnId) : null;

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
        warehouse: transfer.Warehouse_Transfers_FromWarehouseIdToWarehouse?.Name ?? null,
        rackId: transfer.FromRackId ?? null,
        rackName: fromRack?.Name ?? null,
        levelId: transfer.FromLevelId ?? null,
        levelNumber: fromLevel?.LevelNumber ?? null,
        columnId: transfer.FromColumnId ?? null,
        columnCode: fromColumn?.ColumnCode ?? null,
      },

      toLocation: {
        warehouse: transfer.Warehouse_Transfers_ToWarehouseIdToWarehouse?.Name ?? null,
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