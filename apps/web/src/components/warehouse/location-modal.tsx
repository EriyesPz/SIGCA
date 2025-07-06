import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, User, Truck, Clock, ChevronRight } from "lucide-react"
import { statusConfig } from "@/components/common/status-config"

interface LocationDetailsModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  selectedLocation: any
}

export const LocationDetailsModal = ({ isOpen, onClose, selectedLocation }: LocationDetailsModalProps) => {
  if (!selectedLocation) return null

  const status = statusConfig[selectedLocation.status as keyof typeof statusConfig] ?? {
    label: selectedLocation.status || "Desconocido",
    color: "bg-slate-400",
    textColor: "text-slate-700",
    bgColor: "bg-slate-50 dark:bg-slate-900/20",
    borderColor: "border-slate-200 dark:border-slate-800",
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Detalles
          </SheetTitle>
          <SheetDescription>
            {selectedLocation?.id} - {selectedLocation?.rack?.name}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              className={`
                ${status.bgColor}
                ${status.textColor}
                ${status.borderColor}
                border px-4 py-2
              `}
            >
              {status.label}
            </Badge>
          </div>

          {/* Location Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ubicación</p>
                <p className="font-medium">{selectedLocation.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Posición</p>
                <p className="font-medium">
                  L{selectedLocation.level} C{selectedLocation.column}
                </p>
              </div>
            </div>

            <Separator />

            {selectedLocation.trackingCode && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información de la Carga</h3>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Código de Tracking</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-medium">{selectedLocation.trackingCode}</p>
                      <Button variant="ghost" size="sm">
                        <Truck className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Descripción</p>
                    <p>{selectedLocation.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="font-medium">{selectedLocation.weight ?? "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Dimensiones</p>
                      <p className="font-medium">{selectedLocation.dimensions ?? "—"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Fecha de Entrada</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="font-medium">{selectedLocation.entryDate ?? "—"}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Fecha de Salida</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <p className="font-medium">{selectedLocation.exitDate ?? "TBD"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Usuario Asignado</p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium">{selectedLocation.assignedUser ?? "—"}</p>
                    </div>
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Warehouse Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información del Almacén</h3>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Almacén</p>
                <p className="font-medium">{selectedLocation.warehouse?.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Rack</p>
                <p className="font-medium">{selectedLocation.rack?.name}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-2">
              <Button className="w-full">
                Actualizar estado
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              {selectedLocation.trackingCode && (
                <Button variant="outline" className="w-full">
                  <Truck className="mr-2 w-4 h-4" />
                  Rastrear envío
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
