import { Request, Response } from "express";
import { z } from "zod";
import {
  getUsers,
  createUserWithRoles,
  addRolesToUser,
  replaceUserRoles,
  getEffectivePermissionsForUser,
  getUserWithRolesAndPermissions,
} from "../model/user";

/* ================== Schemas ================== */

const createUserWithRolesSchema = z.object({
  email: z.string().email("Invalid email"),
  userName: z.string().min(1, "userName is required"),
  password: z.string().min(6, "password must be at least 6 chars"),
  roles: z.array(z.string().min(1)).min(1, "At least one role is required"),
});

const rolesArraySchema = z.object({
  roles: z.array(z.string().min(1)).min(1, "At least one role is required"),
});

/* ================== Controllers ================== */

// GET /users
export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
    return;
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
    return;
  }
};

// POST /users  (crear usuario con roles)
export const createUserWithRolesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = createUserWithRolesSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.flatten() });
      return;
    }

    const { email, userName, password, roles } = parsed.data;

    const created = await createUserWithRoles(email, userName, password, roles);

    // No retornamos password
    res.status(201).json(created);
  } catch (error: any) {
    if (String(error?.message || "").startsWith("Role(s) not found")) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /users/:userId/roles  (agregar roles SIN reemplazar)
export const addRolesToUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const parsed = rolesArraySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.flatten() });
      return;
    }

    const { roles } = parsed.data;
    await addRolesToUser(userId, roles);

    const full = await getUserWithRolesAndPermissions(userId);
    res.status(200).json(full);
  } catch (error: any) {
    if (String(error?.message || "").startsWith("Role(s) not found")) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /users/:userId/roles  (REEMPLAZAR todos los roles)
export const replaceUserRolesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const parsed = rolesArraySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.flatten() });
      return;
    }

    const { roles } = parsed.data;
    await replaceUserRoles(userId, roles);

    const full = await getUserWithRolesAndPermissions(userId);
    res.status(200).json(full);
  } catch (error: any) {
    if (String(error?.message || "").startsWith("Role(s) not found")) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /users/:userId  (usuario con roles y permisos)
export const getUserDetailsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const full = await getUserWithRolesAndPermissions(userId);
    if (!full) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(full);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /users/:userId/permissions  (permisos efectivos)
export const getUserPermissionsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const perms = await getEffectivePermissionsForUser(userId);
    res.status(200).json(perms);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};
