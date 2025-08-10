// src/pages/AlertsPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { getApiUrl } from "@/lib/client";

/* ----------------- Tipos ----------------- */
interface Warehouse {
  Id: string;
  Name: string;
}
interface Cargo {
  Id: string;
  TrackingCode: string;
  Description: string;
  Warehouse?: Warehouse;
}
interface User {
  Id: string;
  Name?: string | null;
  Email: string;
}
interface Alert {
  Id: string;
  Type: string;
  Message?: string | null;
  TriggeredAt: string;
  Resolved: boolean;
  Cargo: Cargo;
  Users?: User | null;
}

interface AlertsResponse {
  data: Alert[];
  total: number;
}

/* ----------------- Helpers fetch ----------------- */
function buildQuery(params: Record<string, any>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
  });
  return qs.toString();
}

async function getJSON<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = params ? `${getApiUrl()}${path}?${buildQuery(params)}` : `${getApiUrl()}${path}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `GET ${path} failed (${res.status})`);
  }
  return res.json();
}

async function patchJSON<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `PATCH ${path} failed (${res.status})`);
  }
  return res.json();
}


/* ----------------- API Calls ----------------- */
async function fetchAlerts(params: Record<string, any>) {
  return getJSON<AlertsResponse>("/alerts", params);
}

async function resolveAlert(id: string, resolved: boolean) {
  return patchJSON(`/alerts/${id}/resolve`, { resolved });
}

/* ----------------- Page ----------------- */
export const AlertsPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // all | pending | resolved
  const [type, setType] = useState("all");     // all | TEMPERATURE | DAMAGE | ...
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["alerts", { search, status, type, page, pageSize }],
    queryFn: () =>
      fetchAlerts({
        q: search,
        status,
        type,
        page,
        pageSize,
      }),
  });

  const mutationResolve = useMutation({
    mutationFn: ({ id, resolved }: { id: string; resolved: boolean }) => resolveAlert(id, resolved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alerta actualizada");
    },
    onError: (e: any) => {
      toast.error(e?.message || "No se pudo actualizar la alerta");
    },
  });


  const handleResolve = (id: string, resolved: boolean) => {
    mutationResolve.mutate({ id, resolved });
  };

  const typeLabel = (t: string) => {
    switch (t) {
      case "TEMPERATURE":
        return "Temperatura";
      case "DAMAGE":
        return "Daño";
      default:
        return t;
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Alertas</h1>

      {/* Filtros */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="resolved">Resueltas</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={type}
          onValueChange={(v) => {
            setType(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="TEMPERATURE">Temperatura</SelectItem>
            <SelectItem value="DAMAGE">Daño</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Almacén</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-red-600">
                  {String((error as any)?.message || "Error al cargar las alertas")}
                </TableCell>
              </TableRow>
            ) : (data?.data ?? []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Sin resultados.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((alert) => (
                <TableRow key={alert.Id}>
                  <TableCell>{format(new Date(alert.TriggeredAt), "dd/MM/yyyy HH:mm")}</TableCell>
                  <TableCell>{typeLabel(alert.Type)}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate" title={alert.Message || ""}>
                      {alert.Message || "-"}
                    </div>
                  </TableCell>
                  <TableCell>{alert.Cargo?.TrackingCode || "-"}</TableCell>
                  <TableCell>{alert.Cargo?.Warehouse?.Name || "-"}</TableCell>
                  <TableCell>
                    {alert.Resolved ? (
                      <Badge variant="secondary">Resuelta</Badge>
                    ) : (
                      <Badge variant="destructive">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={alert.Resolved ? "outline" : "default"}
                      onClick={() => handleResolve(alert.Id, !alert.Resolved)}
                      
                    >
                      {alert.Resolved ? "Reabrir" : "Resolver"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Anterior
        </Button>
        <span>
          Página {page} de {Math.max(1, Math.ceil((data?.total || 0) / pageSize))}
        </span>
        <Button
          variant="outline"
          disabled={page * pageSize >= (data?.total || 0)}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
