"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, ImageIcon, X, Plus } from "lucide-react"
import { documentTypes } from "@/data/warehouse-data"
import type { DocumentUpload as DocumentUploadType } from "@/lib/types";

interface DocumentUploadProps {
  documents: DocumentUploadType[]
  onDocumentsChange: (documents: DocumentUploadType[]) => void
}

export const DocumentUpload = ({ documents, onDocumentsChange }: DocumentUploadProps) => {
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const newDocument: DocumentUploadType = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: "other",
        metadata: {},
      }

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newDocument.preview = e.target?.result as string
          onDocumentsChange([...documents, newDocument])
        }
        reader.readAsDataURL(file)
      } else {
        onDocumentsChange([...documents, newDocument])
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const updateDocument = (id: string, updates: Partial<DocumentUploadType>) => {
    onDocumentsChange(documents.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)))
  }

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter((doc) => doc.id !== id))
  }

  const addMetadataField = (docId: string) => {
    const doc = documents.find((d) => d.id === docId)
    if (doc) {
      const newKey = `campo_${Object.keys(doc.metadata).length + 1}`
      updateDocument(docId, {
        metadata: { ...doc.metadata, [newKey]: "" },
      })
    }
  }

  const updateMetadata = (docId: string, key: string, value: string) => {
    const doc = documents.find((d) => d.id === docId)
    if (doc) {
      updateDocument(docId, {
        metadata: { ...doc.metadata, [key]: value },
      })
    }
  }

  const removeMetadataField = (docId: string, key: string) => {
    const doc = documents.find((d) => d.id === docId)
    if (doc) {
      const newMetadata = { ...doc.metadata }
      delete newMetadata[key]
      updateDocument(docId, { metadata: newMetadata })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Documentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">Arrastra archivos aquí</p>
          <p className="text-sm text-gray-500 mb-4">o haz clic para seleccionar</p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer">
              Seleccionar Archivos
            </Button>
          </label>
          <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG hasta 10MB</p>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Archivos Subidos ({documents.length})</Label>
            {documents.map((doc) => (
              <Card key={doc.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      {doc.preview ? (
                        <img
                          src={doc.preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                          {doc.file.type.includes("pdf") ? (
                            <FileText className="w-8 h-8 text-red-500" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-500" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* File Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{doc.file.name}</p>
                          <p className="text-xs text-gray-500">{(doc.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeDocument(doc.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Document Type */}
                      <div className="space-y-2">
                        <Label htmlFor={`type-${doc.id}`}>Tipo de Documento</Label>
                        <Select value={doc.type} onValueChange={(value) => updateDocument(doc.id, { type: value as DocumentUploadType["type"] })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Metadatos</Label>
                          <Button variant="outline" size="sm" onClick={() => addMetadataField(doc.id)}>
                            <Plus className="w-3 h-3 mr-1" />
                            Agregar Campo
                          </Button>
                        </div>

                        {Object.entries(doc.metadata).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <Input
                              placeholder="Clave"
                              value={key}
                              onChange={(e) => {
                                const newKey = e.target.value
                                const newMetadata = { ...doc.metadata }
                                delete newMetadata[key]
                                newMetadata[newKey] = value
                                updateDocument(doc.id, { metadata: newMetadata })
                              }}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Valor"
                              value={value}
                              onChange={(e) => updateMetadata(doc.id, key, e.target.value)}
                              className="flex-1"
                            />
                            <Button variant="ghost" size="sm" onClick={() => removeMetadataField(doc.id, key)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}

                        {Object.keys(doc.metadata).length === 0 && (
                          <p className="text-sm text-gray-500 italic">No hay metadatos agregados</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
