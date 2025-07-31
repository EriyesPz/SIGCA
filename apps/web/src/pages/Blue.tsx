import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
  Badge,
} from "@/components/ui";
import {
  Package,
  Save,
  CheckCircle,
  AlertCircle,
  Calendar,
  Weight,
  Hash,
  FileText,
  Snowflake,
  DollarSign,
  MapPin,
  Building,
  BarChart3,
  Clock,
  Shield,
  Thermometer,
  PlaneTakeoff,
  PlaneLanding,
  Plane,
  ShieldCheck,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DocumentUpload } from "@/components/cargo/document-upload";
import type { DocumentsCargo, RegisterCargo } from "@/types/cargo";
import { useRegisterCargo } from "@/lib/cargo";
import { useCookies } from "react-cookie";

export const CargoRegistrationWizard = () => {
  const [isSubmittingCargo, setIsSubmittingCargo] = useState(false);
  const [cookies] = useCookies(["userId"])

  const [cargoData, setCargoData] = useState<RegisterCargo>({
    trackingCode: "",
    description: "",
    status: "almacenado",
    weightKg: 0,
    quantity: 1,
    entryDate: new Date(),
    isPerishable: false,
    isHazardous: false,
    isHighValue: false,
    damageReported: false,
    shipper: {
      name: "",
      company: "",
      contact: "",
      phone: "",
      email: "",
      address: "",
    },
    consignee: {
      name: "",
      company: "",
      contact: "",
      phone: "",
      email: "",
      address: "",
    },
    documents: [],
    createdBy: "user_001",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const mutation = useRegisterCargo();

  const validateCargo = () => {
    const newErrors: Record<string, string> = {};
    if (!(cargoData.description ?? "").trim())
      newErrors.description = "La descripción es requerida";
    if (cargoData.weightKg <= 0)
      newErrors.weightKg = "El peso debe ser mayor a 0";
    if (cargoData.quantity <= 0)
      newErrors.quantity = "La cantidad debe ser mayor a 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCargoSubmit = async () => {
    if (!validateCargo()) return;
    setIsSubmittingCargo(true);

    try {

      const userId = cookies.userId

      if (!userId) {
        toast({
          title: "Error de sesión",
          description: "Por favor, inicia sesión para registrar la carga.",
          variant: "destructive",
        });
        return;
      }

      const transformedDocuments = cargoData.documents.map((doc) => ({
        fileUrl: doc.preview || "https://example.com/fallback.pdf",
        type: doc.type,
        file: doc.file,
        metadata: {
          ...doc.metadata,
          fileInfo: {
            fileName: doc.file?.name || "",
            fileSize: doc.file?.size || 0,
            fileType: doc.file?.type || "",
            fileLastModified: doc.file?.lastModified || 0,
          },
        },
      }));

      // Omitimos llaves foráneas
      const { warehouseId, rackId, levelId, columnId, createdBy, ...cargoToSend } =
        cargoData;

      const cargoInput = {
        ...cargoToSend,
        createdBy: userId,
        documents: transformedDocuments,
      };

      await mutation.mutateAsync(cargoInput);

      toast({
        title: "¡Carga registrada exitosamente!",
        description: `Código: ${cargoData.trackingCode} ha sido registrado`,
      });

      setCargoData({
        flightNumber: "",
        originAirport: "",
        destinationAirport: "",
        customsStatus: "",
        customsDeclarationNumber: "",
        insurancePolicyNumber: "",
        arrivalDate: undefined,
        departureDate: undefined,
        sealNumber: "",
        internalReference: "",
        trackingCode: "",
        description: "",
        status: "almacenado",
        weightKg: 0,
        quantity: 1,
        entryDate: new Date(),
        isPerishable: false,
        isHazardous: false,
        isHighValue: false,
        damageReported: false,
        shipper: {
          name: "",
          company: "",
          contact: "",
          phone: "",
          email: "",
          address: "",
        },
        consignee: {
          name: "",
          company: "",
          contact: "",
          phone: "",
          email: "",
          address: "",
        },
        documents: [],
      });
    } catch (error) {
      toast({
        title: "Error al registrar carga",
        description: "Hubo un problema al guardar la información",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingCargo(false);
    }
  };

  const updateCargoData = (updates: Partial<RegisterCargo>) => {
    setCargoData((prev) => ({ ...prev, ...updates }));
    const newErrors = { ...errors };
    Object.keys(updates).forEach((key) => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const handleDocumentsChange = (documents: DocumentsCargo[]) => {
    updateCargoData({ documents });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Card className="shadow-lg">
            <CardContent className="">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-blue-700 dark:text-white " />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Sistema de Gestión de Carga
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Registra nuevas cargas y asigna ubicaciones de almacén de
                    forma independiente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="shadow-lg">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Package className="w-6 h-6 text-blue-600" />
                  Información Básica de Carga
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Código de Seguimiento */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="airWaybillNumber"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Hash className="w-4 h-4 text-blue-600" />
                      Código de Seguimiento *
                    </Label>
                    <Input
                      id="airWaybillNumber"
                      type="text"
                      value={cargoData.trackingCode}
                      onChange={(e) =>
                        updateCargoData({ trackingCode: e.target.value })
                      }
                      placeholder="AWB123456"
                      className={errors.trackingCode ? "border-red-500" : ""}
                    />
                    {errors.trackingCode && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.trackingCode}
                      </p>
                    )}
                  </div>

                  {/* Número de Guía Aérea */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="houseAirWaybillNumber"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Hash className="w-4 h-4 text-blue-600" />
                      Número de Guía Aérea
                    </Label>
                    <Input
                      id="houseAirWaybillNumber"
                      type="text"
                      value={cargoData.houseAirWaybillNumber}
                      onChange={(e) =>
                        updateCargoData({
                          houseAirWaybillNumber: e.target.value,
                        })
                      }
                      placeholder="HWB123456"
                      className={
                        errors.houseAirWaybillNumber ? "border-red-500" : ""
                      }
                      required
                    />
                    {errors.houseAirWaybillNumber && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.houseAirWaybillNumber}
                      </p>
                    )}
                  </div>

                  {/* Número de Guía Maestra */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="masterAirWaybillNumber"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Hash className="w-4 h-4 text-blue-600" />
                      Número de Guía Maestra
                    </Label>
                    <Input
                      id="masterAirWaybillNumber"
                      type="text"
                      value={cargoData.masterAirWaybillNumber}
                      onChange={(e) =>
                        updateCargoData({
                          masterAirWaybillNumber: e.target.value,
                        })
                      }
                      placeholder="MAWB123456"
                      className={
                        errors.masterAirWaybillNumber ? "border-red-500" : ""
                      }
                      required
                    />
                    {errors.masterAirWaybillNumber && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.masterAirWaybillNumber}
                      </p>
                    )}
                  </div>

                  {/* Número de Manifiesto */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="manifestNumber"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Hash className="w-4 h-4 text-blue-600" />
                      Número de Manifiesto
                    </Label>
                    <Input
                      id="manifestNumber"
                      type="text"
                      value={cargoData.manifestNumber}
                      onChange={(e) =>
                        updateCargoData({ manifestNumber: e.target.value })
                      }
                      placeholder="MANIFEST123456"
                      className={errors.manifestNumber ? "border-red-500" : ""}
                      required
                    />
                    {errors.manifestNumber && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.manifestNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="weight"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Weight className="w-4 h-4 text-blue-600" />
                      Peso (kg) *
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={cargoData.weightKg || ""}
                      onChange={(e) =>
                        updateCargoData({
                          weightKg: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.0"
                      className={`${errors.weightKg ? "border-red-500" : ""}`}
                    />
                    {errors.weightKg && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.weightKg}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-base font-medium">
                      Cantidad *
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={cargoData.quantity || ""}
                      onChange={(e) =>
                        updateCargoData({
                          quantity: Number.parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder="1"
                      className={`${errors.quantity ? "border-red-500" : ""}`}
                    />
                    {errors.quantity && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="entryDate"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Fecha de Entrada
                    </Label>
                    <Input
                      id="entryDate"
                      type="datetime-local"
                      value={
                        cargoData.entryDate?.toISOString().slice(0, 16) || ""
                      }
                      onChange={(e) =>
                        updateCargoData({
                          entryDate: new Date(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volumeM3" className="text-base font-medium">
                      Volumen (m³)
                    </Label>
                    <Input
                      id="volumeM3"
                      type="number"
                      step="0.01"
                      min="0"
                      value={cargoData.volumenm3 || ""}
                      onChange={(e) =>
                        updateCargoData({
                          volumenm3:
                            Number.parseFloat(e.target.value) || undefined,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Dimensiones */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="length" className="text-base font-medium">
                      Largo (cm)
                    </Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      min="0"
                      value={cargoData.dimensions?.length || ""}
                      onChange={(e) =>
                        updateCargoData({
                          dimensions: {
                            ...cargoData.dimensions,
                            length:
                              Number.parseFloat(e.target.value) || undefined,
                          },
                        })
                      }
                      placeholder="0.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-base font-medium">
                      Ancho (cm)
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      min="0"
                      value={cargoData.dimensions?.width || ""}
                      onChange={(e) =>
                        updateCargoData({
                          dimensions: {
                            ...cargoData.dimensions,
                            width:
                              Number.parseFloat(e.target.value) || undefined,
                          },
                        })
                      }
                      placeholder="0.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-base font-medium">
                      Alto (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      min="0"
                      value={cargoData.dimensions?.height || ""}
                      onChange={(e) =>
                        updateCargoData({
                          dimensions: {
                            ...cargoData.dimensions,
                            height:
                              Number.parseFloat(e.target.value) || undefined,
                          },
                        })
                      }
                      placeholder="0.0"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2 text-base font-medium"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    Descripción *
                  </Label>
                  <Textarea
                    id="description"
                    value={cargoData.description}
                    onChange={(e) =>
                      updateCargoData({ description: e.target.value })
                    }
                    placeholder="Describe el contenido de la carga..."
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="isPerishable"
                        checked={cargoData.isPerishable}
                        onCheckedChange={(checked) =>
                          updateCargoData({ isPerishable: !!checked })
                        }
                        className="w-5 h-5"
                      />
                      <Label
                        htmlFor="isPerishable"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Snowflake className="w-5 h-5 text-blue-600" />
                        Perecedero
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-8">
                      Requiere refrigeración
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="isHazardousMaterial"
                        checked={cargoData.isHazardous}
                        onCheckedChange={(checked) =>
                          updateCargoData({ isHazardous: !!checked })
                        }
                        className="w-5 h-5"
                      />
                      <Label
                        htmlFor="isHazardousMaterial"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-5 h-5 text-red-600" />
                        Material Peligroso
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-8">
                      Manejo especial requerido
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="isHighValue"
                        checked={cargoData.isHighValue}
                        onCheckedChange={(checked) =>
                          updateCargoData({ isHighValue: !!checked })
                        }
                        className="w-5 h-5"
                      />
                      <Label
                        htmlFor="isHighValue"
                        className="flex items-center gap-2 font-medium"
                      >
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Alto Valor
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-8">
                      Seguridad adicional
                    </p>
                  </div>
                </div>

                {/* Conditional Fields */}
                {(cargoData.isHighValue || cargoData.isPerishable) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    {cargoData.isHighValue && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="declaredValueUSD"
                          className="flex items-center gap-2"
                        >
                          <DollarSign className="w-4 h-4 text-green-600" />
                          Valor Declarado (USD)
                        </Label>
                        <Input
                          id="declaredValueUSD"
                          type="number"
                          step="0.01"
                          min="0"
                          value={cargoData.declaredValue || ""}
                          onChange={(e) =>
                            updateCargoData({
                              declaredValue:
                                Number.parseFloat(e.target.value) || undefined,
                            })
                          }
                          placeholder="0.00"
                          className="h-12"
                        />
                      </div>
                    )}

                    {cargoData.isPerishable && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="temperatureRequirement"
                          className="flex items-center gap-2"
                        >
                          <Thermometer className="w-4 h-4 text-blue-600" />
                          Requerimiento de Temperatura
                        </Label>
                        <Input
                          id="temperatureRequirement"
                          value={cargoData.temperatureRequirement || ""}
                          onChange={(e) =>
                            updateCargoData({
                              temperatureRequirement: e.target.value,
                            })
                          }
                          placeholder="2-8°C"
                          className="h-12"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Flight Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Número de Vuelo */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="flightNumber"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Plane className="w-4 h-4 text-blue-600" />
                      Número de Vuelo
                    </Label>
                    <Input
                      id="flightNumber"
                      type="text"
                      value={cargoData.flightNumber}
                      onChange={(e) =>
                        updateCargoData({ flightNumber: e.target.value })
                      }
                      placeholder="HND321"
                      className={errors.flightNumber ? "border-red-500" : ""}
                    />
                    {errors.flightNumber && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.flightNumber}
                      </p>
                    )}
                  </div>

                  {/* Fecha de Vuelo */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="flightDate"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Fecha de Vuelo
                    </Label>
                    <Input
                      id="flightDate"
                      type="datetime-local"
                      value={
                        cargoData.flightDate?.toISOString().slice(0, 16) || ""
                      }
                      onChange={(e) =>
                        updateCargoData({
                          flightDate: new Date(e.target.value),
                        })
                      }
                    />
                    {errors.flightDate && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.flightDate}
                      </p>
                    )}
                  </div>

                  {/* Aeropuerto de Origen */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="originAirport"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <PlaneTakeoff className="w-4 h-4 text-blue-600" />
                      Aeropuerto de Origen
                    </Label>
                    <Input
                      id="originAirport"
                      type="text"
                      value={cargoData.originAirport}
                      onChange={(e) =>
                        updateCargoData({ originAirport: e.target.value })
                      }
                      placeholder="MIA"
                      className={errors.originAirport ? "border-red-500" : ""}
                    />
                    {errors.originAirport && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.originAirport}
                      </p>
                    )}
                  </div>

                  {/* Aeropuerto de Destino */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="destinationAirport"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <PlaneLanding className="w-4 h-4 text-blue-600" />
                      Aeropuerto de Destino
                    </Label>
                    <Input
                      id="destinationAirport"
                      type="text"
                      value={cargoData.destinationAirport}
                      onChange={(e) =>
                        updateCargoData({
                          destinationAirport: e.target.value,
                        })
                      }
                      placeholder="TGU"
                      className={
                        errors.destinationAirport ? "border-red-500" : ""
                      }
                    />
                    {errors.destinationAirport && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.destinationAirport}
                      </p>
                    )}
                  </div>

                  {/* Estado de Aduanas */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="customsStatus"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Estado de Aduanas
                    </Label>
                    <Input
                      id="customsStatus"
                      type="text"
                      value={cargoData.customsStatus}
                      onChange={(e) =>
                        updateCargoData({ customsStatus: e.target.value })
                      }
                      placeholder="Pending"
                      className={errors.customsStatus ? "border-red-500" : ""}
                    />
                    {errors.customsStatus && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.customsStatus}
                      </p>
                    )}
                  </div>

                  {/* Número de Declaración Aduanera */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="customsDeclarationNumber"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      Nº Declaración Aduanera
                    </Label>
                    <Input
                      id="customsDeclarationNumber"
                      type="text"
                      value={cargoData.customsDeclarationNumber}
                      onChange={(e) =>
                        updateCargoData({
                          customsDeclarationNumber: e.target.value,
                        })
                      }
                      placeholder="DECL-78910"
                      className={
                        errors.customsDeclarationNumber ? "border-red-500" : ""
                      }
                    />
                    {errors.customsDeclarationNumber && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.customsDeclarationNumber}
                      </p>
                    )}
                  </div>

                  {/* Número de Póliza de Seguro */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="insurancePolicyNumber"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Shield className="w-4 h-4 text-blue-600" />
                      Nº de Póliza de Seguro
                    </Label>
                    <Input
                      id="insurancePolicyNumber"
                      type="text"
                      value={cargoData.insurancePolicyNumber}
                      onChange={(e) =>
                        updateCargoData({
                          insurancePolicyNumber: e.target.value,
                        })
                      }
                      placeholder="INS-456789"
                      className={
                        errors.insurancePolicyNumber ? "border-red-500" : ""
                      }
                    />
                    {errors.insurancePolicyNumber && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.insurancePolicyNumber}
                      </p>
                    )}
                  </div>

                  {/* Fecha de Salida */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="departureDate"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Clock className="w-4 h-4 text-blue-600" />
                      Fecha de Salida
                    </Label>
                    <Input
                      id="departureDate"
                      type="datetime-local"
                      value={
                        cargoData.departureDate?.toISOString().slice(0, 16) ||
                        ""
                      }
                      onChange={(e) =>
                        updateCargoData({
                          departureDate: new Date(e.target.value),
                        })
                      }
                    />
                    {errors.departureDate && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.departureDate}
                      </p>
                    )}
                  </div>

                  {/* Fecha de Llegada */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="arrivalDate"
                      className="flex items-center gap-2 text-base font-medium"
                    >
                      <Clock className="w-4 h-4 text-blue-600" />
                      Fecha de Llegada
                    </Label>
                    <Input
                      id="arrivalDate"
                      type="datetime-local"
                      value={
                        cargoData.arrivalDate?.toISOString().slice(0, 16) || ""
                      }
                      onChange={(e) =>
                        updateCargoData({
                          arrivalDate: new Date(e.target.value),
                        })
                      }
                    />
                    {errors.arrivalDate && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.arrivalDate}
                      </p>
                    )}
                  </div>
                </div>
                {/* Remitente */}

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Remitente</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="shipperName"
                        className="flex items-center gap-2 font-medium"
                      >
                        <User className="w-4 h-4" />
                        Nombre
                      </Label>
                      <Input
                        id="shipperName"
                        type="text"
                        value={cargoData.shipper?.name || ""}
                        onChange={(e) =>
                          updateCargoData({
                            shipper: {
                              ...cargoData.shipper,
                              name: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Nombre del remitente"
                      />
                    </div>

                    {/* Correo */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="shipperEmail"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Mail className="w-4 h-4 text-blue-600" />
                        Correo Electrónico
                      </Label>
                      <Input
                        id="shipperEmail"
                        type="email"
                        value={cargoData.shipper?.email || ""}
                        onChange={(e) =>
                          updateCargoData({
                            shipper: {
                              ...cargoData.shipper,
                              email: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Correo del remitente"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="shipperPhone"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        Teléfono
                      </Label>
                      <Input
                        id="shipperPhone"
                        type="tel"
                        value={cargoData.shipper?.phone || ""}
                        onChange={(e) =>
                          updateCargoData({
                            shipper: {
                              ...cargoData.shipper,
                              phone: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Teléfono del remitente"
                      />
                    </div>

                    {/* Dirección */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="shipperAddress"
                        className="flex items-center gap-2 font-medium"
                      >
                        <MapPin className="w-4 h-4 text-blue-600" />
                        Dirección
                      </Label>
                      <Input
                        id="shipperAddress"
                        type="text"
                        value={cargoData.shipper?.address || ""}
                        onChange={(e) =>
                          updateCargoData({
                            shipper: {
                              ...cargoData.shipper,
                              address: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Dirección del remitente"
                      />
                    </div>

                    {/* Empresa */}
                    <div className="space-y-1 md:col-span-2">
                      <Label
                        htmlFor="shipperCompany"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Building className="w-4 h-4 text-blue-600" />
                        Empresa
                      </Label>
                      <Input
                        id="shipperCompany"
                        type="text"
                        value={cargoData.shipper?.company || ""}
                        onChange={(e) =>
                          updateCargoData({
                            shipper: {
                              ...cargoData.shipper,
                              company: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Empresa del remitente"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Destinatario</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="consigneeName"
                        className="flex items-center gap-2 font-medium"
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        Nombre
                      </Label>
                      <Input
                        id="consigneeName"
                        type="text"
                        value={cargoData.consignee?.name || ""}
                        onChange={(e) =>
                          updateCargoData({
                            consignee: {
                              ...cargoData.consignee,
                              name: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Nombre del destinatario"
                      />
                    </div>

                    {/* Correo */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="consigneeEmail"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Mail className="w-4 h-4 text-blue-600" />
                        Correo Electrónico
                      </Label>
                      <Input
                        id="consigneeEmail"
                        type="email"
                        value={cargoData.consignee?.email || ""}
                        onChange={(e) =>
                          updateCargoData({
                            consignee: {
                              ...cargoData.consignee,
                              email: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Correo del destinatario"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="consigneePhone"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        Teléfono
                      </Label>
                      <Input
                        id="consigneePhone"
                        type="tel"
                        value={cargoData.consignee?.phone || ""}
                        onChange={(e) =>
                          updateCargoData({
                            consignee: {
                              ...cargoData.consignee,
                              phone: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Teléfono del destinatario"
                      />
                    </div>

                    {/* Dirección */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="consigneeAddress"
                        className="flex items-center gap-2 font-medium"
                      >
                        <MapPin className="w-4 h-4 text-blue-600" />
                        Dirección
                      </Label>
                      <Input
                        id="consigneeAddress"
                        type="text"
                        value={cargoData.consignee?.address || ""}
                        onChange={(e) =>
                          updateCargoData({
                            consignee: {
                              ...cargoData.consignee,
                              address: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Dirección del destinatario"
                      />
                    </div>

                    {/* Empresa */}
                    <div className="space-y-1 md:col-span-2">
                      <Label
                        htmlFor="consigneeCompany"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Building className="w-4 h-4 text-blue-600" />
                        Empresa
                      </Label>
                      <Input
                        id="consigneeCompany"
                        type="text"
                        value={cargoData.consignee?.company || ""}
                        onChange={(e) =>
                          updateCargoData({
                            consignee: {
                              ...cargoData.consignee,
                              company: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Empresa del destinatario"
                      />
                    </div>

                    {/* Persona de contacto */}
                    <div className="space-y-1 md:col-span-2">
                      <Label
                        htmlFor="consigneeContact"
                        className="flex items-center gap-2 font-medium"
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        Persona de Contacto
                      </Label>
                      <Input
                        id="consigneeContact"
                        type="text"
                        value={cargoData.consignee?.contact || ""}
                        onChange={(e) =>
                          updateCargoData({
                            consignee: {
                              ...cargoData.consignee,
                              contact: e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Persona de contacto"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <DocumentUpload
              documents={cargoData.documents}
              onDocumentsChange={handleDocumentsChange}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Estado del Registro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">
                      Información básica
                    </span>
                    {cargoData.trackingCode &&
                    cargoData.description &&
                    cargoData.weightKg > 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Documentos</span>
                    <Badge variant="outline">
                      {cargoData.documents.length} archivos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">
                      Código:
                    </span>
                    <p className="font-mono font-bold text-lg">
                      {cargoData.trackingCode || "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">
                      Peso:
                    </span>
                    <p className="font-semibold">
                      {cargoData.weightKg ? `${cargoData.weightKg} kg` : "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">
                      Cantidad:
                    </span>
                    <p className="font-semibold">{cargoData.quantity || "—"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">
                      Estado:
                    </span>
                    <Badge className="mt-1">{cargoData.status || "—"}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleCargoSubmit}
              disabled={isSubmittingCargo}
              size="lg"
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmittingCargo ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-3" />
                  Registrar Carga
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
