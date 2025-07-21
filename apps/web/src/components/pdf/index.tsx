import { X, FileText } from "lucide-react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import React from "react";

interface ColumnDefinition {
  header: string;
  accessor: string;
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
}

interface PDFPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  columns: ColumnDefinition[];
  data: Record<string, any>[];
  summarySection?: React.ReactNode;
  analysisSection?: React.ReactNode;
  footerNote?: string;
  onExport?: () => void;
}

export function PDFPreview({
  isOpen,
  onClose,
  title,
  columns,
  data,
  summarySection,
  analysisSection,
  footerNote,
  onExport,
}: PDFPreviewProps) {
  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 w-full max-w-4xl h-full max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Vista Previa - Reporte PDF
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenido del PDF */}
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-800 p-8">
          <div
            className="bg-white dark:bg-slate-950 shadow-lg mx-auto"
            style={{ width: "210mm", minHeight: "297mm" }}
          >
            <div className="p-12">
              <div className="border-b-2 border-gray-300 dark:border-slate-700 pb-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      SAN-EHISA
                    </h1>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                  {title}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-slate-300">
                  <div>
                    <p>
                      <span className="font-semibold">Fecha de reporte:</span>{" "}
                      {currentDate}
                    </p>
                    <p>
                      <span className="font-semibold">Período analizado:</span>{" "}
                      2024-01-01 - 2024-01-31
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Terminal:</span> La Mesa
                    </p>
                    <p>
                      <span className="font-semibold">Operador:</span> SAN-EHISA
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumen Ejecutivo */}
              {summarySection && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
                    Resumen Ejecutivo
                  </h3>
                  {summarySection}
                </div>
              )}

              {/* Tabla */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
                  Detalles
                </h3>
                <div className="border border-gray-300 dark:border-slate-700 rounded">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-slate-800">
                        {columns.map((col, idx) => (
                          <TableHead
                            key={idx}
                            className="text-gray-900 dark:text-slate-100 font-semibold text-xs p-2 border-r border-gray-300 dark:border-slate-700"
                          >
                            {col.header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, rowIdx) => (
                        <TableRow key={rowIdx} className="text-xs">
                          {columns.map((col, colIdx) => (
                            <TableCell
                              key={colIdx}
                              className="p-2 border-r border-gray-300 dark:border-slate-700 text-gray-800 dark:text-slate-100"
                            >
                              {col.render
                                ? col.render(row[col.accessor], row)
                                : row[col.accessor]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Análisis y recomendaciones */}
              {analysisSection && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
                    Análisis y Recomendaciones
                  </h3>
                  {analysisSection}
                </div>
              )}

              {/* Footer */}
              <div className="border-t-2 border-gray-300 dark:border-slate-700 pt-4 text-xs text-gray-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <div>
                    <p>SAN</p>
                    <p>Reporte generado automáticamente</p>
                  </div>
                  <div className="text-right">
                    <p>{currentDate}</p>
                    <p>Página 1 de 1</p>
                  </div>
                </div>
              </div>

              {/* Nota opcional */}
              {footerNote && (
                <div className="mt-4 text-xs text-gray-500 dark:text-slate-400">
                  {footerNote}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer del modal */}
        <div className="p-4 border-t bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onExport}
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
