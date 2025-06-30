import { racksByWarehouse } from "../model/rack";
import { Request, Response } from "express";

export const getRacksByWarehouse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { warehouse } = req.params;
    if (typeof warehouse !== "string") {
      res
        .status(400)
        .json({
          error: "El parámetro 'warehouse' es requerido y debe ser una cadena",
        });
      return;
    }

    const racks = await racksByWarehouse(warehouse);
    if (!racks || racks.length === 0) {
      res.status(404).json({ message: "No racks encontrados para este almacén" });
      return;
    }
    
    res.status(200).json(racks);
    return;
  } catch (error) {
    console.error(`Error al obtener racks para el almacén ${error}`);
    res.status(500).json({ error: "Error interno del servidor" });
    return;
  }
};