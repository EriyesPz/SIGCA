import { Request, Response } from "express";
import {
  cargoEntry,
  cargoExitReport,
  cargoTransferReport,
  distributionByLocationReport,
  cargoReturnReentryReport
} from "../model/reports";

export const getCargoEntryReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const report = await cargoEntry();
    res.status(200).json(report);
    return;
  } catch (error) {
    console.error("Error al generar el reporte de cargas:", error);
    res.status(500).json({ error: "Error al generar el reporte de cargas" });
    return;
  }
};

export const getCargoExitReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const report = await cargoExitReport();
    res.status(200).json(report);
    return;
  } catch (error) {
    console.error("Error al generar el reporte de salidas de cargas:", error);
    res
      .status(500)
      .json({ error: "Error al generar el reporte de salidas de cargas" });
    return;
  }
};

export const getCargoTransferReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const report = await cargoTransferReport();
    res.status(200).json(report);
    return;
  } catch (error) {
    console.error("Error al generar el reporte de traslados de carga:", error);
    res
      .status(500)
      .json({ error: "Error al generar el reporte de traslados de carga" });
    return;
  }
};

export const getDistributionByLocationReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const report = await distributionByLocationReport();
    res.status(200).json(report);
    return;
  } catch (error) {
    console.error("Error al generar el reporte de distribución por ubicación:", error);
    res.status(500).json({
      error: "Error al generar el reporte de distribución por ubicación",
    });
    return;
  }
};

export const getCargoReturnReentryReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const report = await cargoReturnReentryReport();
    res.status(200).json(report);
  } catch (error) {
    console.error(
      "Error al generar el reporte de cargas devueltas o reingresadas:",
      error
    );
    res.status(500).json({
      error:
        "Error al generar el reporte de cargas devueltas o reingresadas",
    });
  }
};