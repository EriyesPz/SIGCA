// src/controllers/alerts.ts
import { Request, Response } from "express";
import { z } from "zod";
import { listAlerts, setAlertResolved, bulkSetAlertsResolved } from "../model/alerts";

/* --------- Schemas de validación --------- */

const listSchema = z.object({
  from: z.string().date().optional().or(z.literal("")).optional(),
  to: z.string().date().optional().or(z.literal("")).optional(),
  type: z.string().optional(), // "TEMPERATURE", "DAMAGE", etc.
  status: z.enum(["pending", "resolved", "all"]).optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

const patchResolveSchema = z.object({
  resolved: z.boolean(),
});

const bulkResolveSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "Provide at least one id"),
  resolved: z.boolean(),
});

/* --------- Controllers --------- */

// GET /alerts?from=&to=&type=&status=&q=&page=&pageSize=
export async function getAlertsController(req: Request, res: Response) {
  try {
    const parsed = listSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.flatten() });
      return;
    }

    const { from, to, type, status, q, page = 1, pageSize = 25 } = parsed.data;

    const result = await listAlerts({
      from: from || undefined,
      to: to || undefined,
      type: type && type !== "all" ? type : undefined,
      status: status && status !== "all" ? status : undefined,
      q: q || undefined,
      page,
      pageSize,
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// PATCH /alerts/:id/resolve  { resolved: boolean }
export async function patchResolveAlertController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const parsed = patchResolveSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.flatten() });
      return;
    }

    const updated = await setAlertResolved(id, parsed.data.resolved);
    if (!updated) {
      res.status(404).json({ message: "Alert not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /alerts/resolve-bulk  { ids: string[], resolved: boolean }
export async function postBulkResolveAlertsController(req: Request, res: Response) {
  try {
    const parsed = bulkResolveSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.flatten() });
      return;
    }

    const result = await bulkSetAlertsResolved(parsed.data.ids, parsed.data.resolved);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
}
