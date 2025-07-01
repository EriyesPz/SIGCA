import { getApiUrl } from "./client";
import { useQuery } from "@tanstack/react-query";

const getRacksByWarehouse = async (warehouse: string): Promise<any> => {
  try {
    const response = await fetch(`${getApiUrl()}/racks/${warehouse}`);
    if (!response.ok) {
      throw new Error(`Error fetching racks for warehouse ${warehouse}`);
    }
    if (response.status === 204) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching racks by warehouse:", error);
    throw error;
  }
};

export const useRacksByWarehouse = (warehouse: string) => {
  return useQuery({
    queryKey: ["racks", warehouse],
    queryFn: () => getRacksByWarehouse(warehouse),
    enabled: !!warehouse,
    refetchOnWindowFocus: false,
  });
};
