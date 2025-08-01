import { registerCargo, getCargoByIdentifier } from "../model/cargo";
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

    const result = await registerCargo(input as any);
    res.status(201).json({ success: true, cargoId: result.cargoId });
    return;
  } catch (error) {
    console.error("[ERROR] Error creando cargo:", error);
    res.status(500).json({ success: false, message: "Error creating cargo" });
    return;
  }
};

export const getCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      id,
      trackingCode,
      qrcode,
      airWaybillNumber,
      houseAirWaybillNumber,
    } = req.query;

    if (
      !id &&
      !trackingCode &&
      !qrcode &&
      !airWaybillNumber &&
      !houseAirWaybillNumber
    ) {
      res.status(400).json({
        success: false,
        message: "Identifier is required",
      });
      return;
    }

    const cargo = await getCargoByIdentifier({
      id: id as string | undefined,
      trackingCode: trackingCode as string | undefined,
      qrcode: qrcode as string | undefined,
      airWaybillNumber: airWaybillNumber as string | undefined,
      houseAirWaybillNumber: houseAirWaybillNumber as string | undefined,
    });

    if (!cargo) {
      res.status(404).json({
        success: false,
        message: "Cargo not found",
      });
      return;
    }

    res.status(200).json({ success: true, cargo });
    return;
  } catch (error) {
    console.error("[ERROR] Error fetching cargo:", error);
    res.status(500).json({ success: false, message: "Error fetching cargo" });
    return;
  }
};
