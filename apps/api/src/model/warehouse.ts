import { db } from "./db";
import { AssignLocation } from "../types/cargo";

export const allWarehouses = async () => {
  try {
    const warehouses = await db.warehouse.findMany({
      select: {
        Id: true,
        Name: true,
      },
      where: {
        IsActive: true,
      },
    });

    if (!warehouses || warehouses.length === 0) {
      throw new Error("No active warehouses found");
    }

    return warehouses;
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
