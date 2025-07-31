import { db } from "./db";
import { RegisterCargo } from "../types/cargo";

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

    return { cargoId: createdCargo.Id, trackingCode: createdCargo.TrackingCode ?? "" };
  } catch (error) {
    console.error("[ERROR] Error al registrar carga completa:", error);
    throw new Error("No se pudo registrar la carga.");
  }
};
