// seed/transfers.seed.ts
import { PrismaClient } from "../src/generated/prisma";
import { v4 as uuidv4 } from "uuid";
import { fakerES as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const cargos = await prisma.cargo.findMany({
    include: {
      Warehouse: true,
      RackColumn: {
        include: {
          RackLevels: {
            include: {
              Racks: {
                include: { Warehouse: true },
              },
            },
          },
        },
      },
    },
  });

  const warehouses = await prisma.warehouse.findMany();
  const racks = await prisma.racks.findMany();
  const levels = await prisma.rackLevels.findMany();
  const columns = await prisma.rackColumns.findMany();
  const users = await prisma.users.findMany();

  if (
    cargos.length === 0 ||
    warehouses.length < 2 ||
    racks.length === 0 ||
    levels.length === 0 ||
    columns.length === 0 ||
    users.length === 0
  ) {
    throw new Error("Se necesitan datos previos de cargo, almacenes, racks, niveles, columnas y usuarios para este seed.");
  }

  for (let i = 0; i < 100; i++) {
    const cargo = faker.helpers.arrayElement(cargos);
    const fromWarehouse = cargo.Warehouse ?? faker.helpers.arrayElement(warehouses);
    let toWarehouse = faker.helpers.arrayElement(warehouses);

    // Evitar que el almacén destino sea igual al origen
    while (toWarehouse.Id === fromWarehouse.Id) {
      toWarehouse = faker.helpers.arrayElement(warehouses);
    }

    const fromRack = cargo.RackId ? racks.find(r => r.Id === cargo.RackId) : faker.helpers.arrayElement(racks);
    const toRack = faker.helpers.arrayElement(racks);

    const fromLevel = cargo.LevelId ? levels.find(l => l.Id === cargo.LevelId) : faker.helpers.arrayElement(levels);
    const toLevel = faker.helpers.arrayElement(levels);

    const fromColumn = cargo.ColumnId ? columns.find(c => c.Id === cargo.ColumnId) : faker.helpers.arrayElement(columns);
    const toColumn = faker.helpers.arrayElement(columns);

    const movedBy = faker.helpers.arrayElement(users);

    await prisma.transfers.create({
      data: {
        Id: uuidv4(),
        CargoId: cargo.Id,
        FromWarehouseId: fromWarehouse.Id,
        ToWarehouseId: toWarehouse.Id,
        TransferDate: faker.date.recent({ days: 60 }),
        Notes: faker.lorem.sentence(),
        TransferredBy: movedBy.Id,
        FromRackId: fromRack?.Id ?? null,
        ToRackId: toRack.Id,
        FromLevelId: fromLevel?.Id ?? null,
        ToLevelId: toLevel.Id,
        FromColumnId: fromColumn?.Id ?? null,
        ToColumnId: toColumn.Id,
      },
    });
  }

  console.log("✅ 100 registros de Transfers insertados correctamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed de Transfers:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
