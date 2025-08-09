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
      Avatar: true,
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
    Avatar: user.Avatar,
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


export type UpdateUserInput = {
  Email?: string;
  Name?: string | null;
  User?: string;
  Password?: string | null;
  IsActive?: boolean;
  Avatar?: string | null;
};

/** Operaciones opcionales sobre roles */
export type RoleOps = {
  /** Reemplaza TODOS los roles por estos IDs (puede ser [] para dejarlos sin roles) */
  setRoleIds?: string[];
  /** Agrega estos roles (ignora si ya existen) */
  addRoleIds?: string[];
  /** Quita estos roles si existen */
  removeRoleIds?: string[];
};

type UpdateUserWhere = { id?: string; email?: string };

/**
 * Actualiza parcialmente un usuario y opcionalmente edita sus roles.
 * - Identifica por `id` o `email` (uno de los dos).
 * - Si se provee `roleOps.setRoleIds`, reemplaza todos los roles.
 * - Si no se provee `setRoleIds`, se aplican `addRoleIds` y/o `removeRoleIds`.
 * - Devuelve el usuario con Roles y Permisos efectivos.
 */
export async function updateUserAndRoles(
  where: UpdateUserWhere,
  data: UpdateUserInput = {},
  roleOps?: RoleOps
) {
  if (!where?.id && !where?.email) {
    throw new Error("Debes proporcionar where.id o where.email");
  }
  if (where.id && where.email) {
    throw new Error("Proporciona solo un identificador: id O email");
  }
  if (!data && !roleOps) {
    throw new Error("No hay cambios para aplicar");
  }

  // Limpia undefineds para el update de Prisma
  const prismaData: Record<string, any> = {};
  if (data.Email !== undefined) prismaData.Email = data.Email;
  if (data.Name !== undefined) prismaData.Name = data.Name;
  if (data.User !== undefined) prismaData.User = data.User;
  if (data.Password !== undefined) prismaData.Password = data.Password;
  if (data.IsActive !== undefined) prismaData.IsActive = data.IsActive;
  if (data.Avatar !== undefined) prismaData.Avatar = data.Avatar;

  try {
    return await db.$transaction(async (tx) => {
      // 1) Resolver el usuario (y su Id) por id o email
      const user = await tx.users.findUnique({
        where: where.id ? { Id: where.id } : { Email: where.email! },
        select: { Id: true },
      });
      if (!user) throw new Error("Usuario no encontrado con el identificador proporcionado");

      // 2) Actualizar campos (si se enviaron)
      if (Object.keys(prismaData).length > 0) {
        await tx.users.update({
          where: { Id: user.Id },
          data: prismaData,
          select: { Id: true }, // mínimo
        });
      }

      // 3) Operaciones de roles (opcionales)
      if (roleOps) {
        // helper que valida que los roles existan
        const assertRolesExist = async (roleIds: string[]) => {
          if (!roleIds?.length) return;
          const found = await tx.roles.findMany({
            where: { Id: { in: roleIds } },
            select: { Id: true },
          });
          const setFound = new Set(found.map(r => r.Id));
          const missing = roleIds.filter(id => !setFound.has(id));
          if (missing.length) {
            throw new Error(`Role(s) not found: ${missing.join(", ")}`);
          }
        };

        if (roleOps.setRoleIds !== undefined) {
          // Reemplazo total
          const setIds = roleOps.setRoleIds ?? [];
          await assertRolesExist(setIds);

          await tx.userRoles.deleteMany({ where: { UserId: user.Id } });
          if (setIds.length) {
            await tx.userRoles.createMany({
              data: setIds.map(roleId => ({ UserId: user.Id, RoleId: roleId })),
              skipDuplicates: true,
            });
          }
        } else {
          // Agregar y/o remover
          if (roleOps.addRoleIds?.length) {
            await assertRolesExist(roleOps.addRoleIds);
            await tx.userRoles.createMany({
              data: roleOps.addRoleIds.map(roleId => ({ UserId: user.Id, RoleId: roleId })),
              skipDuplicates: true,
            });
          }
          if (roleOps.removeRoleIds?.length) {
            await tx.userRoles.deleteMany({
              where: {
                UserId: user.Id,
                RoleId: { in: roleOps.removeRoleIds },
              },
            });
          }
        }
      }

      // 4) Devolver el usuario con roles y permisos efectivos
      // Si ya tienes este helper en tu módulo, úsalo:
      return getUserWithRolesAndPermissionsTx(tx as any, user.Id);
    });
  } catch (err: any) {
    if (err?.code === "P2002") {
      const target = Array.isArray(err?.meta?.target) ? err.meta.target.join(", ") : err?.meta?.target;
      throw new Error(`Conflicto de unique en campo(s): ${target || "desconocido"}`);
    }
    if (err?.code === "P2025") {
      throw new Error("Usuario no encontrado con el identificador proporcionado");
    }
    throw err;
  }
}

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
                  Permissions: { select: { Id: true, Name: true, Description: true } },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!user) return null;

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