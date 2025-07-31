export type CargoStatus =
  | "almacenado"
  | "en_revision"
  | "liberado"
  | "en_transito"
  | "devolucion"
  | "reingreso"
  | "rechazado"
  | "correccion"
  | "entregada"
  | "trasnferencia"
  | "daniado"
  | "retenido"
  | "en_espera"
  | "preparando_entrega"
  | "extraviado"
  | "en_auditoria"
  | "no_conforme";

export const CargoStatusValues = {
  ALMACENADO: "almacenado",
  EN_REVISION: "en_revision",
  LIBERADO: "liberado",
  EN_TRANSITO: "en_transito",
  DEVOLUCION: "devolucion",
  REINGRESO: "reingreso",
  RECHAZADO: "rechazado",
  CORRECCION: "correccion",
  ENTREGADA: "entregada",
  TRASNFERENCIA: "trasnferencia",
  DANIADO: "daniado",
  RETENIDO: "retenido",
  EN_ESPERA: "en_espera",
  PREPARANDO_ENTREGA: "preparando_entrega",
  EXTRAVIADO: "extraviado",
  EN_AUDITORIA: "en_auditoria",
  NO_CONFORME: "no_conforme",
} as const;

export interface DimensionCargo {
  length?: number;
  width?: number;
  height?: number;
}

export interface ShipperCargo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  contact?: string;
}

export interface ConsigneeCargo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  contact?: string;
}

export interface DocumentsCargo {
  id: string
  file: File
  type: "invoice" | "certificate" | "photo" | "other"
  metadata: Record<string, string>
  preview?: string
}


export interface RegisterCargo {
  id?: string;
  trackingCode?: string;
  qrcode?: string;
  description?: string;
  status: CargoStatus;
  weightKg: number;
  volumenm3?: number;
  quantity: number;
  entryDate: Date;
  exitDate?: Date | null;
  dimensions?: DimensionCargo;
  isPerishable: boolean;
  isHazardous?: boolean;
  isHighValue?: boolean;
  declaredValue?: number;
  temperatureRequirement?: string;
  handlingInstructions?: string;

  // Logística
  airWaybillNumber?: string;
  houseAirWaybillNumber?: string;
  masterAirWaybillNumber?: string;
  manifestNumber?: string;
  flightNumber?: string;
  flightDate?: Date;
  originAirport?: string;
  destinationAirport?: string;
  customsStatus?: string;
  customsDeclarationNumber?: string;
  insurancePolicyNumber?: string;
  arrivalDate?: Date;
  departureDate?: Date;
  sealNumber?: string;
  internalReference?: string;
  lastInspectionDate?: Date;
  damageReported?: boolean;
  damageDescription?: string;
  cargoType?: string;
  containerNumber?: string;
  uldNumber?: string;

  // JSON
  shipper?: ShipperCargo;
  consignee?: ConsigneeCargo;

  // Ubicación
  warehouseId?: string | null;
  rackId?: string | null;
  levelId?: string | null;
  columnId?: string | null;

  // Meta
  createdBy: string;

  // Documentos
  documents: DocumentsCargo[];
}


export const CargoStatusList = Object.values(CargoStatusValues);

export interface ExtendedDocumentsCargo {
  id: string;
  file: File;
  fileUrl: string;
  type: "invoice" | "certificate" | "photo" | "other";
  metadata: Record<string, any>;
  preview?: string;
}

// types/cargo.ts

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileLastModified: number;
}

export interface RegisterCargoInput extends Omit<RegisterCargo, "documents"> {
  documents: {
    file: File;
    fileUrl: string;
    type: "invoice" | "certificate" | "photo" | "other";
    metadata: {
      fileInfo?: FileMetadata;
      [key: string]: any;
    };
  }[];
}
