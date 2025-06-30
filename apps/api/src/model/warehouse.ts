import { db } from "./db";

export const allWarehouses = async () => {
  try {
    const warehouses = await db.warehouse.findMany({
      select: {
        Id: true,
        Name: true,
      },
      where: {
        IsActive: true,
      },
    });

    if (!warehouses || warehouses.length === 0) {
      throw new Error("No active warehouses found");
    }

    return warehouses;

  } catch (error) {
    console.error("Error fetching warehouses:", error);
    throw new Error("Failed to fetch warehouses");
  }
};
