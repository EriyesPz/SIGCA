import { db } from "./db";

export const getRolesWithPermissions = async () => {
  try {
    const roles = await db.roles.findMany({
      include: {
        RolePermissions: {
          include: {
            Permissions: {
              select: {
                Id: true,
                Name: true,
                Description: true,
              },
            },
          },
        },
      },
    });

    return roles.map((role) => ({
      Id: role.Id,
      Name: role.Name,
      Description: role.Description,
      Permissions: role.RolePermissions.map((rp) => ({
        Id: rp.Permissions.Id,
        Name: rp.Permissions.Name,
        Description: rp.Permissions.Description,
      })),
    }));
  } catch (error) {
    console.error("[ERROR] Error al obtener roles con permisos:", error);
    throw new Error("No se pudieron obtener los roles.");
  }
};

export const getAllPermissions = async () => {
  try {
    const permissions = await db.permissions.findMany({
      select: {
        Id: true,
        Name: true,
        Description: true,
      },
      orderBy: { Name: "asc" },
    });

    return permissions;
  } catch (error) {
    console.error("[ERROR] Error al obtener permisos:", error);
    throw new Error("No se pudieron obtener los permisos.");
  }
};

export const getAllRoles = async () => {
  try {
    const roles = await db.roles.findMany({
      select: {
        Id: true,
        Name: true,
        Description: true,
      },
      orderBy: { Name: "asc" },
    });

    return roles;
  } catch (error) {
    console.error("[ERROR] Error al obtener roles:", error);
    throw new Error("No se pudieron obtener los roles.");
  }
};
