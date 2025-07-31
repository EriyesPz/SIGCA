import { z } from "zod";
import { CargoStatus } from "../types/cargo";

export const dimensionSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().optional(),
  company: z.string().optional(),
  contact: z.string().optional(),
});

export const documentSchema = z.object({
  fileUrl: z.string().url().optional(),
  type: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

export const registerCargoSchema = z.object({
  id: z.string().min(1).optional(),
  trackingNumber: z.string().min(1).optional(),
  qrcode: z.string().optional(),
  description: z.string().min(1),
  status: z.nativeEnum(CargoStatus),
  weightKg: z.number().positive(),
  volumenm3: z.number().positive().optional(),
  quantity: z.number().int().positive(),
  entryDate: z.coerce.date(),
  exitDate: z.coerce.date().optional().nullable(),
  dimensions: dimensionSchema.optional(),
  isPerishable: z.boolean(),
  isHazardous: z.boolean().optional(),
  isHighValue: z.boolean().optional(),
  declaredValue: z.number().optional(),
  temperatureRequirement: z.string().optional(),
  handlingInstructions: z.string().optional(),

  airWaybillNumber: z.string().optional(),
  houseAirWaybillNumber: z.string().optional(),
  masterAirWaybillNumber: z.string().optional(),
  manifestNumber: z.string().optional(),
  flightNumber: z.string().optional(),
  flightDate: z.coerce.date().optional(),
  originAirport: z.string().optional(),
  destinationAirport: z.string().optional(),
  customsStatus: z.string().optional(),
  customsDeclarationNumber: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  arrivalDate: z.coerce.date().optional(),
  departureDate: z.coerce.date().optional(),
  sealNumber: z.string().optional(),
  internalReference: z.string().optional(),
  lastInspectionDate: z.coerce.date().optional(),
  damageReported: z.boolean().optional(),
  damageDescription: z.string().optional().nullable(),

  cargoType: z.string().optional(),
  containerNumber: z.string().optional(),
  uldNumber: z.string().optional(),

  shipper: contactSchema.optional(),
  consignee: contactSchema.optional(),

  warehouseId: z.string().min(1).optional().nullable(),
  rackId: z.string().min(1).optional().nullable(),
  levelId: z.string().min(1).optional().nullable(),
  columnId: z.string().min(1).optional().nullable(),
  createdBy: z.string().min(1),

  documents: z.array(documentSchema),
});
