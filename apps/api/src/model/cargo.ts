import { db } from "./db";
import { v4 as uuidv4 } from "uuid";

export interface RegisterCargoInput {
  trackingCode: string;
  description: string;
  status: string;
  weightKg: number;
  quantity: number;
  entryDate: Date;
  isPerishable: boolean;
  warehouseId: string;
  rackId: string;
  levelId: string;
  columnId: string;
  createdBy: string;
  exitDate?: Date | null;
}

export const registerCargo = async (
  input: RegisterCargoInput
): Promise<{ cargoId: string }> => {
  const cargoId = uuidv4();
  console.log("[DEBUG] Iniciando transacción para crear cargo");

  try {
    await db.$transaction(async (tx) => {
      console.log("[DEBUG] Insertando en tabla Cargo");
      await tx.cargo.create({
        data: {
          Id: cargoId,
          TrackingCode: input.trackingCode,
          Description: input.description,
          Status: input.status,
          WeightKg: input.weightKg,
          Quantity: input.quantity,
          EntryDate: input.entryDate,
          IsPerishable: input.isPerishable,
          WarehouseId: input.warehouseId,
          RackId: input.rackId,
          LevelId: input.levelId,
          ColumnId: input.columnId,
          CreatedBy: input.createdBy,
          ExitDate: input.exitDate ?? null,
        },
      });

      console.log("[DEBUG] Insertando historial de ubicación");
      await tx.cargoLocationHistory.create({
        data: {
          Id: uuidv4(),
          CargoId: cargoId,
          FromRackId: null,
          FromLevelId: null,
          FromColumnId: null,
          ToRackId: input.rackId,
          ToLevelId: input.levelId,
          ToColumnId: input.columnId,
          MovedAt: new Date(),
          MovedBy: input.createdBy,
        },
      });

      console.log("[DEBUG] Insertando historial de estado");
      await tx.cargoStatusHistory.create({
        data: {
          Id: uuidv4(),
          CargoId: cargoId,
          PreviousStatus: null,
          NewStatus: input.status,
          ChangedAt: new Date(),
          ChangedBy: input.createdBy,
        },
      });
    });

    console.log("[DEBUG] Transacción completada correctamente");
    return { cargoId };
  } catch (error) {
    console.error("Error al registrar carga:", error);
    throw new Error("Error al registrar carga");
  }
};
