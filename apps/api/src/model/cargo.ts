import { db } from "./db";
import {
  RegisterCargo,
  CargoIdentifier,
  TransferCargo,
  CargoStatus,
  DeliverCargo,
} from "../types/cargo";

export const registerCargo = async (
  input: RegisterCargo
): Promise<{ cargoId: string; trackingCode: string }> => {
  try {
    const createdCargo = await db.$transaction(async (tx) => {
      const cargo = await tx.cargo.create({
        data: {
          QRCode: input.qrcode ?? null,
          Description: input.description ?? null,
          Status: input.status,
          WeightKg: input.weightKg,
          VolumeM3: input.volumenm3 ?? null,
          DimensionsCm: input.dimensions
            ? JSON.parse(JSON.stringify(input.dimensions))
            : null,
          Quantity: input.quantity,
          EntryDate: input.entryDate,
          ExitDate: input.exitDate ?? null,
          IsPerishable: input.isPerishable,
          IsHazardousMaterial: input.isHazardous ?? false,
          IsHighValue: input.isHighValue ?? false,
          DeclaredValueUSD: input.declaredValue ?? null,
          TemperatureRequirement: input.temperatureRequirement ?? null,
          HandlingInstructions: input.handlingInstructions ?? null,

          AirWaybillNumber: input.airWaybillNumber ?? null,
          HouseAirWaybillNumber: input.houseAirWaybillNumber ?? null,
          MasterAirWaybillNumber: input.masterAirWaybillNumber ?? null,
          ManifestNumber: input.manifestNumber ?? null,
          FlightNumber: input.flightNumber ?? null,
          FlightDate: input.flightDate ?? null,
          OriginAirport: input.originAirport ?? null,
          DestinationAirport: input.destinationAirport ?? null,
          CustomsStatus: input.customsStatus ?? null,
          CustomsDeclarationNumber: input.customsDeclarationNumber ?? null,
          InsurancePolicyNumber: input.insurancePolicyNumber ?? null,
          ArrivalDate: input.arrivalDate ?? null,
          DepartureDate: input.departureDate ?? null,
          SealNumber: input.sealNumber ?? null,
          InternalReference: input.internalReference ?? null,
          LastInspectionDate: input.lastInspectionDate ?? null,
          DamageReported: input.damageReported ?? false,
          DamageDescription: input.damageDescription ?? null,
          CargoType: input.cargoType ?? null,
          ContainerNumber: input.containerNumber ?? null,
          ULDNumber: input.uldNumber ?? null,
          Shipper: input.shipper
            ? JSON.parse(JSON.stringify(input.shipper))
            : null,
          Consignee: input.consignee
            ? JSON.parse(JSON.stringify(input.consignee))
            : null,

          // 👇 Aquí corregido
          WarehouseId: input.warehouseId ?? undefined,

          RackId: input.rackId ?? undefined,
          LevelId: input.levelId ?? undefined,
          ColumnId: input.columnId ?? undefined,

          CreatedBy: input.createdBy,
        },
      });

      const cargoId = cargo.Id;

      // Historial de estado
      await tx.cargoStatusHistory.create({
        data: {
          CargoId: cargoId,
          PreviousStatus: null,
          NewStatus: input.status,
          ChangedAt: new Date(),
          ChangedBy: input.createdBy,
        },
      });

      // Historial de ubicación
      await tx.cargoLocationHistory.create({
        data: {
          CargoId: cargoId,
          FromRackId: null,
          FromLevelId: null,
          FromColumnId: null,
          ToRackId: input.rackId ?? null,
          ToLevelId: input.levelId ?? null,
          ToColumnId: input.columnId ?? undefined,
          MovedAt: new Date(),
          MovedBy: input.createdBy,
        },
      });

      // Documentos asociados
      for (const doc of input.documents) {
        if (!doc.fileUrl || !doc.type) continue;
        await tx.cargoDocuments.create({
          data: {
            CargoId: cargoId,
            FileUrl: doc.fileUrl,
            Type: doc.type,
            Metadata: doc.metadata !== undefined ? doc.metadata : undefined,
            CreatedAt: new Date(),
            CreatedBy: input.createdBy,
          },
        });
      }

      return cargo;
    });

    return {
      cargoId: createdCargo.Id,
      trackingCode: createdCargo.TrackingCode ?? "",
    };
  } catch (error) {
    console.error("[ERROR] Error al registrar carga completa:", error);
    throw new Error("No se pudo registrar la carga.");
  }
};

export const getCargoByIdentifier = async (identifier: CargoIdentifier) => {
  try {
    const conditions = [];

    if (identifier.id) {
      conditions.push({ Id: identifier.id });
    }
    if (identifier.trackingCode) {
      conditions.push({ TrackingCode: identifier.trackingCode });
    }
    if (identifier.qrcode) {
      conditions.push({ QRCode: identifier.qrcode });
    }
    if (identifier.airWaybillNumber) {
      conditions.push({ AirWaybillNumber: identifier.airWaybillNumber });
    }
    if (identifier.houseAirWaybillNumber) {
      conditions.push({
        HouseAirWaybillNumber: identifier.houseAirWaybillNumber,
      });
    }

    const cargo = await db.cargo.findFirst({
      where: {
        OR: conditions,
      },
      include: {
        Warehouse: {
          select: {
            Name: true,
          },
        },
        RackColumn: {
          select: {
            ColumnCode: true,
            RackLevels: {
              select: {
                LevelNumber: true,
                Racks: {
                  select: {
                    Name: true,
                  },
                },
              },
            },
          },
        },
        CargoDocuments: {
          select: {
            FileUrl: true,
            Type: true,
            Metadata: true,
            CreatedAt: true,
          },
        },
        CargoLocationHistory: {
          orderBy: { MovedAt: "asc" },
          take: 1,
          select: {
            MovedAt: true,
          },
        },
        CargoStatusHistory: {
          orderBy: { ChangedAt: "desc" },
          take: 1,
          select: {
            NewStatus: true,
            ChangedAt: true,
          },
        },
      },
    });

    if (!cargo) return null;

    return {
      id: cargo.Id,
      trackingCode: cargo.TrackingCode,
      qrcode: cargo.QRCode,
      status: cargo.Status,
      description: cargo.Description,
      quantity: cargo.Quantity,
      weightKg: cargo.WeightKg,
      volumeM3: cargo.VolumeM3,
      dimensions: cargo.DimensionsCm,
      entryDate: cargo.EntryDate,
      exitDate: cargo.ExitDate,
      airWaybillNumber: cargo.AirWaybillNumber,
      houseAirWaybillNumber: cargo.HouseAirWaybillNumber,
      createdBy: cargo.CreatedBy,
      warehouseId: cargo.WarehouseId,
      warehouse: cargo.Warehouse?.Name ?? null,
      rackId: cargo.RackId ?? null,
      rack: cargo.RackColumn?.RackLevels?.Racks?.Name ?? null,
      levelId: cargo.LevelId ?? null,
      level: cargo.RackColumn?.RackLevels?.LevelNumber ?? null,
      columnId: cargo.ColumnId ?? null,
      column: cargo.RackColumn?.ColumnCode ?? null,
      locationDate: cargo.CargoLocationHistory[0]?.MovedAt ?? null,
      latestStatus: cargo.CargoStatusHistory[0]?.NewStatus ?? cargo.Status,
      documents: cargo.CargoDocuments,
      shipper: cargo.Shipper,
      consignee: cargo.Consignee,
    };
  } catch (error) {
    console.error("[ERROR] Error buscando carga:", error);
    throw new Error("No se pudo obtener la información de la carga.");
  }
};

export const transferCargo = async (transfer: TransferCargo): Promise<void> => {
  try {
    const orConditions: {
      Id?: string;
      AirWaybillNumber?: string;
      TrackingCode?: string;
      HouseAirWaybillNumber?: string;
      QRCode?: string;
    }[] = [];

    if (transfer.id) orConditions.push({ Id: transfer.id });
    if (transfer.airWaybillNumber)
      orConditions.push({ AirWaybillNumber: transfer.airWaybillNumber });
    if (transfer.trackingCode)
      orConditions.push({ TrackingCode: transfer.trackingCode });
    if (transfer.houseAirWaybillNumber)
      orConditions.push({
        HouseAirWaybillNumber: transfer.houseAirWaybillNumber,
      });
    if (transfer.qrcode) orConditions.push({ QRCode: transfer.qrcode });

    if (orConditions.length === 0) {
      throw new Error("Debe proporcionar al menos un identificador de carga");
    }

    await db.$transaction(async (tx) => {
      // 1. Buscar carga
      const cargo = await tx.cargo.findFirst({
        where: { OR: orConditions },
        select: { Id: true, WarehouseId: true },
      });

      if (!cargo) {
        throw new Error(
          "Carga no encontrada con los identificadores proporcionados"
        );
      }

      const cargoId = cargo.Id;

      if (
        transfer.fromWarehouseId &&
        transfer.toWarehouseId &&
        (transfer.fromWarehouseId !== transfer.toWarehouseId ||
          transfer.fromRackId !== transfer.toRackId ||
          transfer.fromLevelId !== transfer.toLevelId ||
          transfer.fromColumnId !== transfer.toColumnId)
      ) {
        await tx.transfers.create({
          data: {
            CargoId: cargoId,
            FromWarehouseId: transfer.fromWarehouseId,
            ToWarehouseId: transfer.toWarehouseId,
            FromRackId: transfer.fromRackId,
            ToRackId: transfer.toRackId,
            FromLevelId: transfer.fromLevelId,
            ToLevelId: transfer.toLevelId,
            FromColumnId: transfer.fromColumnId,
            ToColumnId: transfer.toColumnId,
            Notes: transfer.transferReason ?? undefined,
            TransferredBy: transfer.movedBy,
          },
        });
      }

      await tx.cargoLocationHistory.create({
        data: {
          CargoId: cargoId,
          FromRackId: transfer.fromRackId ?? null,
          FromLevelId: transfer.fromLevelId ?? null,
          FromColumnId: transfer.fromColumnId ?? null,
          ToRackId: transfer.toRackId ?? null,
          ToLevelId: transfer.toLevelId ?? null,
          ToColumnId: transfer.toColumnId ?? null,
          MovedBy: transfer.movedBy,
        },
      });

      await tx.cargo.update({
        where: { Id: cargoId },
        data: {
          WarehouseId: transfer.toWarehouseId,
          RackId: transfer.toRackId,
          LevelId: transfer.toLevelId,
          ColumnId: transfer.toColumnId,
          Status: CargoStatus.TRASNFERENCIA,
        },
      });

      await tx.cargoStatusHistory.create({
        data: {
          CargoId: cargoId,
          PreviousStatus: null,
          NewStatus: CargoStatus.TRASNFERENCIA,
          ChangedBy: transfer.movedBy,
        },
      });
    });
  } catch (error) {
    console.error("[ERROR] Error al transferir carga:", error);
    throw new Error("No se pudo transferir la carga.");
  }
};

export const deliverCargo = async (input: DeliverCargo): Promise<void> => {
  try {
    const conditions: { [key: string]: string }[] = [];

    if (input.id) conditions.push({ Id: input.id });
    if (input.trackingCode)
      conditions.push({ TrackingCode: input.trackingCode });
    if (input.airWaybillNumber)
      conditions.push({ AirWaybillNumber: input.airWaybillNumber });
    if (input.houseAirWaybillNumber)
      conditions.push({ HouseAirWaybillNumber: input.houseAirWaybillNumber });
    if (input.qrcode) conditions.push({ QRCode: input.qrcode });

    if (conditions.length === 0) {
      throw new Error("Debe proporcionar al menos un identificador de carga");
    }

    await db.$transaction(async (tx) => {
      const cargo = await tx.cargo.findFirst({
        where: { OR: conditions },
        include: {
          Alerts: { where: { Resolved: false } },
        },
      });

      if (!cargo) {
        throw new Error("Carga no encontrada.");
      }

      if (cargo.Alerts.length > 0) {
        throw new Error(
          "La carga tiene alertas pendientes. No se puede entregar."
        );
      }

      const deliveryDate = input.deliveredAt ?? new Date();

      await tx.deliveries.create({
        data: {
          CargoId: cargo.Id,
          Receiver: input.receiver,
          VerifiedBy: input.verifiedBy,
          DeliveredBy: input.deliveredBy,
          DeliveredAt: deliveryDate,
          Metadata: input.metadata ?? undefined,
        },
      });

      await tx.cargo.update({
        where: { Id: cargo.Id },
        data: {
          Status: CargoStatus.ENTREGADA,
          ExitDate: deliveryDate,
          WarehouseId: null,
          RackId: null,
          LevelId: null,
          ColumnId: null,
        },
      });

      await tx.cargoStatusHistory.create({
        data: {
          CargoId: cargo.Id,
          PreviousStatus: cargo.Status,
          NewStatus: CargoStatus.ENTREGADA,
          ChangedBy: input.deliveredBy,
        },
      });
    });
  } catch (error) {
    console.error("[ERROR] Error al entregar la carga:", error);
    throw new Error("No se pudo completar la entrega de la carga.");
  }
};
