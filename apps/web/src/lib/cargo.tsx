import { getApiUrl } from "./client";
import { useMutation } from "@tanstack/react-query";
import { type RegisterCargoInput } from "./types";

export const registerCargo = async (input: RegisterCargoInput) => {
  const response = await fetch(`${getApiUrl()}/cargo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Error registering cargo: ${response.statusText}`);
  }

  return response.json();
}

export const useRegisterCargo = () => {
  return useMutation({
    mutationKey: ["registerCargo"],
    mutationFn: registerCargo,
    onError: (error) => {
      console.error("Error registering cargo:", error);
    },
  });
}