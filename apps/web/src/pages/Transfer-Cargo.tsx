"use client";

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
  Textarea
} from "@/components/ui";
import {
  Package,
  Save,
  AlertCircle,
  Calendar,
  Weight,
  Hash,
  Search,
  ArrowRightLeft,
  Warehouse,
  PanelTopClose,
  Rows3,
  Columns3,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { type TransferCargoType, type CargoIdentifier } from "@/types/cargo";
import { useGetCargo, useTransferCargo } from "@/lib/cargo";
import { type CargoFormData } from "@/lib/types";
import { LocationSelector } from "@/components/cargo/location-selector";

export const TransferCargo = () => {
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
  const { mutateAsync: getCargo } = useGetCargo();
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [location, setLocation] = useState({
    warehouseId: "",
    rackId: "",
    levelId: "",
    columnId: "",
    level: 0,
    column: "",
  });
  const { mutateAsync: transferCargo } = useTransferCargo();

  const {
    register,
    handleSubmit,
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
      createdBy: "",
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
        setValue("trackingCode", result.cargo.trackingCode || "");
        setValue("description", result.cargo.description || "");
        setValue("weightKg", result.cargo.weightKg || 0);
        setValue("quantity", result.cargo.quantity || 1);
        setValue("entryDate", result.cargo.entryDate || "");
        setValue("exitDate", result.cargo.exitDate || "");
        setValue("isPerishable", result.cargo.isPerishable || false);
        setValue("status", result.cargo.status || "");
        setValue("documents", result.cargo.documents || []);
        setValue("createdBy", result.cargo.createdBy || "");
      }
    } catch (error) {
      console.error("Error fetching cargo data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cargo data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ArrowRightLeft className="h-6 w-6 text-gray-500" />
            <h1 className="text-2xl font-bold">Transferir Carga</h1>
          </div>
          <p className="text-gray-600">
            Transfiera la carga a una nueva ubicación.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pr-8">
          {/* Card de búsqueda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Búsqueda de carga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Tipo de búsqueda
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
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <Label className="text-sm font-medium">Valor a buscar</Label>
                  <Input
                    placeholder={`Ingresa el ${getSearchTypeLabel().toLowerCase()}...`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-10"
                    onKeyUp={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
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

          {/* Información de carga */}
          {cargoData && (
            <Card className="lg:col-span-2 border-green-200 dark:border-green-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {/* Columna 1 */}
                  <div className="space-y-4 rounded-lg p-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Ubicación Actual
                      </Label>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Almacén
                      </Label>
                      <span className="font-medium inline-flex items-center gap-2">
                        <Warehouse className="w-4 h-4 mt-1" />
                        <p className="font-medium mt-1">
                          {cargoData.warehouse}
                        </p>
                      </span>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Rack
                      </Label>
                      <span className="font-medium inline-flex items-center gap-2">
                        <PanelTopClose className="w-4 h-4 mt-1 " />
                        <p className="font-medium mt-1">{cargoData.rack}</p>
                      </span>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Nivel
                      </Label>
                      <span className="font-medium inline-flex items-center gap-2">
                        <Rows3 className="w-4 h-4 mt-1" />
                        <p className="font-medium mt-1">{cargoData.level}</p>
                      </span>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Columna
                      </Label>
                      <span className="font-medium inline-flex items-center gap-2">
                        <Columns3 className="mr-1 w-4 h-4" />
                        <p className="font-medium mt-1">{cargoData.column}</p>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Descripción
                      </Label>
                      <p className="font-medium mt-1">
                        {cargoData.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Cantidad
                        </Label>
                        <div className="flex items-center mt-1 gap-2">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {cargoData.quantity} unidades
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Peso
                        </Label>
                        <div className="flex items-center mt-1 gap-2">
                          <Weight className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {cargoData.weightKg} kg
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Volumen
                      </Label>
                      <p className="font-medium mt-1">
                        {cargoData.volumeM3} m³
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Fecha de Entrada
                      </Label>
                      <div className="flex items-center mt-1 gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatDate(cargoData.entryDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Columna 2 */}
                  <div className="space-y-6">
                    <div className="ml-4">
                      <Label className="text-sm text-muted-foreground">
                        Dimensiones
                      </Label>
                      <div className="mt-2 space-y-1">
                        <p>
                          <span className="text-muted-foreground">Ancho:</span>{" "}
                          <span className="font-medium">
                            {cargoData.dimensions.Width} cm
                          </span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Alto:</span>{" "}
                          <span className="font-medium">
                            {cargoData.dimensions.Height} cm
                          </span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Largo:</span>{" "}
                          <span className="font-medium">
                            {cargoData.dimensions.Length} cm
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Label className="text-sm text-muted-foreground">
                        AWB Number
                      </Label>
                      <p className="font-mono text-sm bg-muted/30 px-3 py-2 rounded mt-1">
                        {cargoData.airWaybillNumber}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Label className="text-sm text-muted-foreground">
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
        </div>
        <div className="mt-6 pr-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                Transferir Carga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Razon de Transferencia</Label>
                  <Textarea
                    placeholder="Escribe la razón de la transferencia..."
                    required
                    className="mt-2"
                    rows={3}
                  />
                </div>
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
            </CardContent>
          </Card>
        </div>
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => {}}
            disabled={false}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            {false ? (
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
