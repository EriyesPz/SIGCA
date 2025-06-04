import { db } from "./db";

export async function assignDefaultRole(userId: string) {
  const role = await db.roles.findUnique({ where: { Name: "user" } });
  if (!role) return;

  await db.userRoles.upsert({
    where: {
      UserId_RoleId: {
        UserId: userId,
        RoleId: role.Id,
      },
    },
    update: {},
    create: {
      UserId: userId,
      RoleId: role.Id,
    },
  });
}
