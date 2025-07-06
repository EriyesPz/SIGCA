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

  try {
    await db.$transaction(async (tx) => {
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

    return { cargoId };
  } catch (error) {
    console.error("Error al registrar carga:", error);
    throw new Error("Error al registrar carga");
  }
};
