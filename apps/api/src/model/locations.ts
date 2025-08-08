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
                  Cargos: {
                    select: {
                      Id: true,
                      TrackingCode: true,
                      Status: true,
                      Description: true,
                      AirWaybillNumber: true,
                      HouseAirWaybillNumber: true,
                      MasterAirWaybillNumber: true,
                      ManifestNumber: true,
                      WeightKg: true,
                      DimensionsCm: true

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
      },
    },
    orderBy: {
      Name: "asc",
    },
  });

  const allLocations = warehouses.flatMap((warehouse: any) =>
    warehouse.Racks.flatMap((rack: any) =>
      rack.RackLevels.flatMap((level: any) =>
        level.RackColumns.map((column: any) => {
          const cargo = column.Cargos[0];
          return {
            warehouse: warehouse.Name,
            rack: rack.Name,
            rackCode: rack.Code ?? null,
            level: level.LevelNumber,
            column: column.ColumnCode ?? null,
            isOccupied: !!cargo,
            trackingCode: cargo?.TrackingCode ?? null,
            status: cargo ? LocationStatus.ALMACENADO : LocationStatus.DISPONIBLE,
            description: cargo?.Description ?? null,
            airWaybillNumber: cargo?.AirWaybillNumber ?? null,
            houseAirWaybillNumber: cargo?.HouseAirWaybillNumber ?? null,
            masterAirWaybillNumber: cargo?.MasterAirWaybillNumber ?? null,
            manifestNumber: cargo?.ManifestNumber ?? null,
            weightKg: cargo?.WeightKg ?? null,
            dimensionsCm: cargo?.DimensionsCm ?? null,
          };
        })
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
                  Cargos: {
                    select: {
                      Id: true,
                      TrackingCode: true,
                      Status: true,
                      Description: true,
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
      },
    },
  });

  if (!warehouse) return [];

  const result = warehouse.Racks.flatMap((rack: any) =>
    rack.RackLevels.flatMap((level: any) =>
      level.RackColumns.map((column: any) => {
        const cargo = column.Cargos[0];
        return {
          warehouseId: warehouse.Id,
          warehouse: warehouse.Name,
          rack: rack.Name,
          rackCode: rack.Code ?? null,
          levelId: level.Id,
          level: level.LevelNumber,
          columnId: column.Id,
          column: column.ColumnCode ?? null,
          isOccupied: !!cargo,
          trackingCode: cargo?.TrackingCode ?? null,
          status: cargo ? LocationStatus.ALMACENADO : LocationStatus.DISPONIBLE,
          description: cargo?.Description ?? null,
        };
      })
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
              Cargos: {
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

  const result = rack.RackLevels.flatMap((level: any) =>
    level.RackColumns.map((column: any) => {
      const cargo = column.Cargos[0];
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
                  Cargos: {
                    select: {
                      Id: true,
                      TrackingCode: true,
                      Status: true,
                      Description: true,
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
      },
    },
    orderBy: {
      Name: "asc",
    },
  });

  const allLocations = warehouses.flatMap((warehouse: any) =>
    warehouse.Racks.flatMap((rack: any) =>
      rack.RackLevels.flatMap((level: any) =>
        level.RackColumns.map((column: any) => {
          const cargo = column.Cargos[0];
          const locationStatus = cargo
            ? LocationStatus.ALMACENADO
            : LocationStatus.DISPONIBLE;

          return {
            warehouseId: warehouse.Id,
            warehouse: warehouse.Name,
            rack: rack.Name,
            rackCode: rack.Code ?? null,
            levelId: level.Id,
            level: level.LevelNumber,
            columnId: column.Id,
            column: column.ColumnCode ?? null,
            isOccupied: !!cargo,
            trackingCode: cargo?.TrackingCode ?? null,
            status: locationStatus,
            description: cargo?.Description ?? null,
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
