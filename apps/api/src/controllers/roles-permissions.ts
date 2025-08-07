import { Request, Response } from "express";
import {
  getAllPermissions,
  getAllRoles,
  getRolesWithPermissions,
} from "../model/roles-permission";

export const allPermisions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await getAllPermissions();
    res.status(200).json(response);
    return;
  } catch (error) {
    res.status(500).json("Error con los permisos");
    throw new Error("Error al obtener los permisos");
  }
};

export const allRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await getAllRoles();
    res.status(200).json(roles);
    return;
  } catch (error) {
    console.error("[ERROR] Error al obtener los roles:", error);
    res.status(500).json({ error: "Error al obtener los roles" });
    return;
  }
};

// GET /roles-with-permissions
export const rolesWithPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await getRolesWithPermissions();
    res.status(200).json(roles);
    return;
  } catch (error) {
    console.error("[ERROR] Error al obtener roles con permisos:", error);
    res.status(500).json({ error: "Error al obtener roles con permisos" });
    return;
  }
};
