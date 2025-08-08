import { Request, Response } from "express";
import {
  cargoEntry,
  cargoExitReport,
  cargoTransferReport,
  distributionByLocationReport,
  cargoReturnReentryReport,
  averageCargoStayReport,
  dailyCargoByTypeReport,
} from "../model/reports";

export const getCargoEntryReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { from, to, warehouseId } = req.query as {
      from?: string;
      to?: string;
      warehouseId?: string;
    };

    const report = await cargoEntry({ from, to, warehouseId });
    res.status(200).json(report);
  } catch (error) {
    console.error("Error al generar el reporte de cargas:", error);
    res.status(500).json({ error: "Error al generar el reporte de cargas" });
  }
};

export const getCargoExitReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to, warehouseId } = req.query as {
      from?: string;
      to?: string;
      warehouseId?: string;
    };

    const report = await cargoExitReport({
      from: from || undefined,
      to: to || undefined,
      warehouseId: warehouseId || undefined,
    });

    res.status(200).json(report);
    return;
  } catch (error) {
    console.error("Error al generar el reporte de salidas de cargas:", error);
    res.status(500).json({ error: "Error al generar el reporte de salidas de cargas" });
    return;
  }
};

export const getCargoTransferReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };

    const report = await cargoTransferReport({ from, to });
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

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export const getDistributionByLocationReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };

    let dateRange:
      | { gte?: Date; lte?: Date }
      | undefined = undefined;

    if (from || to) {
      dateRange = {};
      if (from) {
        const f = new Date(from);
        if (isNaN(f.getTime())) {
          res.status(400).json({ error: "Parámetro 'from' inválido. Use YYYY-MM-DD." });
          return;
        }
        dateRange.gte = startOfDay(f);
      }
      if (to) {
        const t = new Date(to);
        if (isNaN(t.getTime())) {
          res.status(400).json({ error: "Parámetro 'to' inválido. Use YYYY-MM-DD." });
          return;
        }
        dateRange.lte = endOfDay(t);
      }
    }

    const report = await distributionByLocationReport({ dateRange });
    res.status(200).json(report);
    return;
  } catch (error) {
    console.error(
      "Error al generar el reporte de distribución por ubicación:",
      error
    );
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
      error: "Error al generar el reporte de cargas devueltas o reingresadas",
    });
  }
};

export const getAverageCargoStayReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { from, to, warehouseId } = req.query as {
      from?: string;
      to?: string;
      warehouseId?: string;
    };

    const report = await averageCargoStayReport({ from, to, warehouseId });
    res.status(200).json(report);
    return;
  } catch (error) {
    console.error("Error al generar el reporte de permanencia promedio:", error);
    res
      .status(500)
      .json({ error: "Error al generar el reporte de permanencia promedio" });
    return;
  }
};

export const getDailyCargoByTypeReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { from, to, warehouseId } = req.query as {
      from?: string;
      to?: string;
      warehouseId?: string;
    };
    const report = await dailyCargoByTypeReport({ from, to, warehouseId });
    res.status(200).json(report);
  } catch (error) {
    console.error("Error al generar el reporte diario por tipo:", error);
    res
      .status(500)
      .json({ error: "Error al generar el reporte diario por tipo" });
  }
};
