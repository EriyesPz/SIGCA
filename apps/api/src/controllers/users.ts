import { getUsers } from "../model/user";
import { Request, Response } from "express";

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
