import { getApiUrl } from "./client";
import { useQuery } from "@tanstack/react-query";

export const getWarehouses = async (): Promise<any> => {
  try {
    const response = await fetch(`${getApiUrl()}/warehouses`);
    if (!response.ok) {
      throw new Error("Error fetching warehouses");
    }
    if (response.status === 204) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    throw error;
  }
};

export const useWarehouses = () => {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: getWarehouses,
    refetchOnWindowFocus: false,
  });
};
