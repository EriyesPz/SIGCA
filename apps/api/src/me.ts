// src/me.ts
import { Router, type RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
// 👇 OJO: usa la misma ruta que en auth.ts (singular)
import { getUserWithRolesAndPermissions } from "./model/user";

export const meRouter = Router();

/**
 * Devuelve el perfil del usuario autenticado.
 * Toma el token de:
 *   - Authorization: Bearer <token>
 *   - Cookie: token=<token>
 */
const meHandler: RequestHandler = async (req, res) => {
  // 1) token por header o cookie
  const auth = req.headers.authorization || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const cookieToken = (req as any).cookies?.token as string | undefined;
  const token = bearer || cookieToken || "";

  if (!token) {
    res.status(401).json({ error: "No token" });
    return;
  }

  // 2) secret
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Config error (JWT_SECRET missing)" });
    return;
  }

  try {
    // 3) verificar y sacar userId (sub)
    const payload = jwt.verify(token, secret) as JwtPayload;
    const userId = payload.sub as string | undefined;
    if (!userId) {
      res.status(401).json({ error: "Token inválido (sin sub)" });
      return;
    }

    // 4) roles/permisos desde BD (fuente de verdad)
    const full = await getUserWithRolesAndPermissions(userId);
    if (!full) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const roles = (full.Roles ?? []).map((r: { Id: string }) => r.Id);
    const permissions = (full.Permissions ?? []).map((p: { Id: string }) => p.Id);

    res.json({
      userId,
      email: full.Email ?? null,
      userName: full.User ?? null,
      roles,
      permissions,
    });
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

meRouter.get("/me", meHandler);
