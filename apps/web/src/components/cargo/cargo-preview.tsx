"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Code, Package, MapPin, FileText, User, Calendar } from "lucide-react"
import { statusOptions } from "@/data/warehouse-data"
import type { CargoFormData } from "@/lib/types";

interface CargoPreviewProps {
  formData: CargoFormData
  showJson?: boolean
}

export const CargoPreview = ({ formData, showJson = false }: CargoPreviewProps) => {
  const statusOption = statusOptions.find((s) => s.value === formData.status)

  const jsonPayload = {
    trackingCode: formData.trackingCode,
    description: formData.description,
    status: formData.status,
    weightKg: formData.weightKg,
    quantity: formData.quantity,
    entryDate: formData.entryDate,
    isPerishable: formData.isPerishable,
    location: {
      warehouseId: formData.warehouseId,
      rackId: formData.rackId,
      level: formData.level,
      column: formData.column,
    },
    documents: formData.documents.map((doc) => ({
      name: doc.file.name,
      type: doc.type,
      size: doc.file.size,
      metadata: doc.metadata,
    })),
    audit: {
      createdBy: formData.createdBy,
      createdAt: new Date().toISOString(),
    },
  }

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
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(jsonPayload, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
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
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold">Información de Carga</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Código de Seguimiento:</span>
              <p className="font-mono font-medium">{formData.trackingCode || "—"}</p>
            </div>
            <div>
              <span className="text-gray-600">Estado:</span>
              <div className="mt-1">
                {statusOption ? (
                  <Badge className={`${statusOption.color} text-white`}>{statusOption.label}</Badge>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Peso:</span>
              <p className="font-medium">{formData.weightKg ? `${formData.weightKg} kg` : "—"}</p>
            </div>
            <div>
              <span className="text-gray-600">Cantidad:</span>
              <p className="font-medium">{formData.quantity || "—"}</p>
            </div>
            <div>
              <span className="text-gray-600">Fecha de Entrada:</span>
              <p className="font-medium">{formData.entryDate || "—"}</p>
            </div>
            <div>
              <span className="text-gray-600">Perecedero:</span>
              <p className="font-medium">{formData.isPerishable ? "Sí" : "No"}</p>
            </div>
          </div>

          {formData.description && (
            <div>
              <span className="text-gray-600">Descripción:</span>
              <p className="mt-1 text-sm bg-gray-50 p-3 rounded">{formData.description}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Location Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <h3 className="font-semibold">Ubicación</h3>
          </div>

          {formData.warehouseId && formData.rackId && formData.level && formData.column ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Almacén:</span>
                  <p className="font-medium">{formData.warehouseId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Rack:</span>
                  <p className="font-medium">{formData.rackId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Nivel:</span>
                  <p className="font-medium">{formData.level}</p>
                </div>
                <div>
                  <span className="text-gray-600">Columna:</span>
                  <p className="font-medium">{formData.column}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No se ha seleccionado ubicación</p>
          )}
        </div>

        <Separator />

        {/* Documents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold">Documentos ({formData.documents.length})</h3>
          </div>

          {formData.documents.length > 0 ? (
            <div className="space-y-2">
              {formData.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
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

        {/* Audit Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold">Información de Auditoría</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Creado por:</span>
              <p className="font-medium">{formData.createdBy || "—"}</p>
            </div>
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
  )
}
