import { db } from "./db";

export async function findUserByEmail(email: string) {
  return db.users.findUnique({
    where: { Email: email },
  });
}

export async function createUser(
  email: string,
  userName: string,
  password: string
) {
  return db.users.create({
    data: { Email: email, User: userName, Password: password },
  });
}

export async function updateUserPassword(email: string, newPassword: string) {
  return db.users.update({
    where: { Email: email },
    data: { Password: newPassword },
  });
}

export async function getUsers() {
  const users = await db.users.findMany({
    select: {
      Id: true,
      Email: true,
      Name: true,
      User: true,
      IsActive: true,
      CreatedAt: true,
      UserRoles: {
        select: {
          Roles: {
            select: {
              Id: true,
              Name: true,
            },
          },
        },
      },
      Sessions: {
        orderBy: {
          CreatedAt: "desc",
        },
        take: 1,
        select: {
          CreatedAt: true,
          IpAddress: true,
          UserAgent: true,
        },
      },
    },
  });

  return users.map((user) => ({
    Id: user.Id,
    Email: user.Email,
    Name: user.Name,
    User: user.User,
    IsActive: user.IsActive,
    CreatedAt: user.CreatedAt,
    Roles: user.UserRoles.map((ur) => ({Name: ur.Roles.Name, Id: ur.Roles.Id})),
    LastSessionAt: user.Sessions[0]?.CreatedAt ?? null,
    LastSessionIp: user.Sessions[0]?.IpAddress ?? null,
    LastSessionUserAgent: user.Sessions[0]?.UserAgent ?? null,
  }));
}


export async function createUserWithRoles(
  email: string,
  userName: string,
  password: string,
  roleIds: string[] // p.ej. ["admin", "digitador"]
) {
  if (!roleIds?.length) {
    throw new Error("At least one roleId is required");
  }

  return db.$transaction(async (tx) => {
    // 1) Validar roles existentes
    const roles = await tx.roles.findMany({
      where: { Id: { in: roleIds } },
      select: { Id: true },
    });
    const found = new Set(roles.map((r) => r.Id));
    const missing = roleIds.filter((r) => !found.has(r));
    if (missing.length) {
      throw new Error(`Role(s) not found: ${missing.join(", ")}`);
    }

    // 2) Crear usuario
    const user = await tx.users.create({
      data: { Email: email, User: userName, Password: password },
      select: { Id: true, Email: true, User: true, CreatedAt: true },
    });

    // 3) Asignar roles (UserRoles)
    await tx.userRoles.createMany({
      data: roleIds.map((roleId) => ({ UserId: user.Id, RoleId: roleId })),
      skipDuplicates: true,
    });

    // 4) Recuperar con roles y permisos efectivos
    const full = await getUserWithRolesAndPermissionsTx(tx, user.Id);
    return full;
  });
}

/**
 * Agrega (sin reemplazar) uno o varios roles a un usuario.
 * - Ignora silenciosamente si la relación ya existe.
 * - Falla si algún roleId no existe.
 */
export async function addRolesToUser(userId: string, roleIds: string[]) {
  if (!roleIds?.length) return;

  await db.$transaction(async (tx) => {
    const roles = await tx.roles.findMany({
      where: { Id: { in: roleIds } },
      select: { Id: true },
    });
    const found = new Set(roles.map((r) => r.Id));
    const missing = roleIds.filter((r) => !found.has(r));
    if (missing.length) {
      throw new Error(`Role(s) not found: ${missing.join(", ")}`);
    }

    await tx.userRoles.createMany({
      data: roleIds.map((roleId) => ({ UserId: userId, RoleId: roleId })),
      skipDuplicates: true,
    });
  });
}

/**
 * Reemplaza TODOS los roles del usuario por los proporcionados.
 * - Falla si algún roleId no existe.
 */
export async function replaceUserRoles(userId: string, roleIds: string[]) {
  return db.$transaction(async (tx) => {
    const roles = await tx.roles.findMany({
      where: { Id: { in: roleIds } },
      select: { Id: true },
    });
    const found = new Set(roles.map((r) => r.Id));
    const missing = roleIds.filter((r) => !found.has(r));
    if (missing.length) {
      throw new Error(`Role(s) not found: ${missing.join(", ")}`);
    }

    await tx.userRoles.deleteMany({ where: { UserId: userId } });
    await tx.userRoles.createMany({
      data: roleIds.map((roleId) => ({ UserId: userId, RoleId: roleId })),
      skipDuplicates: true,
    });
  });
}

/**
 * Devuelve los permisos efectivos del usuario (deduplicados) a través de sus roles.
 */
export async function getEffectivePermissionsForUser(userId: string) {
  // Buscar RolePermissions de los roles vinculados al usuario
  const rolePerms = await db.rolePermissions.findMany({
    where: {
      Roles: {
        UserRoles: {
          some: { UserId: userId },
        },
      },
    },
    select: {
      Permissions: {
        select: { Id: true, Name: true, Description: true },
      },
    },
  });

  // Deduplicar por Id
  const map = new Map<string, { Id: string; Name: string; Description: string | null }>();
  for (const rp of rolePerms) {
    const p = rp.Permissions;
    if (!map.has(p.Id)) map.set(p.Id, { Id: p.Id, Name: p.Name, Description: p.Description ?? null });
  }
  return Array.from(map.values());
}

/**
 * Devuelve el usuario con sus roles y permisos efectivos.
 */
export async function getUserWithRolesAndPermissions(userId: string) {
  return db.$transaction(async (tx) => {
    return getUserWithRolesAndPermissionsTx(tx, userId);
  });
}

/* ===================== Helpers internos ===================== */

type Tx = Parameters<typeof db.$transaction>[0] extends (arg: infer A) => any
  ? A
  : never;

async function getUserWithRolesAndPermissionsTx(tx: Tx, userId: string) {
  const user = await tx.users.findUnique({
    where: { Id: userId },
    select: {
      Id: true,
      Email: true,
      Name: true,
      User: true,
      IsActive: true,
      CreatedAt: true,
      UserRoles: {
        select: {
          Roles: {
            select: {
              Id: true,
              Name: true,
              Description: true,
              RolePermissions: {
                select: {
                  Permissions: {
                    select: { Id: true, Name: true, Description: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  // Normalizar: roles + permisos deduplicados
  const roles = user.UserRoles.map((ur) => ({
    Id: ur.Roles.Id,
    Name: ur.Roles.Name,
    Description: ur.Roles.Description ?? null,
  }));

  const permMap = new Map<string, { Id: string; Name: string; Description: string | null }>();
  user.UserRoles.forEach((ur) => {
    ur.Roles.RolePermissions.forEach((rp) => {
      const p = rp.Permissions;
      if (!permMap.has(p.Id)) permMap.set(p.Id, { Id: p.Id, Name: p.Name, Description: p.Description ?? null });
    });
  });

  return {
    Id: user.Id,
    Email: user.Email,
    Name: user.Name,
    User: user.User,
    IsActive: user.IsActive,
    CreatedAt: user.CreatedAt,
    Roles: roles,
    Permissions: Array.from(permMap.values()),
  };
}