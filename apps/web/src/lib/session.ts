import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "./client";

export const sessionsLogs = async () => {
  const response = await fetch(`${getApiUrl()}/api/sessions`);

  if (!response.ok) {
    throw new Error("Error al obtener las sesiones y los logs");
  }
  return response.json();
};

export const useSessionsLogs = () => {
  return useQuery({
    queryKey: ["sessions-logs"],
    queryFn: sessionsLogs,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
