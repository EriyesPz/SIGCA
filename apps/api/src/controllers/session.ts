import { getAllSessionLogs } from "../model/session";
import { Request, Response } from "express";

export const getSessionLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await getAllSessionLogs();
    res.status(200).json(response);
    return;
  } catch (error) {
    console.error("[ERROR] Error al obtener los logs de sesión:", error);
    res.status(500).json({ error: "Error al obtener los logs de sesión" });
    return;
  }
};
