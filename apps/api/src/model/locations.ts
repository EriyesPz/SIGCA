import { db } from "./db";
import { LocationStatus } from "../types/locations";

export const getAllLocations = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

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

  const allLocations = warehouses.flatMap((warehouse) =>
    warehouse.Racks.flatMap((rack) =>
      rack.RackLevels.flatMap((level) =>
        level.RackColumns.map((column) => ({
          warehouse: warehouse.Name,
          rack: rack.Name,
          rackCode: rack.Code ?? null,
          level: level.LevelNumber,
          column: column.ColumnCode ?? null,
          isOccupied: column.Cargo.length > 0,
          trackingCode: column.Cargo[0]?.TrackingCode ?? null,
          status:
            column.Cargo.length > 0
              ? LocationStatus.ALMACENADO
              : LocationStatus.DISPONIBLE,
          description: column.Cargo[0]?.Description ?? null,
        }))
      )
    )
  );

  const total = allLocations.length;
  const paginated = allLocations.slice(skip, skip + limit);

  return { data: paginated, total };
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
        warehouseId: warehouse.Id,
        warehouse: warehouse.Name,
        rack: rack.Name,
        rackCode: rack.Code ?? null,
        levelId: level.Id,
        level: level.LevelNumber,
        columnId: column.Id,
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
        levelId: level.Id,
        level: level.LevelNumber,
        columnId: column.Id,
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

export const getLocationByStatus = async (
  status: LocationStatus,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

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

  const allLocations = warehouses.flatMap((warehouse) =>
    warehouse.Racks.flatMap((rack) =>
      rack.RackLevels.flatMap((level) =>
        level.RackColumns.map((column) => {
          const isOccupied = column.Cargo.length > 0;
          const locationStatus = isOccupied
            ? LocationStatus.ALMACENADO
            : LocationStatus.DISPONIBLE;

          return {
            warehouse: warehouse.Name,
            rack: rack.Name,
            rackCode: rack.Code ?? null,
            level: level.LevelNumber,
            column: column.ColumnCode ?? null,
            isOccupied,
            trackingCode: column.Cargo[0]?.TrackingCode ?? null,
            status: locationStatus,
            description: column.Cargo[0]?.Description ?? null,
          };
        })
      )
    )
  );

  const filtered = allLocations.filter((loc) => loc.status === status);
  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limit);

  return { data: paginated, total };
};
