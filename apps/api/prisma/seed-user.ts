// seed/users-roles-permissions.seed.ts
import { PrismaClient } from "../src/generated/prisma";
import { v4 as uuidv4 } from "uuid";
import { fakerES as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const predefinedRoles = [
  "admin",
  "digitador",
  "supervisor",
  "talonador",
  "operador",
  "auditor",
  "cliente",
];

const predefinedPermissions = [
  "cargo.register",
  "cargo.view",
  "cargo.edit",
  "cargo.transfer",
  "cargo.deliver",
  "user.manage",
  "role.manage",
  "permission.manage",
];

async function main() {
  // Crear permisos
  for (const permission of predefinedPermissions) {
    await prisma.permissions.upsert({
      where: { Name: permission },
      update: {},
      create: { Id: uuidv4(), Name: permission },
    });
  }

  // Crear roles
  for (const role of predefinedRoles) {
    await prisma.roles.upsert({
      where: { Name: role },
      update: {},
      create: { Id: uuidv4(), Name: role },
    });
  }

  const allPermissions = await prisma.permissions.findMany();
  const allRoles = await prisma.roles.findMany();

  // Asignar permisos al rol "admin"
  const adminRole = allRoles.find((r) => r.Name === "admin");
  if (adminRole) {
    await prisma.rolePermissions.deleteMany({ where: { RoleId: adminRole.Id } });
    await prisma.rolePermissions.createMany({
      data: allPermissions.map((p) => ({ RoleId: adminRole.Id, PermissionId: p.Id })),
    });
  }

  // Crear usuarios
  for (let i = 0; i < 10; i++) {
    const role = faker.helpers.arrayElement(allRoles);
    const user = await prisma.users.create({
      data: {
        Id: uuidv4(),
        Email: faker.internet.email(),
        User: faker.person.fullName(),
        Password: null, // Agrega lógica de hashing si es necesario
        IsActive: true,
      },
    });

    await prisma.userRoles.create({
      data: {
        UserId: user.Id,
        RoleId: role.Id,
      },
    });
  }

  console.log("✅ Usuarios, roles y permisos generados exitosamente");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });