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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import {
  Package,
  Save,
  Eye,
  Code,
  AlertCircle,
  CheckCircle,
  Calendar,
  Weight,
  Hash,
  FileText,
  Snowflake,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { LocationSelector } from "@/components/cargo/location-selector";
import { DocumentUpload } from "@/components/cargo/document-upload";
import { CargoPreview } from "@/components/cargo/cargo-preview";
import { statusOptions } from "@/data/warehouse-data";
import type {
  CargoFormData,
  DocumentUpload as DocumentUploadType,
  RegisterCargoInput,
} from "@/lib/types";
import { useRegisterCargo } from "@/lib/cargo";
import { useCookies } from "react-cookie";
import { z } from "zod";

const cargoSchema = z.object({
  trackingCode: z.string().min(3, "El código debe tener al menos 3 caracteres"),
  description: z.string().min(1, "La descripción es requerida"),
  status: z.string(),
  weightKg: z.number().gt(0, "El peso debe ser mayor a 0"),
  quantity: z.number().gt(0, "La cantidad debe ser mayor a 0"),
  entryDate: z.string(),
  exitDate: z.string().optional().nullable(),
  isPerishable: z.boolean(),
  warehouseId: z.string().min(1, "Debe seleccionar una ubicación completa"),
  rackId: z.string().min(1, "Debe seleccionar una ubicación completa"),
  level: z.number().gt(0, "Debe seleccionar una ubicación completa"),
  column: z.string().min(1, "Debe seleccionar una ubicación completa"),
  documents: z.array(z.any()).optional(),
});

export const RegisterCargoWarehouse = () => {
  const [cookies] = useCookies(["userId"]);
  const userId = cookies.userId;
  console.log("[DEBUG] Renderizando RegisterCargoWarehouse");
  const [formData, setFormData] = useState<CargoFormData>({
    trackingCode: "",
    description: "",
    status: "",
    weightKg: 0,
    quantity: 1,
    entryDate: new Date().toISOString().slice(0, 16),
    exitDate: "",
    isPerishable: false,
    warehouseId: "",
    rackId: "",
    level: 0,
    column: "",
    levelId: "",
    columnId: "",
    documents: [],
    createdBy: userId || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setShowPreview] = useState(false);
  const { mutate} = useRegisterCargo();

  const handleSubmit = () => {
    console.log("[DEBUG] handleSubmit llamado", formData);
    const parsed = cargoSchema.safeParse(formData);
    if (!parsed.success) {
      const zodErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          zodErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(zodErrors);
      toast({
        title: "Error de validación",
        description: "Por favor, corrija los errores en el formulario.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Validación adicional de fechas
    const entry = new Date(formData.entryDate);
    const exit = formData.exitDate ? new Date(formData.exitDate) : null;

    if (exit && exit < entry) {
      toast({
        title: "Error en las fechas",
        description: "La fecha de salida debe ser posterior a la de entrada.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const input: RegisterCargoInput = {
      ...formData,
      entryDate: entry,
      exitDate: exit,
      columnId: formData.columnId.toString(),
      levelId: formData.levelId.toString(),
      createdBy: userId || "",
    };

    console.log("[DEBUG] Enviando datos a mutate:", input);

    mutate(input, {
      onSuccess: () => {
        console.log("[DEBUG] Registro exitoso");
        toast({
          title: "¡Carga registrada exitosamente!",
          description: `Código de seguimiento: ${formData.trackingCode}`,
        });
        setFormData({
          trackingCode: "",
          description: "",
          status: "almacenado",
          weightKg: 0,
          quantity: 1,
          entryDate: new Date().toISOString().slice(0, 16),
          exitDate: "",
          isPerishable: false,
          warehouseId: "",
          rackId: "",
          level: 0,
          column: "",
          levelId: "",
          columnId: "",
          documents: [],
          createdBy: userId || "",
        });
        setShowPreview(false);
      },
      onError: (error: any) => {
        console.error("[DEBUG] Error al registrar carga:", error);
        toast({
          title: "Error al registrar carga",
          description:
            error?.message || "Hubo un problema al guardar la información",
          variant: "destructive",
        });
      },
      onSettled: () => {
        console.log("[DEBUG] onSettled llamado");
        setIsSubmitting(false);
      },
    });
  };

  const updateFormData = (updates: Partial<CargoFormData>) => {
    console.log("[DEBUG] updateFormData llamado con:", updates);
    setFormData((prev) => {
      const updated = { ...prev, ...updates };
      console.log("[DEBUG] Nuevo formData:", updated);
      return updated;
    });
    const newErrors = { ...errors };
    Object.keys(updates).forEach((key) => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const handleLocationChange = (
    warehouseId: string,
    rackId: string,
    level: number,
    column: string,
    levelId?: string,
    columnId?: string
  ) => {
    console.log("[DEBUG] handleLocationChange:", {
      warehouseId,
      rackId,
      level,
      column,
      levelId,
      columnId,
    });
    updateFormData({
      warehouseId,
      rackId,
      level,
      column,
      levelId: levelId || "",
      columnId: columnId || "",
    });
    if (errors.location) {
      const newErrors = { ...errors };
      delete newErrors.location;
      setErrors(newErrors);
    }
  };

  const handleDocumentsChange = (documents: DocumentUploadType[]) => {
    console.log("[DEBUG] handleDocumentsChange:", documents);
    updateFormData({ documents });
  };

  const isFormValid = () => {
    const valid =
      formData.trackingCode &&
      formData.description &&
      formData.weightKg > 0 &&
      formData.quantity > 0 &&
      formData.warehouseId &&
      formData.rackId &&
      formData.level &&
      formData.column;
    console.log("[DEBUG] isFormValid:", valid);
    return valid;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Registro de Nueva Carga
            </h1>
          </div>
          <p className="text-gray-600">
            Complete la información para registrar una nueva carga en el almacén
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cargo Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Información de Carga
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tracking Code */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="trackingCode"
                      className="flex items-center gap-2"
                    >
                      <Hash className="w-4 h-4" />
                      Código de Seguimiento *
                    </Label>
                    <Input
                      id="trackingCode"
                      value={formData.trackingCode}
                      onChange={(e) => {
                        console.log(
                          "[DEBUG] trackingCode cambiado:",
                          e.target.value
                        );
                        updateFormData({
                          trackingCode: e.target.value.toUpperCase(),
                        });
                      }}
                      placeholder="TRK-2024-001"
                      className={errors.trackingCode ? "border-red-500" : ""}
                    />
                    {errors.trackingCode && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.trackingCode}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => {
                        console.log("[DEBUG] status cambiado:", value);
                        updateFormData({
                          status: value as CargoFormData["status"],
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${status.color}`}
                              />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Weight className="w-4 h-4" />
                      Peso (kg) *
                    </Label>
                    <div className="relative">
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.weightKg || ""}
                        onChange={(e) => {
                          console.log(
                            "[DEBUG] weightKg cambiado:",
                            e.target.value
                          );
                          updateFormData({
                            weightKg: Number.parseFloat(e.target.value) || 0,
                          });
                        }}
                        placeholder="0.0"
                        className={`pr-12 ${
                          errors.weightKg ? "border-red-500" : ""
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        kg
                      </span>
                    </div>
                    {errors.weightKg && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.weightKg}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Cantidad *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity || ""}
                      onChange={(e) => {
                        console.log(
                          "[DEBUG] quantity cambiado:",
                          e.target.value
                        );
                        updateFormData({
                          quantity: Number.parseInt(e.target.value) || 1,
                        });
                      }}
                      placeholder="1"
                      className={errors.quantity ? "border-red-500" : ""}
                    />
                    {errors.quantity && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  {/* Entry Date */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="entryDate"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Fecha de Entrada
                    </Label>
                    <Input
                      id="entryDate"
                      type="datetime-local"
                      value={formData.entryDate}
                      onChange={(e) => {
                        console.log(
                          "[DEBUG] entryDate cambiado:",
                          e.target.value
                        );
                        updateFormData({ entryDate: e.target.value });
                      }}
                    />
                  </div>

                  {/* Exit Date */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="exitDate"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Fecha de Salida
                    </Label>
                    <Input
                      id="exitDate"
                      type="datetime-local"
                      value={formData.exitDate || ""}
                      onChange={(e) => {
                        console.log(
                          "[DEBUG] exitDate cambiado:",
                          e.target.value
                        );
                        updateFormData({ exitDate: e.target.value });
                      }}
                    />
                  </div>

                  {/* Is Perishable */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPerishable"
                        checked={formData.isPerishable}
                        onCheckedChange={(checked) => {
                          console.log(
                            "[DEBUG] isPerishable cambiado:",
                            checked
                          );
                          updateFormData({ isPerishable: !!checked });
                        }}
                      />
                      <Label
                        htmlFor="isPerishable"
                        className="flex items-center gap-2"
                      >
                        <Snowflake className="w-4 h-4" />
                        Producto Perecedero
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Descripción *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => {
                      console.log(
                        "[DEBUG] description cambiado:",
                        e.target.value
                      );
                      updateFormData({ description: e.target.value });
                    }}
                    placeholder="Describe el contenido de la carga..."
                    rows={3}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Assignment */}
            <LocationSelector
              warehouseId={formData.warehouseId}
              rackId={formData.rackId}
              level={formData.level}
              column={formData.column.toString()}
              onLocationChange={handleLocationChange}
            />
            {errors.location && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                <AlertCircle className="w-3 h-3" />
                {errors.location}
              </p>
            )}

            {/* Document Upload */}
            <DocumentUpload
              documents={formData.documents}
              onDocumentsChange={handleDocumentsChange}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Form Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado del Formulario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Información básica</span>
                    {formData.trackingCode &&
                    formData.description &&
                    formData.weightKg > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ubicación asignada</span>
                    {formData.warehouseId &&
                    formData.rackId &&
                    formData.level !== 0 &&
                    formData.column !== "" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documentos</span>
                    <Badge variant="outline">
                      {formData.documents.length} archivos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="preview"
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Vista
                    </TabsTrigger>
                    <TabsTrigger
                      value="json"
                      className="flex items-center gap-1"
                    >
                      <Code className="w-3 h-3" />
                      JSON
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="mt-4">
                    <CargoPreview formData={formData} />
                  </TabsContent>
                  <TabsContent value="json" className="mt-4">
                    <CargoPreview formData={formData} showJson />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fixed Submit Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Carga
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
