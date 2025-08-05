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
  Search,
  Truck,
  ClipboardSignature,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useDeliverCargo, useGetCargo } from "@/lib/cargo";
import type { DeliverCargo, CargoIdentifier } from "@/types/cargo";
import { useCookies } from "react-cookie";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-red-500">{message}</p> : null;

export const DeliverCargoPage = () => {
  const [searchType, setSearchType] =
    useState<keyof CargoIdentifier>("trackingCode");
  const [searchValue, setSearchValue] = useState("");
  const [cargoData, setCargoData] = useState<any | null>(null);
  const [searchError, setSearchError] = useState("");
  const [cookies] = useCookies(["userId"]);

  const userId = cookies.userId;
  const { mutateAsync: getCargo } = useGetCargo();
  const { mutateAsync: deliver } = useDeliverCargo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DeliverCargo>({
    defaultValues: {
      deliveredBy: userId,
      verifiedBy: userId,
    },
  });

  const handleSearch = async () => {
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
      toast({
        title: "Error",
        description: "No se pudo buscar la carga.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: DeliverCargo) => {
    const payload = {
      ...data,
      metadata: data.metadata?.evidence
        ? { evidence: data.metadata.evidence }
        : undefined,
    };

    try {
      await deliver(payload);
      toast({
        title: "✅ Carga entregada",
        description: "La salida de la carga fue registrada exitosamente.",
      });
    } catch (err) {
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
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Encabezado principal */}
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Salida de Carga</h1>
          </div>
          <p className="text-muted-foreground">
            Registra la entrega física de una carga desde el almacén al
            receptor.
          </p>
        </header>

        {/* Tarjeta de búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5" />
              Buscar carga
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Tipo de búsqueda</Label>
                <Select
                  value={searchType}
                  onValueChange={(v) =>
                    setSearchType(v as keyof CargoIdentifier)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trackingCode">Tracking Code</SelectItem>
                    <SelectItem value="qrcode">QR Code</SelectItem>
                    <SelectItem value="airWaybillNumber">AWB</SelectItem>
                    <SelectItem value="houseAirWaybillNumber">
                      House AWB
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Valor</Label>
                <Input
                  placeholder="Valor a buscar"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full sm:w-auto">
              <Search className="w-4 h-4 mr-2" />
              Buscar carga
            </Button>

            {searchError && (
              <div className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {searchError}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Datos de la carga */}
        {cargoData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5" />
                Datos de la Carga
                <Badge variant="outline">Liberada</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p>
                  <strong>Descripción:</strong> {cargoData.description}
                </p>
                <p>
                  <strong>Cantidad:</strong> {cargoData.quantity}
                </p>
                <p>
                  <strong>Peso:</strong> {cargoData.weightKg} kg
                </p>
                <p>
                  <strong>Volumen:</strong> {cargoData.volumeM3} m³
                </p>
              </div>
              <div className="space-y-1">
                <p>
                  <strong>Fecha Ingreso:</strong>{" "}
                  {formatDate(cargoData.entryDate)}
                </p>
                <p>
                  <strong>AWB:</strong> {cargoData.airWaybillNumber}
                </p>
                <p>
                  <strong>House AWB:</strong> {cargoData.houseAirWaybillNumber}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registro de entrega */}
        {cargoData && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardSignature className="w-5 h-5" />
                  Registro de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nombre del Receptor</Label>
                    <Input
                      {...register("receiver", {
                        required: "Campo obligatorio",
                      })}
                    />
                    <FieldError message={errors.receiver?.message} />
                  </div>
                </div>

                {/* Campo oculto para verifiedBy */}
                <input type="hidden" {...register("verifiedBy")} />

                <div className="space-y-2">
                  <Label>Notas / Evidencia (opcional)</Label>
                  <Input {...register("metadata.evidence")} />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Registrar Entrega
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
