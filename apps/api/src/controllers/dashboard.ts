import { Request, Response } from "express";
import { getDashboardOverview } from "../model/dashboard";

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const dashboardData = await getDashboardOverview();
    res.status(200).json(dashboardData);
    return;
  } catch (error) {
    console.error("[DASHBOARD ERROR]", error);
    res.status(500).json({
      message: "Error al obtener los datos del dashboard",
      error: (error as Error).message,
    });
    return;
  }
};
