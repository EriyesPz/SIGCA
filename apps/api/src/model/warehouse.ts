import { db } from "./db";
import { AssignLocation, CargoStatus } from "../types/cargo";

export const allWarehouses = async () => {
  try {
    const warehouses = await db.warehouse.findMany({
      select: {
        Id: true,
        Name: true,
        Code: true,
        _count: {
          select: { Racks: true }, // cuenta racks
        },
        Racks: {
          select: {
            _count: {
              select: { RackLevels: true }, // cuenta niveles por rack
            },
            RackLevels: {
              select: {
                _count: {
                  select: { RackColumns: true }, // cuenta columnas por nivel
                },
              },
            },
          },
        },
      },
      where: {
        IsActive: true,
      },
    });

    if (!warehouses || warehouses.length === 0) {
      throw new Error("No active warehouses found");
    }

    return warehouses.map(w => {
      const levelsCount = w.Racks.reduce((acc, rack) => acc + rack._count.RackLevels, 0);
      const columnsCount = w.Racks.reduce(
        (acc, rack) =>
          acc + rack.RackLevels.reduce((acc2, level) => acc2 + level._count.RackColumns, 0),
        0
      );

      return {
        Id: w.Id,
        Name: w.Name,
        Code: w.Code,
        racksCount: w._count.Racks,
        levelsCount,
        columnsCount,
      };
    });
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    throw new Error("Failed to fetch warehouses");
  }
};


export const assignCargoLocation = async ({
  id,
  airWaybillNumber,
  trackingCode,
  houseAirWaybillNumber,
  qrcode,
  warehouseId,
  rackId,
  levelId,
  columnId,
  movedBy,
}: AssignLocation) => {
  try {
    const orConditions = [];

    if (id) orConditions.push({ Id: id });
    if (airWaybillNumber)
      orConditions.push({ AirWaybillNumber: airWaybillNumber });
    if (trackingCode) orConditions.push({ TrackingCode: trackingCode });
    if (houseAirWaybillNumber)
      orConditions.push({ HouseAirWaybillNumber: houseAirWaybillNumber });
    if (qrcode) orConditions.push({ QRCode: qrcode });

    if (orConditions.length === 0) {
      throw new Error("Debe proporcionar al menos un identificador de carga");
    }

    const existingCargo = await db.cargo.findFirst({
      where: {
        OR: orConditions,
      },
      select: {
        Id: true,
        RackId: true,
        LevelId: true,
        ColumnId: true,
      },
    });

    if (!existingCargo) {
      throw new Error("Carga no encontrada con los datos proporcionados");
    }

    await db.cargo.update({
      where: { Id: existingCargo.Id },
      data: {
        WarehouseId: warehouseId,
        RackId: rackId,
        LevelId: levelId,
        ColumnId: columnId,
        Status: CargoStatus.ALMACENADO,
      },
    });

    await db.cargoLocationHistory.create({
      data: {
        CargoId: existingCargo.Id,
        FromRackId: existingCargo.RackId,
        FromLevelId: existingCargo.LevelId,
        FromColumnId: existingCargo.ColumnId,
        ToRackId: rackId,
        ToLevelId: levelId,
        ToColumnId: columnId,
        MovedBy: movedBy,
      },
    });

    return { success: true, cargoId: existingCargo.Id };
  } catch (error) {
    console.error("[ERROR] Al asignar ubicación:", error);
    throw new Error("No se pudo actualizar la ubicación de la carga");
  }
};
