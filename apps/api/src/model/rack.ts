import { db } from "./db";

export const racksByWarehouse = async (warehouse: string) => {
  try {
    const racks = await db.racks.findMany({
      select: {
        Id: true,
        Name: true,
        WarehouseId: true,
        Code: true,
      },
      where: {
        WarehouseId: warehouse,
      },
    });

    if (!racks || racks.length === 0) {
      throw new Error("No active racks found for this warehouse");
    }

    const response = racks.map((rack) => ({
      Id: rack.Id,
      Name: `${rack.Name} - ${rack.Code}`,
      WarehouseId: rack.WarehouseId,
    }));

    return response;
  } catch (error) {
    console.error("Error fetching racks:", error);
    throw new Error("Failed to fetch racks");
  }
};
