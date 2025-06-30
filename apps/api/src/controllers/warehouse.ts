import { allWarehouses } from "../model/warehouse";
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

