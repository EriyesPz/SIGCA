import { getApiUrl } from "./client";
import { useQuery } from "@tanstack/react-query";

const getLocations = async (): Promise<any> => {
  const response = await fetch(`${getApiUrl()}/locations`);
  if (!response.ok) {
    throw new Error("Error fetching locations");
  }
  return response.json();
};

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });
}
