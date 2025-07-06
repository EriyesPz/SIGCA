"use client";

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

export const CargoRegistration = () => {
  const [formData, setFormData] = useState<CargoFormData>({
    trackingCode: "",
    description: "",
    status: "en tránsito",
    weightKg: 0,
    quantity: 1,
    entryDate: new Date().toISOString().slice(0, 16),
    isPerishable: false,
    warehouseId: "",
    rackId: "",
    level: 0,
    column: 0,
    documents: [],
    createdBy: "usuario@empresa.com",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.trackingCode.trim()) {
      newErrors.trackingCode = "El código de seguimiento es requerido";
    } else if (formData.trackingCode.length < 3) {
      newErrors.trackingCode = "El código debe tener al menos 3 caracteres";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }

    if (formData.weightKg <= 0) {
      newErrors.weightKg = "El peso debe ser mayor a 0";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0";
    }

    if (!formData.warehouseId) {
      newErrors.location = "Debe seleccionar una ubicación completa";
    }

    if (!formData.rackId) {
      newErrors.location = "Debe seleccionar una ubicación completa";
    }

    if (!formData.level || !formData.column) {
      newErrors.location = "Debe seleccionar una ubicación completa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Submitting cargo:", formData);

      toast({
        title: "¡Carga registrada exitosamente!",
        description: `Código de seguimiento: ${formData.trackingCode}`,
      });

      // Reset form
      setFormData({
        trackingCode: "",
        description: "",
        status: "en tránsito",
        weightKg: 0,
        quantity: 1,
        entryDate: new Date().toISOString().slice(0, 16),
        isPerishable: false,
        warehouseId: "",
        rackId: "",
        level: 0,
        column: 0,
        documents: [],
        createdBy: "usuario@empresa.com",
      });
      setShowPreview(false);
    } catch (error) {
      toast({
        title: "Error al registrar carga",
        description: "Hubo un problema al guardar la información",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates: Partial<CargoFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear related errors
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
    column: string
  ) => {
    updateFormData({ warehouseId, rackId, level, column: Number(column) });
    if (errors.location) {
      const newErrors = { ...errors };
      delete newErrors.location;
      setErrors(newErrors);
    }
  };

  const handleDocumentsChange = (documents: DocumentUploadType[]) => {
    updateFormData({ documents });
  };

  const isFormValid = () => {
    return (
      formData.trackingCode &&
      formData.description &&
      formData.weightKg > 0 &&
      formData.quantity > 0 &&
      formData.warehouseId &&
      formData.rackId &&
      formData.level &&
      formData.column
    );
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
                      onChange={(e) =>
                        updateFormData({
                          trackingCode: e.target.value.toUpperCase(),
                        })
                      }
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
                      onValueChange={(value) =>
                        updateFormData({
                          status: value as CargoFormData["status"],
                        })
                      }
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
                        onChange={(e) =>
                          updateFormData({
                            weightKg: Number.parseFloat(e.target.value) || 0,
                          })
                        }
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
                      onChange={(e) =>
                        updateFormData({
                          quantity: Number.parseInt(e.target.value) || 1,
                        })
                      }
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
                      onChange={(e) =>
                        updateFormData({ entryDate: e.target.value })
                      }
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
                      value={formData.entryDate}
                      onChange={(e) =>
                        updateFormData({ entryDate: e.target.value })
                      }
                    />
                  </div>

                  {/* Is Perishable */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPerishable"
                        checked={formData.isPerishable}
                        onCheckedChange={(checked) =>
                          updateFormData({ isPerishable: !!checked })
                        }
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
                    onChange={(e) =>
                      updateFormData({ description: e.target.value })
                    }
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
                    formData.level &&
                    formData.column ? (
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
