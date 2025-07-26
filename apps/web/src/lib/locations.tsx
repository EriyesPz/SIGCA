import { getApiUrl } from "./client";
import { useQuery } from "@tanstack/react-query";

const getLocations = async (page = 1, limit = 10) => {
  const r = await fetch(`${getApiUrl()}/locations?page=${page}&limit=${limit}`);
  if (!r.ok) throw new Error("Error fetching locations");
  return r.json(); // ← { data, total, ... }
};

/* -------------- SÓLO añadimos las claves que faltan -------------- */
const getLocationsByWarehouse = async (warehouseId: string) => {
  const r = await fetch(`${getApiUrl()}/locations/${warehouseId}`);
  if (!r.ok)
    throw new Error(`Error fetching locations for warehouse ${warehouseId}`);
  if (r.status === 204) return [];

  const raw: any[] = await r.json();
  return raw.map((loc, idx) => ({
    ...loc,
    warehouseId, // <- para que el filtro funcione
    warehouseName: loc.warehouse, // <- para mostrar en la tabla
    rackId: loc.rackCode ?? `rack-${idx}`,
    rackName: loc.rack ?? "Rack Desconocido",
  }));
};
/* ------------------------------------------------------------------ */

const getLocationsByRack = async (rack: string) => {
  const r = await fetch(`${getApiUrl()}/locations-rack/${rack}`);
  if (!r.ok) throw new Error(`Error fetching locations for rack ${rack}`);
  if (r.status === 204) return [];
  return r.json();
};

/* hooks ----------------------------------------------------------- */
export const useLocations = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ["locations", page, limit],
    queryFn: () => getLocations(page, limit),
  });

export const useLocationsByWarehouse = (warehouse: string) =>
  useQuery({
    queryKey: ["locations", warehouse],
    queryFn: () => getLocationsByWarehouse(warehouse),
    enabled: !!warehouse && warehouse !== "all",
    refetchOnWindowFocus: false,
  });

export const useLocationsByRack = (rack: string) =>
  useQuery({
    queryKey: ["locations", "rack", rack],
    queryFn: () => getLocationsByRack(rack),
    enabled: !!rack,
    refetchOnWindowFocus: false,
  });
