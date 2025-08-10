import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
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
  Textarea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Skeleton,
} from "@/components/ui";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Info,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { type CargoIdentifier } from "@/types/cargo";
import { useGetCargo, useTransferCargo } from "@/lib/cargo";
import { type CargoFormData } from "@/lib/types";
import { LocationSelector } from "@/components/cargo/location-selector";
import { useCookies } from "react-cookie";

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
  const [transferReason, setTransferReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [location, setLocation] = useState({
    warehouseId: "",
    rackId: "",
    levelId: "",
    columnId: "",
    level: 0,
    column: "",
  });
  const { mutateAsync: transferCargo, isPending: isTransferring } = useTransferCargo() as any;
  const [cookies] = useCookies(["userId"]);

  const userId = cookies.userId;

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
      if (!searchValue.trim()) {
        setSearchError("Ingresa un valor para buscar.");
        setLoading(false);
        return;
      }
      const updatedIdentifier = {
        ...identifier,
        [searchType]: searchValue.trim(),
      } as CargoIdentifier;

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
        setValue("createdBy", result.cargo.createdBy || userId);
      } else {
        setCargoData(null);
        setSearchError("No se encontró ninguna carga con ese valor.");
      }
    } catch (error) {
      console.error("Error fetching cargo data:", error);
      toast({
        title: "Error",
        description: "No se pudo obtener la información. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = useMemo(() => {
    return (
      !!cargoData &&
      !!location.warehouseId &&
      !!location.rackId &&
      !!location.levelId &&
      !!location.columnId &&
      transferReason.trim().length >= 10
    );
  }, [cargoData, location, transferReason]);

  const handleTransfer = async () => {
    if (!cargoData) return;

    try {
      await transferCargo({
        id: cargoData.id,
        fromWarehouseId: cargoData.warehouseId,
        toWarehouseId: location.warehouseId,
        fromRackId: cargoData.rackId,
        toRackId: location.rackId,
        fromLevelId: cargoData.levelId,
        toLevelId: location.levelId,
        fromColumnId: cargoData.columnId,
        toColumnId: location.columnId,
        movedBy: userId,
        transferReason,
      });

      toast({
        title: "Transferencia exitosa",
        description: "La carga ha sido transferida correctamente.",
      });

      setCargoData(null);
      setTransferReason("");
      setSearchValue("");
      setLocation({ warehouseId: "", rackId: "", levelId: "", columnId: "", level: 0, column: "" });
    } catch (error) {
      console.error("❌ Transferencia fallida:", error);
      toast({
        title: "Error al transferir",
        description: "Ocurrió un error al intentar transferir la carga.",
        variant: "destructive",
      });
    }
  };

  const getSearchTypeLabel = () => {
    const labels = {
      trackingCode: "Código de Tracking",
      qrcode: "Código QR",
      airWaybillNumber: "AWB Number",
      houseAirWaybillNumber: "House AWB Number",
    } as const;
    return labels[searchType];
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
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

  const StatusBadges = () => (
    <div className="flex flex-wrap items-center gap-2">
      {cargoData?.status ? (
        <Badge variant="outline" className="border-green-500/40 text-green-700 dark:text-green-300">
          {cargoData.status}
        </Badge>
      ) : null}
      {cargoData?.isPerishable ? (
        <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-300">
          Perecedero
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 dark:text-slate-300">No perecedero</Badge>
      )}
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) => (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center mt-1 gap-2">
        {Icon ? <Icon className="w-4 h-4 text-muted-foreground" /> : null}
        <span className="font-medium">{value ?? "-"}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pl-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Transferir Carga</h1>
        <p className="text-slate-400 mt-1 sm:mt-2">
          Transfiera la carga a una nueva ubicación de forma segura.
        </p>
      </div>
      <div className="mx-auto max-w-7xl">

        {/* Búsqueda */}
        <Card className="mt-6 w-full max-w-5xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5" /> Búsqueda de carga
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de búsqueda</Label>
                <Select value={searchType} onValueChange={(v: any) => setSearchType(v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trackingCode">Código de Tracking</SelectItem>
                    <SelectItem value="qrcode">Código QR</SelectItem>
                    <SelectItem value="airWaybillNumber">AWB Number</SelectItem>
                    <SelectItem value="houseAirWaybillNumber">House AWB Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 space-y-2">
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
              <div className="sm:col-span-3 flex gap-3">
                <Button onClick={handleSearch} disabled={loading} className="h-10 flex-1">
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" /> Buscar
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10"
                  onClick={() => {
                    setSearchValue("");
                    setSearchError("");
                    setCargoData(null);
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </div>

            {searchError && (
              <Alert variant="destructive" className="border-destructive/30">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Información de carga */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {loading ? (
            <Card className="mt-6 w-full max-w-5xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" /> Información de Carga
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </CardContent>
            </Card>
          ) : cargoData ? (
            <Card className="mt-6 w-full max-w-5xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2">
                    <Package className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span>Información de Carga</span>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300">Encontrada</Badge>
                  <StatusBadges />
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Columna ubicación */}
                  <div className="rounded-xl border bg-card p-4">
                    <Label className="text-xs text-muted-foreground">Ubicación actual</Label>
                    <Separator className="my-3" />
                    <div className="space-y-3">
                      <InfoRow label="Almacén" value={cargoData.warehouse} icon={Warehouse} />
                      <InfoRow label="Rack" value={cargoData.rack} icon={PanelTopClose} />
                      <InfoRow label="Nivel" value={cargoData.level} icon={Rows3} />
                      <InfoRow label="Columna" value={cargoData.column} icon={Columns3} />
                    </div>
                  </div>

                  {/* Columna detalles */}
                  <div className="rounded-xl border bg-card p-4">
                    <Label className="text-xs text-muted-foreground">Detalles</Label>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow label="Descripción" value={cargoData.description} icon={Info} />
                      <InfoRow label="Volumen" value={`${cargoData.volumeM3} m³`} />
                      <InfoRow label="Cantidad" value={`${cargoData.quantity} unidades`} icon={Hash} />
                      <InfoRow label="Peso" value={`${cargoData.weightKg} kg`} icon={Weight} />
                      <InfoRow label="Entrada" value={formatDate(cargoData.entryDate)} icon={Calendar} />
                    </div>
                  </div>

                  {/* Columna documentación */}
                  <div className="rounded-xl border bg-card p-4">
                    <Label className="text-xs text-muted-foreground">Documentación</Label>
                    <Separator className="my-3" />
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">AWB Number</Label>
                        <p className="mt-1 rounded bg-muted/40 px-3 py-2 font-mono text-sm">{cargoData.airWaybillNumber || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">House AWB Number</Label>
                        <p className="mt-1 rounded bg-muted/40 px-3 py-2 font-mono text-sm">{cargoData.houseAirWaybillNumber || "-"}</p>
                      </div>
                      {cargoData?.dimensions ? (
                        <div>
                          <Label className="text-sm text-muted-foreground">Dimensiones</Label>
                          <div className="mt-1 grid grid-cols-3 gap-3 text-sm">
                            <p><span className="text-muted-foreground">Ancho:</span> <span className="font-medium">{cargoData.dimensions.Width} cm</span></p>
                            <p><span className="text-muted-foreground">Alto:</span> <span className="font-medium">{cargoData.dimensions.Height} cm</span></p>
                            <p><span className="text-muted-foreground">Largo:</span> <span className="font-medium">{cargoData.dimensions.Length} cm</span></p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </motion.div>

        {/* Transferencia */}
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" /> Transferir Carga
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Razón de transferencia</Label>
                <Textarea
                  placeholder="Escribe la razón de la transferencia..."
                  required
                  className="mt-2"
                  rows={3}
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">Mínimo 10 caracteres.</p>
              </div>
              <LocationSelector
                warehouseId={watch("warehouseId")}
                rackId={watch("rackId")}
                level={watch("level")}
                column={watch("column").toString()}
                onLocationChange={handleLocationChange}
              />
              {errors.warehouseId && (
                <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" /> {errors.warehouseId.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action bar */}
        <div className="pointer-events-none sticky bottom-0 mt-10 flex justify-end">
          <div className="pointer-events-auto mx-auto w-full max-w-5xl rounded-t-2xl border bg-background/95 p-3 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="flex items-center justify-between gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>
                  Completa todos los campos y proporciona una razón de al menos 10 caracteres.
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        size="lg"
                        className="shadow-lg hover:shadow-xl transition-shadow"
                        disabled={!canSubmit || isTransferring}
                        onClick={() => {
                          if (!cargoData) return;
                          if (!canSubmit) {
                            setSearchError("");
                            toast({
                              title: "Faltan datos",
                              description: "Selecciona la ubicación completa y explica la razón de transferencia.",
                              variant: "destructive",
                            });
                            return;
                          }
                          setConfirmOpen(true);
                        }}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isTransferring ? "Guardando..." : "Guardar"}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confirma antes de transferir la carga</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Confirmación */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar transferencia</AlertDialogTitle>
              <AlertDialogDescription>
                Revisa los detalles antes de confirmar la operación. Esta acción registrará el movimiento.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await handleTransfer();
                  setConfirmOpen(false);
                }}
              >
                Confirmar y transferir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
