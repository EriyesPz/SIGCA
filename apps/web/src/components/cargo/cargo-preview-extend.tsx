import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Eye, Code, Package, FileText, User, Calendar } from "lucide-react";
import type { RegisterCargo } from "@/types/cargo";

interface CargoPreviewExtendedProps {
  cargo: RegisterCargo;
  showJson?: boolean;
}

export const CargoPreviewExtended = ({
  cargo,
  showJson = false,
}: CargoPreviewExtendedProps) => {
  const formatDate = (date?: Date) =>
    date ? new Date(date).toLocaleString() : "—";

  const jsonPayload = {
    ...cargo,
    entryDate: cargo.entryDate?.toISOString() ?? null,
    flightDate: cargo.flightDate?.toISOString() ?? null,
    departureDate: cargo.departureDate?.toISOString() ?? null,
    arrivalDate: cargo.arrivalDate?.toISOString() ?? null,
    documents: cargo.documents.map((doc) => ({
      name: doc.file.name,
      type: doc.type,
      size: doc.file.size,
      metadata: doc.metadata,
    })),
    audit: {
      createdBy: cargo.createdBy,
      createdAt: new Date().toISOString(),
    },
  };

  if (showJson) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            JSON Payload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(jsonPayload, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Vista Previa de Carga
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cargo Information */}
        <div className="space-y-4">
          <section>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold">Información de Carga</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3">
              <div>
                <span className="text-gray-600">Código de Seguimiento:</span>
                <p className="font-mono">{cargo.airWaybillNumber || "—"}</p>
              </div>
              <div>
                <span className="text-gray-600">Guia Aerea:</span>
                <p className="font-mono">
                  {cargo.houseAirWaybillNumber || "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Guia Master:</span>
                <p className="font-mono">
                  {cargo.masterAirWaybillNumber || "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Manifiesto:</span>
                <p className="font-mono">{cargo.manifestNumber || "—"}</p>
              </div>
              <div>
                <span className="text-gray-600">Peso:</span>
                <p>{cargo.weightKg} kg</p>
              </div>
              <div>
                <span className="text-gray-600">Cantidad:</span>
                <p>{cargo.quantity}</p>
              </div>
              <div>
                <span className="text-gray-600">Volumen:</span>
                <p>{cargo.volumenm3 ?? "—"} m³</p>
              </div>
              <div>
                <span className="text-gray-600">Largo:</span>
                <p>{cargo.dimensions?.length ?? "—"} cm</p>
              </div>
              <div>
                <span className="text-gray-600">Alto:</span>
                <p>{cargo.dimensions?.height ?? "—"} cm</p>
              </div>
              <div>
                <span className="text-gray-600">Ancho:</span>
                <p>{cargo.dimensions?.width ?? "—"} cm</p>
              </div>

              <div>
                <span className="text-gray-600">Fecha Entrada:</span>
                <p>{formatDate(cargo.entryDate)}</p>
              </div>
              <div>
                <span className="text-gray-600">Perecedero:</span>
                <p>{cargo.isPerishable ? "Sí" : "No"}</p>
              </div>
              <div>
                <span className="text-gray-600">Alto Valor:</span>
                <p>{cargo.isHighValue ? "Sí" : "No"}</p>
              </div>
              <div>
                <span className="text-gray-600">Material Peligroso:</span>
                <p>{cargo.isHazardous ? "Sí" : "No"}</p>
              </div>
            </div>

            {cargo.description && (
              <div className="mt-4">
                <span className="text-gray-600">Descripción:</span>
                <p className="text-sm mt-1 bg-gray-50 p-3 rounded">
                  {cargo.description}
                </p>
              </div>
            )}
          </section>
        </div>

        <Separator />

        {/* Flight Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yellow-600" />
            <h3 className="font-semibold">Información de Vuelo</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3">
            <div>
              <span className="text-gray-600">Número de Vuelo:</span>
              <p>{cargo.flightNumber || "—"}</p>
            </div>
            <div>
              <span className="text-gray-600">Fecha de Vuelo:</span>
              <p>{formatDate(cargo.flightDate)}</p>
            </div>
            <div>
              <span className="text-gray-600">Aeropuerto Origen:</span>
              <p>{cargo.originAirport || "—"}</p>
            </div>
            <div>
              <span className="text-gray-600">Aeropuerto Destino:</span>
              <p>{cargo.destinationAirport || "—"}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold">
              Documentos ({cargo.documents.length})
            </h3>
          </div>

          {cargo.documents.length > 0 ? (
            <div className="space-y-2">
              {cargo.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-sm">{doc.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.type} • {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Badge variant="outline">{doc.type}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay documentos adjuntos</p>
          )}
        </div>

        <Separator />

        <div></div>

        {/* Audit Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold">Información de Auditoría</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Fecha de creación:</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-500" />
                <p className="font-medium">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
