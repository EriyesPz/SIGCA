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
  Separator,
} from "@/components/ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Package,
  Save,
  AlertCircle,
  Search,
  Truck,
  ClipboardSignature,
  Info,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useDeliverCargo, useGetCargo } from "@/lib/cargo";
import type { DeliverCargo, CargoIdentifier } from "@/types/cargo";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive">{message}</p> : null;

export const DeliverCargoPage = () => {
  const [searchType, setSearchType] =
    useState<keyof CargoIdentifier>("trackingCode");
  const [searchValue, setSearchValue] = useState("");
  const [cargoData, setCargoData] = useState<any | null>(null);
  const [searchError, setSearchError] = useState("");
  const [submitOk, setSubmitOk] = useState<string>("");
  const [submitErr, setSubmitErr] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const [cookies] = useCookies(["userId"]);
  const userId = cookies.userId;

  const { mutateAsync: getCargo } = useGetCargo();
  const { mutateAsync: deliver } = useDeliverCargo();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<DeliverCargo>({
    defaultValues: {
      deliveredBy: userId,
      verifiedBy: userId,
    },
  });

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setSearchError("Ingresa un valor para buscar.");
      setCargoData(null);
      return;
    }
    setIsSearching(true);
    setSubmitOk("");
    setSubmitErr("");
    try {
      const identifier = {
        [searchType]: searchValue.trim(),
      } as CargoIdentifier;
      const response = await getCargo(identifier);

      if (response?.success && response?.cargo) {
        setCargoData(response.cargo);
        setSearchError("");
        setValue("id", response.cargo.id);
      } else {
        setCargoData(null);
        setSearchError("Carga no encontrada.");
        toast({
          title: "Carga no encontrada",
          description: "Verifica el identificador e intenta nuevamente.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error buscando carga:", err);
      setCargoData(null);
      setSearchError("No se pudo buscar la carga.");
      toast({
        title: "Error",
        description: "No se pudo buscar la carga.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = async (data: DeliverCargo) => {
    const payload = {
      ...data,
      metadata: data.metadata?.evidence
        ? { evidence: data.metadata.evidence }
        : undefined,
    };

    setSubmitOk("");
    setSubmitErr("");

    try {
      await deliver(payload);
      setSubmitOk("La salida de la carga fue registrada exitosamente.");
      toast({
        title: "✅ Carga entregada",
        description: "La salida de la carga fue registrada exitosamente.",
      });
      // Mantener funcionalidad: no modificamos nada del flujo; sólo UI
      // Podrías limpiar el campo de evidencia si quieres sin afectar lógica del backend
      reset({ deliveredBy: userId, verifiedBy: userId });
    } catch (err) {
      setSubmitErr("No se pudo completar la entrega.");
      toast({
        title: "❌ Error",
        description: "No se pudo completar la entrega.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("es-HN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Encabezado */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-primary/10">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Salida de Carga</h1>
          </div>
          <p className="text-muted-foreground">
            Registra la entrega física de una carga desde el almacén al receptor.
          </p>
        </motion.header>

        {/* Alerts de estado global */}
        {searchError && (
          <Alert variant="destructive" className="border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al buscar</AlertTitle>
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}

        {submitOk && (
          <Alert className="border-green-500/30">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>¡Listo!</AlertTitle>
            <AlertDescription>{submitOk}</AlertDescription>
          </Alert>
        )}

        {submitErr && (
          <Alert variant="destructive" className="border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitErr}</AlertDescription>
          </Alert>
        )}

        {/* Tarjeta de búsqueda */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="w-full max-w-4xl mx-auto shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="w-5 h-5" />
                Buscar carga
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Tipo de búsqueda</Label>
                  <Select
                    value={searchType}
                    onValueChange={(v) => setSearchType(v as keyof CargoIdentifier)}
                  >
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trackingCode">Tracking Code</SelectItem>
                      <SelectItem value="qrcode">QR Code</SelectItem>
                      <SelectItem value="airWaybillNumber">AWB</SelectItem>
                      <SelectItem value="houseAirWaybillNumber">House AWB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Valor</Label>
                  <Input
                    placeholder="Valor a buscar"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && handleSearch()}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="rounded-xl"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Buscando..." : "Buscar carga"}
                </Button>
                <div className="flex items-center text-muted-foreground text-xs gap-2">
                  <Info className="w-4 h-4" />
                  Usa Enter para buscar más rápido.
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Datos de la carga */}
        {cargoData && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="w-full max-w-4xl mx-auto shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5" />
                  Datos de la Carga
                  <Badge variant="outline" className="rounded-full px-3 py-0.5">Liberada</Badge>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground pt-6">
                <div className="space-y-1">
                  <p><span className="font-medium text-foreground">Descripción:</span> {cargoData.description}</p>
                  <p><span className="font-medium text-foreground">Cantidad:</span> {cargoData.quantity}</p>
                  <p><span className="font-medium text-foreground">Peso:</span> {cargoData.weightKg} kg</p>
                  <p><span className="font-medium text-foreground">Volumen:</span> {cargoData.volumeM3} m³</p>
                </div>
                <div className="space-y-1">
                  <p><span className="font-medium text-foreground">Fecha Ingreso:</span> {formatDate(cargoData.entryDate)}</p>
                  <p><span className="font-medium text-foreground">AWB:</span> {cargoData.airWaybillNumber}</p>
                  <p><span className="font-medium text-foreground">House AWB:</span> {cargoData.houseAirWaybillNumber}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Registro de entrega */}
        {cargoData && (
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <Card className="w-full max-w-4xl mx-auto shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardSignature className="w-5 h-5" />
                  Registro de Entrega
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nombre del Receptor</Label>
                    <Input
                      {...register("receiver", { required: "Campo obligatorio" })}
                      className="h-10 rounded-xl"
                    />
                    <FieldError message={errors.receiver?.message} />
                  </div>
                </div>

                {/* Campo oculto para verifiedBy */}
                <input type="hidden" {...register("verifiedBy")} />

                <div className="space-y-2">
                  <Label>Notas / Evidencia (opcional)</Label>
                  <Input {...register("metadata.evidence")} className="h-10 rounded-xl" />
                </div>

                <Alert className="bg-muted/40">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Verifica antes de registrar</AlertTitle>
                  <AlertDescription>
                    Confirma que el receptor y los datos de la carga coinciden con el documento físico.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="max-w-4xl mx-auto flex gap-3">
              <Button type="submit" size="lg" className="rounded-xl" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Registrar Entrega"}
              </Button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};
