import { useState, useMemo } from "react";
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
  Separator,
} from "@/components/ui";
import {
  Package,
  Save,
  AlertCircle,
  Calendar,
  Weight,
  Hash,
  Search,
  Info,
  CheckCircle2,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { LocationSelector } from "@/components/cargo/location-selector";
import type { CargoFormData } from "@/lib/types";
import { useGetCargo, useAssignCargoLocation } from "@/lib/cargo";
import { useCookies } from "react-cookie";
import type { CargoIdentifier } from "@/types/cargo";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type FeedbackVariant = "success" | "error" | "info";

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
  const [assigning, setAssigning] = useState(false);
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
  const userId = cookies.userId as string | undefined;
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");

  // ---- AlertDialog de feedback (éxito/error/info)
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    title: string;
    description?: string;
    variant: FeedbackVariant;
  }>({ title: "", description: "", variant: "info" });

  const showFeedback = (
    title: string,
    description = "",
    variant: FeedbackVariant = "info"
  ) => {
    setFeedback({ title, description, variant });
    setFeedbackOpen(true);
  };

  // React Hook Form
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
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const missingLocation = useMemo(() => {
    const miss: string[] = [];
    if (!location.warehouseId) miss.push("Almacén");
    if (!location.rackId) miss.push("Rack");
    if (!location.levelId) miss.push("Nivel");
    if (!location.columnId) miss.push("Columna");
    return miss;
  }, [location]);

  const canSubmit = useMemo(() => {
    return (
      !!cargoData &&
      !!userId &&
      location.warehouseId &&
      location.rackId &&
      location.levelId &&
      location.columnId
    );
  }, [cargoData, userId, location]);

  const handleSearch = async () => {
    const value = searchValue.trim();
    if (!value) {
      setSearchError(
        `Ingresa un valor para ${getSearchTypeLabel().toLowerCase()}.`
      );
      showFeedback(
        "Falta el valor de búsqueda",
        `Ingresa ${getSearchTypeLabel().toLowerCase()} antes de buscar.`,
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const updatedIdentifier = { ...identifier, [searchType]: value };
      const result = await getCargo(updatedIdentifier);

      if (result?.success && result?.cargo) {
        setCargoData(result.cargo);
        setSearchError("");
        // popular formulario
        setValue("trackingCode", result.cargo.trackingCode ?? "");
        setValue("description", result.cargo.description ?? "");
        setValue("weightKg", result.cargo.weightKg ?? 0);
        setValue("quantity", result.cargo.quantity ?? 1);
        setValue("entryDate", result.cargo.entryDate ?? "");
        setValue("exitDate", result.cargo.exitDate ?? "");
        setValue("isPerishable", result.cargo.isPerishable ?? false);
        setValue("status", result.cargo.status ?? "");
        setValue("documents", result.cargo.documents ?? []);
        setValue("createdBy", result.cargo.createdBy ?? userId ?? "");

        showFeedback(
          "Carga encontrada",
          "Los datos fueron cargados correctamente.",
          "success"
        );
      } else {
        setCargoData(null);
        setSearchError("No encontramos una carga con ese identificador.");
        showFeedback(
          "Carga no encontrada",
          "Verifica el identificador e intenta nuevamente.",
          "error"
        );
      }
    } catch (error) {
      console.error("[DEBUG] Error al buscar carga:", error);
      setCargoData(null);
      setSearchError("Ocurrió un error al buscar la carga.");
      showFeedback("Error al buscar", "Inténtalo nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    // validaciones antes de asignar
    if (!cargoData) {
      showFeedback(
        "Sin carga seleccionada",
        "Busca y selecciona una carga antes de asignar ubicación.",
        "error"
      );
      return;
    }
    if (!userId) {
      showFeedback(
        "Sesión requerida",
        "No pudimos identificar al usuario. Inicia sesión nuevamente.",
        "error"
      );
      return;
    }
    if (missingLocation.length) {
      showFeedback(
        "Faltan datos de ubicación",
        `Completa: ${missingLocation.join(", ")}.`,
        "error"
      );
      return;
    }

    setAssigning(true);
    try {
      await assign({
        id: cargoData.id,
        ...location,
        movedBy: userId, // usuario actual
      });

      showFeedback(
        "Carga asignada",
        "La ubicación fue asignada correctamente.",
        "success"
      );
    } catch (err: any) {
      console.error("Error assigning location:", err);
      showFeedback(
        "No se pudo asignar",
        err?.message || "Ocurrió un problema al asignar la ubicación.",
        "error"
      );
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

  const feedbackIcon =
    feedback.variant === "success" ? (
      <CheckCircle className="w-5 h-5 text-emerald-600" />
    ) : feedback.variant === "error" ? (
      <AlertCircle className="w-5 h-5 text-red-600" />
    ) : (
      <Info className="w-5 h-5 text-blue-600" />
    );

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
          <p className="text-gray-600 dark:text-gray-300">
            Busca la carga y asigna una ubicación disponible en el almacén.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Búsqueda */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Búsqueda de carga
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Tipo de búsqueda
                    </Label>
                    <Select
                      value={searchType}
                      onValueChange={(value: any) => setSearchType(value)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecciona tipo" />
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

                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-sm font-medium">
                      Valor a buscar
                    </Label>
                    <Input
                      placeholder={`Ingresa el ${getSearchTypeLabel().toLowerCase()}...`}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className={`h-10 ${
                        searchError ? "border-destructive" : ""
                      }`}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                    />
                    {searchError ? (
                      <div className="flex items-center gap-2 text-destructive text-xs mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{searchError}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
                        <Info className="w-3 h-3" />
                        <span>
                          Puedes presionar <b>Enter</b> para buscar.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-3">
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
              </CardContent>
            </Card>

            {/* Información de Carga */}
            {cargoData ? (
              <Card className="shadow-sm border-green-200 dark:border-green-800">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Descripción
                        </Label>
                        <p className="text-foreground mt-1 font-medium">
                          {cargoData.description || "—"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Cantidad
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {cargoData.quantity ?? "—"} unidades
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Peso
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Weight className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {cargoData.weightKg ?? "—"} kg
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {cargoData.status || "Sin estado"}
                        </Badge>
                        {cargoData.isPerishable && (
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                            Perecedero
                          </Badge>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Fecha de Entrada
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {formatDate(cargoData.entryDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <Label className="text-sm text-muted-foreground">
                          Dimensiones
                        </Label>
                        <div className="mt-2 space-y-1">
                          <p>
                            <span className="text-muted-foreground">
                              Ancho:
                            </span>{" "}
                            <span className="font-medium">
                              {cargoData?.dimensions?.width ?? "—"} cm
                            </span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Alto:</span>{" "}
                            <span className="font-medium">
                              {cargoData?.dimensions?.height ?? "—"} cm
                            </span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Largo:
                            </span>{" "}
                            <span className="font-medium">
                              {cargoData?.dimensions?.length ?? "—"} cm
                            </span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">
                          AWB Number
                        </Label>
                        <p className="font-mono text-sm bg-muted/30 px-3 py-2 rounded mt-1">
                          {cargoData.airWaybillNumber || "—"}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">
                          House AWB Number
                        </Label>
                        <p className="font-mono text-sm bg-muted/30 px-3 py-2 rounded mt-1">
                          {cargoData.houseAirWaybillNumber || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-slate-300 dark:border-slate-700">
                <CardContent className="py-10 text-center text-muted-foreground">
                  <Info className="inline w-5 h-5 mr-2" />
                  Busca una carga para ver su información.
                </CardContent>
              </Card>
            )}

            {/* Selector de Ubicación */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Selección de ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationSelector
                  warehouseId={watch("warehouseId")}
                  rackId={watch("rackId")}
                  level={watch("level")}
                  column={watch("column").toString()}
                  onLocationChange={handleLocationChange}
                />

                {missingLocation.length > 0 ? (
                  <div className="mt-3 flex items-start gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Faltan datos de ubicación</p>
                      <p className="opacity-90">
                        Completa: {missingLocation.join(", ")}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ubicación completa.</span>
                  </div>
                )}

                {errors.warehouseId && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                    <AlertCircle className="w-3 h-3" />
                    {errors.warehouseId.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (resumen) */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usuario:</span>
                  <span className="font-medium">{userId || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carga:</span>
                  <span className="font-medium">
                    {cargoData?.description || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AWB:</span>
                  <span className="font-medium">
                    {cargoData?.airWaybillNumber || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ubicación:</span>
                  <span className="font-medium">
                    {location.warehouseId &&
                    location.rackId &&
                    location.level &&
                    location.column
                      ? `WH:${location.warehouseId} · R:${location.rackId} · N:${location.level} · C:${location.column}`
                      : "Sin asignar"}
                  </span>
                </div>

                <Separator className="my-2" />

                <div className="text-xs text-muted-foreground">
                  Asegúrate de que la ubicación esté disponible antes de
                  guardar.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botón fijo Guardar con confirmación */}
        <div className="fixed bottom-6 right-6 z-50">
          {/* Confirmar guardar */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                onClick={(e) => {
                  if (!canSubmit) {
                    e.preventDefault();
                    showFeedback(
                      "No se puede guardar",
                      cargoData
                        ? `Completa: ${missingLocation.join(", ")}.`
                        : "Primero busca y selecciona una carga.",
                      "error"
                    );
                  }
                }}
                disabled={!canSubmit || assigning}
                size="lg"
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                {assigning ? (
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
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar asignación</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Deseas asignar esta ubicación a la carga seleccionada?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await handleAssign();
                  }}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* AlertDialog de feedback (éxito/error/info) */}
      <AlertDialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              {feedbackIcon}
              <AlertDialogTitle>{feedback.title}</AlertDialogTitle>
            </div>
            {feedback.description ? (
              <AlertDialogDescription>
                {feedback.description}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setFeedbackOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
