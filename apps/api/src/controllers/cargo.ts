import { registerCargo } from "../model/cargo";
import { registerCargoSchema } from "./schema";
import { Request, Response } from "express";

export const createCargo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parse = registerCargoSchema.safeParse(req.body);

    if (!parse.success) {
      console.warn("[ZOD] Payload inválido:", parse.error.flatten());
      res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: parse.error.flatten().fieldErrors,
      });
      return;
    }

    const input = parse.data;

    if (input.exitDate && input.exitDate < input.entryDate) {
      res.status(400).json({
        success: false,
        message: "Exit date must be after entry date",
      });
      return;
    }

    const result = await registerCargo(input as any); // usamos `as any` porque sabemos que Zod lo validó correctamente
    res.status(201).json({ success: true, cargoId: result.cargoId });
    return;
  } catch (error) {
    console.error("[ERROR] Error creando cargo:", error);
    res.status(500).json({ success: false, message: "Error creating cargo" });
    return;
  }
};
