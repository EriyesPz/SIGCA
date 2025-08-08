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

export interface CargoTransferFilters {
  from?: string;       // YYYY-MM-DD (opcional)
  to?: string;         // YYYY-MM-DD (opcional)
  warehouseId?: string;
}

const fetchCargoTransferReport = async (filters: CargoTransferFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.from) queryParams.append("from", filters.from);
  if (filters.to) queryParams.append("to", filters.to);
  if (filters.warehouseId) queryParams.append("warehouseId", filters.warehouseId);

  const res = await fetch(
    `${getApiUrl()}/reports/cargo-transfer?${queryParams.toString()}`
  );

  if (!res.ok) {
    throw new Error(`Error fetching cargo transfer report: ${res.statusText}`);
  }

  return res.json();
};

export const useCargoTransferReport = (filters: CargoTransferFilters) => {
  return useQuery({
    queryKey: ["cargoTransferReport", filters],
    queryFn: () => fetchCargoTransferReport(filters),
    enabled: true,
  });
};

export interface DistributionByLocationFilters {
  from?: string;       // YYYY-MM-DD (opcional)
  to?: string;         // YYYY-MM-DD (opcional)
  warehouseId?: string;
}

const fetchDistributionByLocationReport = async (filters: DistributionByLocationFilters) => {
  const queryParams = new URLSearchParams();

  if (filters.from) queryParams.append("from", filters.from);
  if (filters.to) queryParams.append("to", filters.to);
  if (filters.warehouseId) queryParams.append("warehouseId", filters.warehouseId);

  const res = await fetch(
    `${getApiUrl()}/reports/distribution-by-location?${queryParams.toString()}`
  );

  if (!res.ok) {
    throw new Error(
      `Error fetching distribution by location report: ${res.statusText}`
    );
  }

  return res.json();
};

export const useDistributionByLocationReport = (
  filters: DistributionByLocationFilters
) => {
  return useQuery({
    queryKey: ["distributionByLocationReport", filters],
    queryFn: () => fetchDistributionByLocationReport(filters),
    enabled: true,
  });
};


export interface DailyCargoByTypeFilters {
  from?: string;       // YYYY-MM-DD (opcional; si no, backend usa rango auto)
  to?: string;         // YYYY-MM-DD (opcional)
  warehouseId?: string;
}

const fetchDailyCargoByTypeReport = async (filters: DailyCargoByTypeFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.from) queryParams.append("from", filters.from);
  if (filters.to) queryParams.append("to", filters.to);
  if (filters.warehouseId) queryParams.append("warehouseId", filters.warehouseId);

  const res = await fetch(`${getApiUrl()}/reports/cargo-type?${queryParams.toString()}`);

  if (!res.ok) {
    throw new Error(`Error fetching daily cargo-by-type report: ${res.statusText}`);
  }

  return res.json();
};

export const useDailyCargoByTypeReport = (filters: DailyCargoByTypeFilters) => {
  return useQuery({
    queryKey: ["dailyCargoByTypeReport", filters],
    queryFn: () => fetchDailyCargoByTypeReport(filters),
    enabled: true,
  });
};

export interface CargoAverageFilters {
  from?: string;       // YYYY-MM-DD (opcional)
  to?: string;         // YYYY-MM-DD (opcional)
  warehouseId?: string;
}

const fetchCargoAverageReport = async (filters: CargoAverageFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.from) queryParams.append("from", filters.from);
  if (filters.to) queryParams.append("to", filters.to);
  if (filters.warehouseId) queryParams.append("warehouseId", filters.warehouseId);

  const res = await fetch(
    `${getApiUrl()}/reports/cargo-average?${queryParams.toString()}`
  );

  if (!res.ok) {
    throw new Error(`Error fetching cargo average report: ${res.statusText}`);
  }

  return res.json();
};

export const useCargoAverageReport = (filters: CargoAverageFilters) => {
  return useQuery({
    queryKey: ["cargoAverageReport", filters],
    queryFn: () => fetchCargoAverageReport(filters),
    enabled: true,
  });
};