import {
  getAllLocations,
  getLocationsByWarehouse,
  getLocationsByRack,
  getLocationByStatus,
} from "../model/locations";
import { Request, Response } from "express";
import { LocationStatus } from "../types/locations";

export const getLocations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // filtros opcionales
    const statusParam = (req.query.status as string) || "all";
    const q = (req.query.q as string) || "";

    // Validar status si viene
    const status =
      statusParam !== "all" ? (statusParam as LocationStatus) : "all";

    const { data, total } = await getAllLocations(page, limit, { status, q });

    // 👉 NUNCA 404 por lista vacía; devuelve 200 con data=[]
    res.status(200).json({ data, total, page, limit });
  } catch (error) {
    console.error(`Error al mostrar las ubicaciones ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getLocationsWarehouse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { warehouse } = req.params;
    if (typeof warehouse !== "string") {
      res.status(400).json({
        error: "El parámetro 'warehouse' es requerido y debe ser una cadena",
      });
      return;
    }

    const locations = await getLocationsByWarehouse(warehouse);
    if (!locations || locations.length === 0) {
      res.status(404).json({ message: "Ubicaciones no encontradas" });
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

export const getLocationsRack = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rack } = req.params;
    if (typeof rack !== "string") {
      res.status(400).json({
        error:
          "Los parámetros 'warehouse' y 'rack' son requeridos y deben ser cadenas",
      });
      return;
    }

    const locations = await getLocationsByRack(rack);
    if (!locations || locations.length === 0) {
      res.status(404).json({ message: "No locations found for this rack" });
      return;
    }
    res.status(200).json(locations);
    return;
  } catch (error) {
    console.error(`Error al obtener ubicaciones por el rack ${error}`);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getLocationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.params.status as LocationStatus;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { data, total } = await getLocationByStatus(status, page, limit);

    if (!data || data.length === 0) {
      res.status(404).json({ message: "No locations found" });
      return;
    }

    res.status(200).json({ data, total, page, limit });
  } catch (error) {
    console.error(`Error al mostrar las ubicaciones ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
