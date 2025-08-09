import { getApiUrl } from "./client";
import { useQuery } from "@tanstack/react-query";
import { LocationStatus } from "@/components/common/locations";

const getLocations = async (
  page: number = 1,
  limit: number = 10,
  status: LocationStatus | "all" = "all",
  q: string = ""
) => {
  const url = new URL(`${getApiUrl()}/locations`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (status !== "all") url.searchParams.set("status", status);
  if (q.trim()) url.searchParams.set("q", q.trim());

  const r = await fetch(url.toString());
  if (!r.ok) throw new Error("Error fetching locations");
  return r.json();
};

const getLocationsByWarehouse = async (warehouseId: string) => {
  const r = await fetch(`${getApiUrl()}/locations/${warehouseId}`);
  if (!r.ok)
    throw new Error(`Error fetching locations for warehouse ${warehouseId}`);
  if (r.status === 204) return [];

  const raw: any[] = await r.json();
  return raw.map((loc, idx) => ({
    ...loc,
    warehouseId,
    warehouseName: loc.warehouse,
    rackId: loc.rackCode ?? `rack-${idx}`,
    rackName: loc.rack ?? "Rack Desconocido",
  }));
};

const getLocationsByRack = async (rack: string) => {
  const r = await fetch(`${getApiUrl()}/locations-rack/${rack}`);
  if (!r.ok) throw new Error(`Error fetching locations for rack ${rack}`);
  if (r.status === 204) return [];
  return r.json();
};

const getLocationsByStatus = async (status: LocationStatus) => {
  const r = await fetch(`${getApiUrl()}/locations/status/${status}`);
  if (!r.ok) throw new Error(`Error fetching locations with status: ${status}`);
  return r.json();
};

export const useLocations = (
  page: number = 1,
  limit: number = 10,
  status: LocationStatus | "all" = "all",
  q: string = ""
) =>
  useQuery({
    queryKey: ["locations", page, limit, status, q],
    queryFn: () => getLocations(page, limit, status, q),
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

export const useLocationsByStatus = (status?: LocationStatus) =>
  useQuery({
    queryKey: ["locations", "status", status],
    queryFn: () => getLocationsByStatus(status!),
    enabled: !!status,
    refetchOnWindowFocus: false,
  });
