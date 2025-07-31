export const LocationStatus = {
  DISPONIBLE: "disponible",
  ALMACENADO: "almacenado",
  EN_TRANSITO: "en_transito",
  RESERVADO: "reservado",
  EN_MANTENIMIENTO: "en_mantenimiento"
} as const;

export type LocationStatus = typeof LocationStatus[keyof typeof LocationStatus];
