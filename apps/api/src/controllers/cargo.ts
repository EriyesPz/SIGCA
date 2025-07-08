import { registerCargo, RegisterCargoInput } from "../model/cargo";
import { Request, Response } from "express";

export const createCargo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const input: RegisterCargoInput = req.body;
    console.log("[DEBUG] Payload recibido en controller:", input);

    if (
      !input.trackingCode?.trim() ||
      !input.description?.trim() ||
      !input.status?.trim() ||
      !input.warehouseId?.trim() ||
      !input.rackId?.trim() ||
      !input.levelId?.trim() ||
      !input.columnId?.trim()
    ) {
      console.warn("[DEBUG] Campos requeridos faltantes");
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    if (input.weightKg <= 0 || input.quantity <= 0) {
      console.warn("[DEBUG] Peso o cantidad inválidos:", {
        weightKg: input.weightKg,
        quantity: input.quantity,
      });
      res.status(400).json({
        success: false,
        message: "Weight and quantity must be greater than zero",
      });
      return;
    }

    if (input.entryDate && isNaN(new Date(input.entryDate).getTime())) {
      console.warn("[DEBUG] Fecha de entrada inválida:", input.entryDate);
      res.status(400).json({ success: false, message: "Invalid entry date" });
      return;
    }

    if (
      input.exitDate &&
      new Date(input.exitDate) < new Date(input.entryDate)
    ) {
      console.warn("[DEBUG] Fecha de salida antes de entrada:", {
        entry: input.entryDate,
        exit: input.exitDate,
      });
      res.status(400).json({
        success: false,
        message: "Exit date must be after entry date",
      });
      return;
    }

    const result = await registerCargo(input);
    console.log("[DEBUG] Cargo creado con ID:", result.cargoId);
    res.status(201).json({ cargoId: result.cargoId });
    return;
  } catch (error) {
    console.error("[ERROR] Error creando cargo:", error);
    res.status(500).json({ message: "Error creating cargo" });
    return;
  }
};
