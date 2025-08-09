import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, User, Truck, Clock, Copy } from "lucide-react";
import { statusConfig } from "@/components/common/status-config";

interface LocationDetailsModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  // Esperamos { ...location, rack, warehouse, [extras opcionales del backend] }
  selectedLocation: any;
}

export const LocationDetailsModal = ({ isOpen, onClose, selectedLocation }: LocationDetailsModalProps) => {
  if (!selectedLocation) return null;

  const status = useMemo(() => {
    const s = statusConfig[selectedLocation.status as keyof typeof statusConfig];
    if (s) return s;
    return {
      label: selectedLocation.status || "Desconocido",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
      borderColor: "border-gray-300",
    };
  }, [selectedLocation?.status]);

  const warehouseName =
    selectedLocation?.warehouse?.name ?? selectedLocation?.warehouseName ?? "Almacén";
  const rackName =
    selectedLocation?.rack?.name ?? selectedLocation?.rackName ?? "Rack";
  const positionText = `L${selectedLocation?.level ?? "?"} C${selectedLocation?.column ?? "?"}`;

  const dimsText =
    selectedLocation?.dimensionsCm
      ? `${selectedLocation.dimensionsCm.Length} × ${selectedLocation.dimensionsCm.Width} × ${selectedLocation.dimensionsCm.Height} cm`
      : "—";

  const weightText =
    typeof selectedLocation?.weightKg === "number"
      ? `${selectedLocation.weightKg.toFixed(2)} kg`
      : "—";

  const rackCode = selectedLocation?.rackCode ?? selectedLocation?.rack?.code ?? selectedLocation?.rackId ?? "—";
  const isOccupied =
    selectedLocation?.isOccupied === true ? "Sí" :
    selectedLocation?.isOccupied === false ? "No" : "—";

  const copyTracking = async () => {
    if (!selectedLocation?.trackingCode) return;
    try {
      await navigator.clipboard.writeText(selectedLocation.trackingCode);
    } catch {}
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
          <SheetHeader className="px-5 py-4">
            <SheetTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Detalles de la ubicación
            </SheetTitle>
            <SheetDescription className="text-sm">
              {selectedLocation?.id} · {rackName} · {warehouseName}
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Body con scroll */}
        <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {/* Estado */}
          <div className="flex justify-center">
            <Badge className={`${status.bgColor} ${status.textColor} ${status.borderColor} border px-3 py-1 text-xs`}>
              {status.label}
            </Badge>
          </div>

          {/* Información de la ubicación */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold tracking-tight">Información de la ubicación</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">ID</p>
                <p className="font-mono text-sm">{selectedLocation?.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Posición</p>
                <p className="font-mono text-sm">{positionText}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Almacén</p>
                <p className="text-sm font-medium">{warehouseName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Rack</p>
                <p className="text-sm font-medium">{rackName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Código de Rack</p>
                <p className="text-sm font-medium">{rackCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Ocupada</p>
                <p className="text-sm font-medium">{isOccupied}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Información de la carga si hay tracking */}
          {selectedLocation?.trackingCode && (
            <>
              <section className="space-y-4">
                <h3 className="text-sm font-semibold tracking-tight">Información de la carga</h3>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tracking</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {selectedLocation.trackingCode}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyTracking} aria-label="Copiar tracking">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ver envío">
                      <Truck className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {selectedLocation?.description && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Descripción</p>
                    <p className="text-sm">{selectedLocation.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Peso</p>
                    <p className="text-sm font-medium">{weightText}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Dimensiones</p>
                    <p className="text-sm font-medium">{dimsText}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedLocation?.entryDate && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Fecha de entrada</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium">{selectedLocation.entryDate}</p>
                      </div>
                    </div>
                  )}
                  {selectedLocation?.exitDate && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Fecha de salida</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium">{selectedLocation.exitDate}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedLocation?.assignedUser && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Usuario asignado</p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{selectedLocation.assignedUser}</p>
                    </div>
                  </div>
                )}
              </section>

              <Separator />
            </>
          )}

          {/* Identificadores aéreos */}
          {(selectedLocation?.airWaybillNumber ||
            selectedLocation?.houseAirWaybillNumber ||
            selectedLocation?.masterAirWaybillNumber ||
            selectedLocation?.manifestNumber) && (
            <>
              <section className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">Identificadores aéreos</h3>

                {selectedLocation?.airWaybillNumber && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Air Waybill (AWB)</p>
                    <p className="font-mono text-sm">{selectedLocation.airWaybillNumber}</p>
                  </div>
                )}

                {selectedLocation?.houseAirWaybillNumber && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">House AWB (HAWB)</p>
                    <p className="font-mono text-sm">{selectedLocation.houseAirWaybillNumber}</p>
                  </div>
                )}

                {selectedLocation?.masterAirWaybillNumber && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Master AWB (MAWB)</p>
                    <p className="font-mono text-sm">{selectedLocation.masterAirWaybillNumber}</p>
                  </div>
                )}

                {selectedLocation?.manifestNumber && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Manifiesto</p>
                    <p className="font-mono text-sm">{selectedLocation.manifestNumber}</p>
                  </div>
                )}
              </section>

              <Separator />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
