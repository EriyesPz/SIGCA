import { PrismaClient } from "../src/generated/prisma";
import { fakerES_MX as faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function ensureOne<T>(p: Promise<T | null>, name: string): Promise<T> {
  const row = await p;
  if (!row) throw new Error(`No existe ningún ${name}. Seed cancelado.`);
  return row;
}

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.categories.createMany({
      data: [
        { Id: "CAT-GRN", Name: "Granos", Icon: "🌾", Color: "#C2A83E" },
        { Id: "CAT-REP", Name: "Repuestos", Icon: "⚙️", Color: "#637381" },
        { Id: "CAT-ELE", Name: "Electrónica", Icon: "💻", Color: "#3E8EDE" },
      ],
      skipDuplicates: true,
    });

    const [user] = await tx.users.findMany({ take: 1 });
    const wh = await ensureOne(tx.warehouse.findFirst(), "Warehouse");
    const rack = await ensureOne(
      tx.racks.findFirst({ where: { WarehouseId: wh.Id } }),
      "Rack"
    );
    const level = await ensureOne(
      tx.rackLevels.findFirst({ where: { RackId: rack.Id } }),
      "RackLevel"
    );
    const column = await ensureOne(
      tx.rackColumns.findFirst({ where: { LevelId: level.Id } }),
      "RackColumn"
    );

    const cargo = await tx.cargo.upsert({
      where: { TrackingCode: "TRK-0001" },
      update: {},
      create: {
        Id: uuidv4(),
        TrackingCode: "TRK-0001",
        Description: "Cajas de repuesto hidráulico",
        Status: "IN_WAREHOUSE",
        WeightKg: 85,
        Quantity: 5,
        WarehouseId: wh.Id,
        RackId: rack.Id,
        LevelId: level.Id,
        ColumnId: column.Id,
        CreatedBy: user?.Id,
      },
    });

    await tx.cargoDocuments.createMany({
      data: [
        {
          Id: uuidv4(),
          CargoId: cargo.Id,
          FileUrl: faker.internet.url(),
          Type: "Factura",
          Metadata: { folio: faker.string.alphanumeric(10) },
          CreatedBy: user?.Id,
        },
        {
          Id: uuidv4(),
          CargoId: cargo.Id,
          FileUrl: faker.internet.url(),
          Type: "Packing List",
          Metadata: { bultos: cargo.Quantity },
          CreatedBy: user?.Id,
        },
      ],
      skipDuplicates: true,
    });

    await tx.cargoStatusHistory.create({
      data: {
        Id: uuidv4(),
        CargoId: cargo.Id,
        PreviousStatus: null,
        NewStatus: "IN_WAREHOUSE",
        ChangedBy: user?.Id,
      },
    });

    await tx.cargoLocationHistory.create({
      data: {
        Id: uuidv4(),
        CargoId: cargo.Id,
        ToRackId: rack.Id,
        ToLevelId: level.Id,
        ToColumnId: column.Id,
        MovedBy: user?.Id,
      },
    });

    await tx.alerts.create({
      data: {
        Id: uuidv4(),
        CargoId: cargo.Id,
        Type: "TEMPERATURE",
        Message: "Temperatura fuera de rango",
        TriggeredBy: user?.Id,
      },
    });

    await tx.deliveries.create({
      data: {
        Id: uuidv4(),
        CargoId: cargo.Id,
        Receiver: faker.person.fullName(),
        DeliveredAt: faker.date.soon({ days: 10 }),
        VerifiedBy: uuidv4(),
        DeliveredBy: user?.Id,
      },
    });

    await tx.transfers.create({
      data: {
        Id: uuidv4(),
        CargoId: cargo.Id,
        FromWarehouseId: wh.Id,
        ToWarehouseId: wh.Id,
        Notes: "Movido para consolidar inventario",
        TransferredBy: user?.Id,
      },
    });
  });

  console.log("✅ Seed ejecutado sin errores");
}

main()
  .catch((e) => {
    console.error("❌ Seed falló:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
