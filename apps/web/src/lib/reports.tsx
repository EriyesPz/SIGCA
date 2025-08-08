import { getApiUrl } from "./client";
import { useQuery } from "@tanstack/react-query";

export interface DatesCargo {
  from?: string; // formato YYYY-MM-DD
  to?: string;   // formato YYYY-MM-DD
  warehouseId?: string;
}

const fetchCargoEntryReport = async (filters: DatesCargo) => {
  const queryParams = new URLSearchParams();

  if (filters.from) queryParams.append("from", filters.from);
  if (filters.to) queryParams.append("to", filters.to);
  if (filters.warehouseId) queryParams.append("warehouseId", filters.warehouseId);

  const response = await fetch(`${getApiUrl()}/reports/cargo-entry?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Error fetching cargo entry report: ${response.statusText}`);
  }

  return response.json();
};

export const useCargoEntryReport = (filters: DatesCargo) => {
  return useQuery({
    queryKey: ["cargoEntryReport", filters],
    queryFn: () => fetchCargoEntryReport(filters),
    enabled: true,
  });
};


export interface CargoExitFilters {
  from?: string;       // YYYY-MM-DD (opcional)
  to?: string;         // YYYY-MM-DD (opcional)
  warehouseId?: string;
}

const fetchCargoExitReport = async (filters: CargoExitFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.from) queryParams.append("from", filters.from);
  if (filters.to) queryParams.append("to", filters.to);
  if (filters.warehouseId) queryParams.append("warehouseId", filters.warehouseId);

  const res = await fetch(`${getApiUrl()}/reports/cargo-exit?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(`Error fetching cargo exit report: ${res.statusText}`);
  }
  return res.json();
};

export const useCargoExitReport = (filters: CargoExitFilters) => {
  return useQuery({
    queryKey: ["cargoExitReport", filters],
    queryFn: () => fetchCargoExitReport(filters),
    enabled: true,
  });
};