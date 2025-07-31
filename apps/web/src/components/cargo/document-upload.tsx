import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, FileText, ImageIcon, File, X, Eye, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { DocumentUpload as DocumentUploadType } from "@/lib/types"

interface DocumentUploadProps {
  documents: DocumentUploadType[]
  onDocumentsChange: (documents: DocumentUploadType[]) => void
}

const documentTypes = [
  { value: "invoice", label: "Factura", icon: FileText },
  { value: "certificate", label: "Certificado", icon: FileText },
  { value: "photo", label: "Fotografía", icon: ImageIcon },
  { value: "other", label: "Otro", icon: File },
]

export const DocumentUpload = ({ documents, onDocumentsChange }: DocumentUploadProps) => {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const newDocuments: DocumentUploadType[] = files.map((file) => ({
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      type: "other",
      metadata: {},
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))

    onDocumentsChange([...documents, ...newDocuments])

    toast({
      title: "Archivos agregados",
      description: `Se agregaron ${files.length} archivo(s) exitosamente.`,
    })
  }

  const removeDocument = (id: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== id)
    onDocumentsChange(updatedDocuments)

    toast({
      title: "Archivo eliminado",
      description: "El archivo ha sido eliminado de la lista.",
    })
  }

  const updateDocumentType = (id: string, type: DocumentUploadType["type"]) => {
    const updatedDocuments = documents.map((doc) => (doc.id === id ? { ...doc, type } : doc))
    onDocumentsChange(updatedDocuments)
  }

  const updateDocumentMetadata = (id: string, key: string, value: string) => {
    const updatedDocuments = documents.map((doc) =>
      doc.id === id ? { ...doc, metadata: { ...doc.metadata, [key]: value } } : doc,
    )
    onDocumentsChange(updatedDocuments)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.includes("pdf")) return FileText
    return File
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Documentos Adjuntos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Arrastra archivos aquí o haz clic para seleccionar
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Soporta: PDF, imágenes, documentos de texto (máx. 10MB por archivo)
          </p>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            Seleccionar Archivos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
            className="hidden"
          />
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Archivos Adjuntos ({documents.length})</h3>
              <Badge variant="outline">
                {documents.reduce((total, doc) => total + doc.file.size, 0) > 0
                  ? formatFileSize(documents.reduce((total, doc) => total + doc.file.size, 0))
                  : "0 Bytes"}
              </Badge>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => {
                const FileIcon = getFileIcon(doc.file)
                const docType = documentTypes.find((type) => type.value === doc.type)

                return (
                  <div key={doc.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start gap-4">
                      {/* File Icon/Preview */}
                      <div className="flex-shrink-0">
                        {doc.preview ? (
                          <div className="w-16 h-16 rounded border overflow-hidden">
                            <img
                              src={doc.preview || "/placeholder.svg"}
                              alt={doc.file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded border bg-white dark:bg-gray-700 flex items-center justify-center">
                            <FileIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{doc.file.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(doc.file.size)} • {doc.file.type || "Tipo desconocido"}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(doc.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <Separator className="my-3" />

                        {/* Document Type and Metadata */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor={`type-${doc.id}`}>Tipo de Documento</Label>
                              <Select
                                value={doc.type}
                                onValueChange={(value) =>
                                  updateDocumentType(doc.id, value as DocumentUploadType["type"])
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {documentTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center gap-2">
                                        <type.icon className="w-4 h-4" />
                                        {type.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`description-${doc.id}`}>Descripción</Label>
                              <Input
                                id={`description-${doc.id}`}
                                value={doc.metadata.description || ""}
                                onChange={(e) => updateDocumentMetadata(doc.id, "description", e.target.value)}
                                placeholder="Descripción del documento"
                              />
                            </div>
                          </div>

                          {/* Additional metadata based on document type */}
                          {doc.type === "invoice" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`invoice-number-${doc.id}`}>Número de Factura</Label>
                                <Input
                                  id={`invoice-number-${doc.id}`}
                                  value={doc.metadata.invoiceNumber || ""}
                                  onChange={(e) => updateDocumentMetadata(doc.id, "invoiceNumber", e.target.value)}
                                  placeholder="INV-001"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`invoice-date-${doc.id}`}>Fecha de Factura</Label>
                                <Input
                                  id={`invoice-date-${doc.id}`}
                                  type="date"
                                  value={doc.metadata.invoiceDate || ""}
                                  onChange={(e) => updateDocumentMetadata(doc.id, "invoiceDate", e.target.value)}
                                />
                              </div>
                            </div>
                          )}

                          {doc.type === "certificate" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`cert-type-${doc.id}`}>Tipo de Certificado</Label>
                                <Input
                                  id={`cert-type-${doc.id}`}
                                  value={doc.metadata.certificateType || ""}
                                  onChange={(e) => updateDocumentMetadata(doc.id, "certificateType", e.target.value)}
                                  placeholder="Ej. Calidad, Origen, etc."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`cert-expiry-${doc.id}`}>Fecha de Vencimiento</Label>
                                <Input
                                  id={`cert-expiry-${doc.id}`}
                                  type="date"
                                  value={doc.metadata.expiryDate || ""}
                                  onChange={(e) => updateDocumentMetadata(doc.id, "expiryDate", e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Document Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {docType && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <docType.icon className="w-3 h-3" />
                              {docType.label}
                            </Badge>
                          )}

                          {doc.preview && (
                            <Button variant="ghost" size="sm" onClick={() => window.open(doc.preview, "_blank")}>
                              <Eye className="w-4 h-4 mr-1" />
                              Vista Previa
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Recomendaciones para documentos:</p>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Asegúrate de que los documentos sean legibles y estén completos</li>
                <li>• Los archivos PDF son preferibles para documentos oficiales</li>
                <li>• Las imágenes deben tener buena resolución (mínimo 300 DPI)</li>
                <li>• Incluye toda la documentación requerida antes de finalizar</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
