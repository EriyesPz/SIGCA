import { getAllLocations, getLocationsByWarehouse } from "../model/locations";
import { Request, Response } from "express";

export const getLocations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const locations = await getAllLocations();
    if (!locations || locations.length === 0) {
      res.status(404).json({ message: "No locations found" });
      return;
    }
    res.status(200).json(locations);
    return;
  } catch (error) {
    console.error(`Error al mostrar las ubicaciones ${error}`);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getLocationsWarehouse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { warehouse }  = req.params;
    if (typeof warehouse !== "string") {
      res
        .status(400)
        .json({
          error: "El parámetro 'warehouse' es requerido y debe ser una cadena",
        });
      return;
    }

    const locations = await getLocationsByWarehouse(warehouse);
    if (!locations || locations.length === 0) {
        res.status(404).json({message: "Ubicaciones no encontradas"})
        return;
    }
    res.status(200).json(locations);
    return;
  } catch (error) {
    console.error(`No se encontraron las ubicaciones por el almacen ${error}`);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
