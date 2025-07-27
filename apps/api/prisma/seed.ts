import { PrismaClient } from "../src/generated/prisma";
import { v4 as uuidv4 } from "uuid";
import { fakerES as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function randomFloat(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarDescripcionDinamica(): string {
  const producto = faker.commerce.productName().toLowerCase();
  const cantidad = randomInt(1, 50);
  const unidad = faker.commerce.productMaterial().toLowerCase();
  return `Carga de ${cantidad} ${unidad} de ${producto}`;
}

function generarInstruccionesDinamicas(): string {
  const condiciones = [
    "No apilar más de dos niveles",
    "Manipular con guantes",
    "Evitar golpes bruscos",
    "No exponer al sol",
    "Mantener alejado de la humedad",
    "Transportar en vehículo refrigerado",
  ];
  return `${faker.helpers.arrayElement(condiciones)}. Revisar sellado antes de almacenar.`;
}

async function main() {
  const users = await prisma.users.findMany();
  const columns = await prisma.rackColumns.findMany({
    include: {
      RackLevels: {
        include: {
          Racks: {
            include: {
              Warehouse: true,
            },
          },
        },
      },
    },
  });

  if (users.length === 0 || columns.length === 0) {
    throw new Error("Se necesitan usuarios y columnas para ejecutar este seed.");
  }

  for (let i = 1; i <= 400; i++) {
    const col = faker.helpers.arrayElement(columns);
    const level = col.RackLevels;
    const rack = level.Racks;
    const warehouse = rack.Warehouse;
    const user = faker.helpers.arrayElement(users);

    await prisma.cargo.create({
      data: {
        Id: uuidv4(),
        QRCode: null,
        Description: generarDescripcionDinamica(),
        Status: faker.helpers.arrayElement(['almacenado', 'en_transito', 'entregado']),
        WeightKg: randomFloat(100, 500),
        VolumeM3: randomFloat(1.0, 3.0),
        DimensionsCm: {
          Length: randomInt(100, 150),
          Width: randomInt(70, 100),
          Height: randomInt(100, 200),
        },
        Quantity: randomInt(1, 20),
        EntryDate: faker.date.past({ years: 1 }),
        ExitDate: null,
        IsPerishable: faker.datatype.boolean(),
        IsHazardousMaterial: faker.datatype.boolean(),
        IsHighValue: Math.random() < 0.3,
        DeclaredValueUSD: randomFloat(1000, 15000),
        TemperatureRequirement: faker.helpers.arrayElement(['ambiente', 'refrigerado', 'congelado']),
        HandlingInstructions: generarInstruccionesDinamicas(),
        AirWaybillNumber: `AWB-${faker.string.numeric(6)}`,
        HouseAirWaybillNumber: `HAWB-${faker.string.numeric(6)}`,
        MasterAirWaybillNumber: `MAWB-${faker.string.numeric(6)}`,
        ManifestNumber: `MAN-${faker.string.numeric(5)}`,
        FlightNumber: `FL-${faker.string.numeric(3)}`,
        FlightDate: faker.date.recent({ days: 10 }),
        OriginAirport: faker.location.city().slice(0, 3).toUpperCase(),
        DestinationAirport: faker.location.city().slice(0, 3).toUpperCase(),
        CustomsStatus: faker.helpers.arrayElement(["pendiente", "liberado", "en_revision"]),
        CustomsDeclarationNumber: `DECL-${faker.string.numeric(6)}`,
        InsurancePolicyNumber: `INS-${faker.string.numeric(4)}`,
        ArrivalDate: faker.date.recent({ days: 20 }),
        DepartureDate: null,
        SealNumber: `SEAL-${faker.string.numeric(5)}`,
        InternalReference: `INT-REF-${i}`,
        LastInspectionDate: faker.date.recent({ days: 30 }),
        DamageReported: faker.datatype.boolean(),
        DamageDescription: faker.lorem.sentence(),
        CargoType: faker.commerce.department(),
        ContainerNumber: `CONT-${faker.string.numeric(4)}`,
        ULDNumber: `ULD-${faker.string.numeric(4)}`,
        Shipper: {
          Name: faker.person.fullName(),
          Company: faker.company.name(),
          Contact: faker.person.firstName(),
          Phone: faker.phone.number(),
          Email: faker.internet.email(),
          Address: `${faker.location.streetAddress()}, ${faker.location.city()}, Honduras`,
        },
        Consignee: {
          Name: faker.person.fullName(),
          Company: faker.company.name(),
          Contact: faker.person.firstName(),
          Phone: faker.phone.number(),
          Email: faker.internet.email(),
          Address: `${faker.location.streetAddress()}, ${faker.location.city()}, Honduras`,
        },

        WarehouseId: warehouse.Id,
        RackId: rack.Id,
        LevelId: level.Id,
        ColumnId: col.Id,
        CreatedBy: user.Id,
      },
    });
  }

  console.log("✅ 400 registros de cargo insertados dinámicamente en español.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
