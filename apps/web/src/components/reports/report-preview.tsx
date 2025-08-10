"use client";

import { useState } from "react";
import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  FileText,
  Calendar,
  Building,
  User,
} from "lucide-react";

interface ReportPreviewProps {
  title: string;
  data: any[];
  summary: Record<string, any>;
  dateRange: string;
  onDownloadPDF: () => void;
  onDownloadExcel: () => void;
  children: React.ReactNode;
}

export const ReportPreview = ({
  title,
  data,
  summary,
  dateRange,
  onDownloadPDF,
  onDownloadExcel,
  children,
}: ReportPreviewProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {/* Título + meta */}
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {data.length} registros • {dateRange}
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Vista previa del reporte
                    </DialogTitle>
                  </DialogHeader>

                  <div className="mt-4">
                    <ReportDocument
                      title={title}
                      dateRange={dateRange}
                      summary={summary}
                      data={data}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={onDownloadPDF}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Descargar PDF
              </Button>

              <Button
                onClick={onDownloadExcel}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido inyectado por los hijos */}
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                DOCUMENTO PDF                               */
/* -------------------------------------------------------------------------- */

interface ReportDocumentProps {
  title: string;
  dateRange: string;
  summary: Record<string, any>;
  data: any[];
}

const ReportDocument = ({
  title,
  dateRange,
  summary,
  data,
}: ReportDocumentProps) => {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-8 text-gray-900 dark:bg-card dark:text-white">
      {/* Encabezado */}
      <div className="mb-6 border-b-2 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Sistema de Gestión de Almacén
            </p>
          </div>

          <div className="text-right text-gray-600 dark:text-gray-300">
            <div className="mb-1 flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Período: {dateRange}</span>
            </div>
            <div className="mb-1 flex items-center gap-2 text-sm">
              <Building className="h-4 w-4" />
              <span>Almacén Central</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>Supervisor: Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">Resumen ejecutivo</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(summary).map(([k, v]) => (
            <div key={k} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-sm capitalize text-gray-600 dark:text-gray-400">
                {k.replace(/([A-Z])/g, " $1").toLowerCase()}
              </p>
              <p className="text-lg font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">Detalle de registros</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700/50">
                {data[0] &&
                  Object.keys(data[0]).map((h) => (
                    <th
                      key={h}
                      className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold dark:border-gray-600"
                    >
                      {h
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {data.slice(0, 20).map((row, i) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0
                      ? "bg-white dark:bg-card"
                      : "bg-gray-50 dark:bg-gray-800/40"
                  }
                >
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="border border-gray-300 px-3 py-2 text-sm dark:border-gray-600"
                    >
                      {typeof val === "object"
                        ? JSON.stringify(val)
                        : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {data.length > 20 && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Mostrando los primeros 20 registros de {data.length} en total
            </p>
          )}
        </div>
      </div>

      {/* Pie de página */}
      <div className="mt-8 border-t border-gray-300 pt-4 dark:border-gray-600">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p>
              <strong>Reporte generado:</strong>{" "}
              {new Date().toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Total de registros:</strong> {data.length}
            </p>
          </div>
          <div className="text-right">
            <p>Sistema de Gestión de Almacén</p>
            <p>Versión 2.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};
