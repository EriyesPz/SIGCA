// src/model/alerts.ts
import { PrismaClient, Prisma } from "../generated/prisma"; // 👈 ajusta la ruta si tu build cambia
const prisma = new PrismaClient();

export type AlertsListParams = {
  from?: string;       // YYYY-MM-DD
  to?: string;         // YYYY-MM-DD
  type?: string;       // p.ej. "TEMPERATURE"
  status?: "pending" | "resolved";
  q?: string;          // búsqueda libre
  page?: number;       // 1-based
  pageSize?: number;   // 10,25,50...
};

export async function listAlerts(params: AlertsListParams) {
  const {
    from,
    to,
    type,
    status,
    q,
    page = 1,
    pageSize = 25,
  } = params;

  // Filtros (WHERE)
  const where: Prisma.AlertsWhereInput = {};

  // rango por fecha (TriggeredAt)
  if (from || to) {
    const gte = from ? new Date(from) : undefined;
    const lte = to ? new Date(to) : undefined;
    where.TriggeredAt = {
      ...(gte ? { gte } : {}),
      ...(lte ? { lte } : {}),
    };
  }

  // tipo
  if (type && type !== "all") {
    where.Type = type;
  }

  // estado
  if (status === "pending") where.Resolved = false;
  if (status === "resolved") where.Resolved = true;

  // búsqueda q: en Message, Cargo.TrackingCode, Cargo.Description
  if (q && q.trim()) {
    where.OR = [
      { Message: { contains: q, mode: "insensitive" } },
      { Cargo: { TrackingCode: { contains: q, mode: "insensitive" } } },
      { Cargo: { Description: { contains: q, mode: "insensitive" } } },
    ];
  }

  // total para paginación
  const total = await prisma.alerts.count({ where });

  const skip = Math.max(0, (page - 1) * pageSize);
  const take = Math.max(1, pageSize);

  // data con relaciones útiles
  const data = await prisma.alerts.findMany({
    where,
    orderBy: { TriggeredAt: "desc" },
    skip,
    take,
    include: {
      Cargo: {
        include: {
          Warehouse: true,
        },
      },
      Users: true, // quien la disparó (si lo cargas)
    },
  });

  return { data, total, page, pageSize };
}

/** Resolver/reabrir una alerta */
export async function setAlertResolved(id: string, resolved: boolean) {
  const found = await prisma.alerts.findUnique({ where: { Id: id } });
  if (!found) return null;

  const updated = await prisma.alerts.update({
    where: { Id: id },
    data: { Resolved: resolved },
    include: {
      Cargo: { include: { Warehouse: true } },
      Users: true,
    },
  });

  return updated;
}

/** Lote: resolver/reabrir varias alertas */
export async function bulkSetAlertsResolved(ids: string[], resolved: boolean) {
  if (!ids.length) return { updated: 0 };

  const result = await prisma.alerts.updateMany({
    where: { Id: { in: ids } },
    data: { Resolved: resolved },
  });

  return { updated: result.count };
}
