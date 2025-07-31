import { allWarehouses, assignCargoLocation } from "../model/warehouse";
import { Request, Response } from "express";

export const getWarehouses = async (req: Request, res: Response) => {
  try {
    const warehouses = await allWarehouses();
    res.json(warehouses);
    return;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    res.status(500).json({ error: "Failed to fetch warehouses" });
    return;
  }
};

export const assignLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    id,
    airWaybillNumber,
    trackingCode,
    houseAirWaybillNumber,
    qrcode,
    warehouseId,
    rackId,
    levelId,
    columnId,
    movedBy,
  } = req.body;

  try {
    const result = await assignCargoLocation({
      id,
      airWaybillNumber,
      trackingCode,
      houseAirWaybillNumber,
      qrcode,
      warehouseId,
      rackId,
      levelId,
      columnId,
      movedBy,
    });

    res.json(result);
  } catch (error) {
    console.error("Error assigning cargo location:", error);
    res.status(500).json({ error: "Failed to assign cargo location" });
  }
};
