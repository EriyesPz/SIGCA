import { db } from "./db";

export const getAllLocations = async () => {
  const warehouses = await db.warehouse.findMany({
    include: {
      Racks: {
        include: {
          RackLevels: {
            include: {
              RackColumns: {
                include: {
                  Cargo: {
                    select: {
                      Id: true,
                      TrackingCode: true,
                      Status: true,
                      Description: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      Name: "asc",
    },
  });

  const result = warehouses.flatMap((warehouse: (typeof warehouses)[number]) =>
    warehouse.Racks.flatMap((rack: (typeof warehouse.Racks)[number]) =>
      rack.RackLevels.flatMap((level: (typeof rack.RackLevels)[number]) =>
        level.RackColumns.map((column: (typeof level.RackColumns)[number]) => ({
          warehouse: warehouse.Name,
          rack: rack.Name,
          rackCode: rack.Code ?? null,
          level: level.LevelNumber,
          column: column.ColumnCode ?? null,
          isOccupied: column.Cargo.length > 0,
          trackingCode: column.Cargo[0]?.TrackingCode ?? null,
          status: column.Cargo[0]?.Status ?? null,
          description: column.Cargo[0]?.Description ?? null,
        }))
      )
    )
  );

  return result;
};

export const getLocationsByWarehouse = async (warehouseId: string) => {
  const warehouse = await db.warehouse.findUnique({
    where: { Id: warehouseId },
    include: {
      Racks: {
        include: {
          RackLevels: {
            include: {
              RackColumns: {
                include: {
                  Cargo: {
                    select: {
                      Id: true,
                      TrackingCode: true,
                      Status: true,
                      Description: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!warehouse) return [];

  const result = warehouse.Racks.flatMap((rack) =>
    rack.RackLevels.flatMap((level) =>
      level.RackColumns.map((column) => ({
        warehouse: warehouse.Name,
        rack: rack.Name,
        rackCode: rack.Code ?? null,
        level: level.LevelNumber,
        column: column.ColumnCode ?? null,
        isOccupied: column.Cargo.length > 0,
        trackingCode: column.Cargo[0]?.TrackingCode ?? null,
        status: column.Cargo[0]?.Status ?? null,
        description: column.Cargo[0]?.Description ?? null,
      }))
    )
  );

  return result;
};

export const getLocationsByRack = async (rackId: string) => {
  const rack = await db.racks.findUnique({
    where: { Id: rackId },
    select: {
      Id: true,
      Name: true,
      Code: true,
      RackLevels: {
        select: {
          Id: true,
          LevelNumber: true,
          RackColumns: {
            select: {
              Id: true,
              ColumnCode: true,
              Cargo: {
                select: {
                  Id: true,
                  TrackingCode: true,
                  Status: true,
                  Description: true,
                  EntryDate: true,
                },
                orderBy: {
                  EntryDate: "asc",
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!rack) return [];

  const result = rack.RackLevels.flatMap((level) =>
    level.RackColumns.map((column) => {
      const cargo = column.Cargo[0]; 
      return {
        rack: rack.Name,
        rackCode: rack.Code ?? null,
        level: level.LevelNumber,
        column: column.ColumnCode,
        isOccupied: !!cargo,
        trackingCode: cargo?.TrackingCode ?? null,
        status: cargo?.Status ?? null,
        description: cargo?.Description ?? null,
      };
    })
  );

  return result;
};