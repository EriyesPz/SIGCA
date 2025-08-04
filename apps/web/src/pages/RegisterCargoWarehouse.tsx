import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@/components/ui";
import {
  Package,
  Save,
  AlertCircle,
  Calendar,
  Weight,
  Hash,
  Search,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { LocationSelector } from "@/components/cargo/location-selector";
import type { CargoFormData } from "@/lib/types";
import { useGetCargo, useAssignCargoLocation } from "@/lib/cargo";
import { useCookies } from "react-cookie";
import type { CargoIdentifier } from "@/types/cargo";

export const RegisterCargoWarehouse = () => {
  const [identifier] = useState<CargoIdentifier>({
    trackingCode: "",
    qrcode: "",
    airWaybillNumber: "",
    houseAirWaybillNumber: "",
    id: "",
  });
  const [searchType, setSearchType] = useState<
    "trackingCode" | "qrcode" | "airWaybillNumber" | "houseAirWaybillNumber"
  >("trackingCode");
  const [cargoData, setCargoData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setAssigning] = useState(false);
  const [location, setLocation] = useState({
    warehouseId: "",
    rackId: "",
    levelId: "",
    columnId: "",
    level: 0,
    column: "",
  });
  const { mutateAsync: getCargo } = useGetCargo();
  const { mutateAsync: assign } = useAssignCargoLocation();
  const [cookies] = useCookies(["userId"]);
  const userId = cookies.userId;
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSubmitting] = useState(false);

  // Usar React Hook Form
  const {
    setValue,
    formState: { errors },
    watch,
  } = useForm<CargoFormData>({
    defaultValues: {
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
    },
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const updatedIdentifier = {
        ...identifier,
        [searchType]: searchValue.trim(),
      };

      const result = await getCargo(updatedIdentifier);

      if (result?.success && result?.cargo) {
        setCargoData(result.cargo);
        setSearchError("");
        // Actualizar campos del formulario con los datos encontrados
        setValue("trackingCode", result.cargo.trackingCode || "");
        setValue("description", result.cargo.description || "");
        setValue("weightKg", result.cargo.weightKg || 0);
        setValue("quantity", result.cargo.quantity || 1);
        setValue("entryDate", result.cargo.entryDate || "");
        setValue("exitDate", result.cargo.exitDate || "");
        setValue("isPerishable", result.cargo.isPerishable || false);
        setValue("status", result.cargo.status || "");
        setValue("documents", result.cargo.documents || []);
        setValue("createdBy", result.cargo.createdBy || userId || "");
      } else {
        setSearchError("Carga no encontrada.");
        toast({
          title: "Carga no encontrada",
          description: "Verifica los datos e intenta nuevamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[DEBUG] Error al buscar carga:", error);
      toast({
        title: "Error",
        description: "No se pudo encontrar la carga. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!cargoData) return;

    setAssigning(true);
    try {
      await assign({
        id: cargoData.id,
        ...location,
        movedBy: cargoData.createdBy,
      });

      alert("📦 Carga asignada exitosamente.");
    } catch (err) {
      console.error("Error assigning location:", err);
      alert("❌ No se pudo asignar ubicación.");
    } finally {
      setAssigning(false);
    }
  };

  const handleLocationChange = (
    warehouseId: string,
    rackId: string,
    level: number,
    column: string,
    levelId?: string,
    columnId?: string
  ) => {
    setLocation({
      warehouseId,
      rackId,
      level,
      column,
      levelId: levelId || "",
      columnId: columnId || "",
    });
    setValue("warehouseId", warehouseId);
    setValue("rackId", rackId);
    setValue("level", level);
    setValue("column", column);
    setValue("levelId", levelId || "");
    setValue("columnId", columnId || "");
  };

  const getSearchTypeLabel = () => {
    const labels = {
      trackingCode: "Código de Tracking",
      qrcode: "Código QR",
      airWaybillNumber: "AWB Number",
      houseAirWaybillNumber: "House AWB Number",
    };
    return labels[searchType];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canSubmit = () => {
    return (
      !!cargoData &&
      cargoData.createdBy &&
      location.warehouseId &&
      location.rackId &&
      location.levelId &&
      location.columnId
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
              Ingresar Carga al Almacén
            </h1>
          </div>
          <p className="text-gray-600">
            Complete la información para ingresar una nueva carga en el almacén
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cargo Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Busqueda de carga
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Tipo de busqueda
                    </Label>
                    <Select
                      value={searchType}
                      onValueChange={(value: any) => setSearchType(value)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trackingCode">
                          Código de Tracking
                        </SelectItem>
                        <SelectItem value="qrcode">Código QR</SelectItem>
                        <SelectItem value="airWaybillNumber">
                          AWB Number
                        </SelectItem>
                        <SelectItem value="houseAirWaybillNumber">
                          House AWB Number
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm font-medium">
                      Valor a Buscar
                    </Label>
                    <Input
                      placeholder={`Ingresa el ${getSearchTypeLabel().toLowerCase()}...`}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="h-10"
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearch}
                      disabled={loading}
                      className="w-full h-10"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Buscar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {searchError && (
                  <div className="flex items-center space-x-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información de Carga Encontrada */}
            {cargoData && (
              <Card className="shadow-sm border-green-200 dark:border-green-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <span>Información de Carga</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                      Encontrada
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Descripción
                        </Label>
                        <p className="text-foreground mt-1 font-medium">
                          {cargoData.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Cantidad
                          </Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {cargoData.quantity} unidades
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Peso
                          </Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Weight className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {cargoData.weightKg} kg
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Volumen
                        </Label>
                        <p className="font-medium mt-1">
                          {cargoData.volumeM3} m³
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Fecha de Entrada
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {formatDate(cargoData.entryDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Dimensiones
                        </Label>
                        <div className="mt-2 space-y-1">
                          <p>
                            <span className="text-muted-foreground">
                              Ancho:
                            </span>{" "}
                            <span className="font-medium">
                              {cargoData.dimensions.width} cm
                            </span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Alto:</span>{" "}
                            <span className="font-medium">
                              {cargoData.dimensions.height} cm
                            </span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Largo:
                            </span>{" "}
                            <span className="font-medium">
                              {cargoData.dimensions.length} cm
                            </span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          AWB Number
                        </Label>
                        <p className="font-mono text-sm bg-muted/30 px-3 py-2 rounded mt-1">
                          {cargoData.airWaybillNumber}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          House AWB Number
                        </Label>
                        <p className="font-mono text-sm bg-muted/30 px-3 py-2 rounded mt-1">
                          {cargoData.houseAirWaybillNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Assignment */}
            <LocationSelector
              warehouseId={watch("warehouseId")}
              rackId={watch("rackId")}
              level={watch("level")}
              column={watch("column").toString()}
              onLocationChange={handleLocationChange}
            />
            {errors.warehouseId && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                <AlertCircle className="w-3 h-3" />
                {errors.warehouseId.message}
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6"></div>
        </div>

        {/* Fixed Submit Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleAssign}
            disabled={!canSubmit() || isSubmitting}
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
