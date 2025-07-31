import { getApiUrl } from "./client";
import { useMutation } from "@tanstack/react-query";
import { type RegisterCargoInput } from "@/types/cargo";

const transformCargoInputForApi = (input: RegisterCargoInput) => {
  return {
    ...input,
    entryDate: input.entryDate.toISOString(),
    exitDate: input.exitDate ? input.exitDate.toISOString() : null,
    flightDate: input.flightDate ? input.flightDate.toISOString() : undefined,
    arrivalDate: input.arrivalDate ? input.arrivalDate.toISOString() : undefined,
    departureDate: input.departureDate ? input.departureDate.toISOString() : undefined,
    lastInspectionDate: input.lastInspectionDate
      ? input.lastInspectionDate.toISOString()
      : undefined,

    documents: input.documents.map((doc) => ({
      fileUrl: doc.fileUrl,
      type: doc.type,
      metadata: {
        ...doc.metadata,
        fileInfo: {
          name: doc.file.name,
          size: doc.file.size,
          type: doc.file.type,
          lastModified: doc.file.lastModified,
        },
      },
    })),
  };
};


export const registerCargo = async (input: RegisterCargoInput) => {
  const transformed = transformCargoInputForApi(input);

  const response = await fetch(`${getApiUrl()}/cargo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transformed),
  });

  if (!response.ok) {
    throw new Error(`Error registering cargo: ${response.statusText}`);
  }

  return response.json();
};

export const useRegisterCargo = () => {
  return useMutation({
    mutationKey: ["registerCargo"],
    mutationFn: registerCargo,
    onError: (error) => {
      console.error("❌ Error registering cargo:", error);
    },
  });
};
