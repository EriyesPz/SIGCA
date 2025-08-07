import { getApiUrl } from "./client";
import { useQuery } from "@tanstack/react-query";

export const fetchDashboardData = async () => {
  const response = await fetch(`${getApiUrl()}/dashboard`);
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return response.json();
};

export const useDashboardData = () => {
    return useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    refetchOnWindowFocus: false,
    retry: 1,
    })
}
