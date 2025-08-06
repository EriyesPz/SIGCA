import { getApiUrl } from "./client";
import { useQuery } from "@tanstack/react-query";

const listUsers = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/users`);
    if (!response.ok) {
      throw new Error("Error fetching users");
    }
    return response.json();
  } catch (error) {
    console.error("Error in listUsers:", error);
    throw error;
  }
};

export const useListUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
