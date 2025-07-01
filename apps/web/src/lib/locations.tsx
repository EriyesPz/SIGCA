import { getApiUrl } from "./client";
import { useQuery } from "@tanstack/react-query";

const getLocations = async (): Promise<any> => {
  const response = await fetch(`${getApiUrl()}/locations`);
  if (!response.ok) {
    throw new Error("Error fetching locations");
  }
  return response.json();
};

const getLocationsByWarehouse = async ( warehouse: string ) => {
  try {
    const response = await fetch(`${getApiUrl()}/locations/${warehouse}`);
    if (!response.ok) {
      throw new Error(`Error fetching locations for warehouse ${warehouse}`);
    }
    if (response.status === 204) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching locations by warehouse:", error);
    throw error;
  }
}

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });
}

export const useLocationsByWarehouse = (warehouse: string) => {
  return useQuery({
    queryKey: ["locations", warehouse],
    queryFn: () => getLocationsByWarehouse(warehouse),
    enabled: !!warehouse,
    refetchOnWindowFocus: false, 
  })
}