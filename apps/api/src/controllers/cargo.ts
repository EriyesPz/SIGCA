import { registerCargo, RegisterCargoInput } from "../model/cargo";
import { Request, Response } from "express";

export const createCargo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const input: RegisterCargoInput = req.body;
    if (
      !input.trackingCode ||
      !input.description ||
      !input.status ||
      !input.warehouseId ||
      !input.rackId ||
      !input.levelId ||
      !input.columnId
    ) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }
    if (input.weightKg <= 0 || input.quantity <= 0) {
      res.status(400).json({
        success: false,
        message: "Weight and quantity must be greater than zero",
      });
      return;
    }
    if (input.entryDate && isNaN(new Date(input.entryDate).getTime())) {
      res.status(400).json({ success: false, message: "Invalid entry date" });
      return;
    }
    if (
      input.exitDate &&
      new Date(input.exitDate) < new Date(input.entryDate)
    ) {
      res
        .status(400)
        .json({
          success: false,
          message: "Exit date must be after entry date",
        });
      return;
    }

    const result = await registerCargo(input);
    res.status(201).json({ cargoId: result.cargoId });
    return;
  } catch (error) {
    console.error("Error creating cargo:", error);
    res.status(500).json({ message: "Error creating cargo" });
    return;
  }
};
