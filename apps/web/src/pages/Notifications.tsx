import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  Bell,
  ThermometerSun,
  AlertTriangle,
  Package,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

/* ----------------- Tipos ----------------- */
interface Warehouse {
  Id: string;
  Name: string;
}
interface Cargo {
  Id: string;
  TrackingCode?: string | null;
  Description?: string | null;
  Warehouse?: Warehouse | null;
}
interface User {
  Id: string;
  Name?: string | null;
  Email: string;
}
interface AlertItem {
  Id: string;
  Type: string;
  Message?: string | null;
  TriggeredAt: string; // ISO
  Resolved: boolean;
  Cargo: Cargo;
  Users?: User | null;
}
interface AlertsResponse {
  data: AlertItem[];
  total: number;
}

/* ----------------- fetch helpers ----------------- */
function qs(params: Record<string, any>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length) sp.append(k, String(v));
  });
  return sp.toString();
}
async function getJSON<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = params ? `${getApiUrl()}${path}?${qs(params)}` : `${getApiUrl()}${path}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text().catch(() => `GET ${path} failed`));
  return res.json();
}
async function patchJSON<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => `PATCH ${path} failed`));
  return res.json();
}


/* ----------------- API ----------------- */
const fetchAlerts = (params: Record<string, any>) =>
  getJSON<AlertsResponse>("/alerts", params);

const resolveAlert = (id: string, resolved: boolean) =>
  patchJSON(`/alerts/${id}/resolve`, { resolved });


/* ----------------- UI helpers ----------------- */
function typeLabel(t: string) {
  switch (t) {
    case "TEMPERATURE":
      return "Temperatura";
    case "DAMAGE":
      return "Daño";
    default:
      return t;
  }
}
function typeIcon(t: string) {
  switch (t) {
    case "TEMPERATURE":
      return <ThermometerSun className="h-4 w-4" />;
    case "DAMAGE":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}
function statusBadge(resolved: boolean) {
  return resolved ? (
    <Badge variant="secondary">Resuelta</Badge>
  ) : (
    <Badge variant="destructive">Pendiente</Badge>
  );
}

/* ----------------- Page ----------------- */
export const NotificationsPage = () => {
  const queryClient = useQueryClient();

  // filtros
  const [q, ] = useState("");
  const [status, ] = useState<"all" | "pending" | "resolved">("all");
  const [type, ] = useState<string>("all");

  // sel múltiple + paginación
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications", { q, status, type, page, pageSize }],
    queryFn: () => fetchAlerts({ q, status, type, page, pageSize }),
    // (opcional) auto-refresh cada X seg:
    // refetchInterval: 10000,
  });

  const mutationResolve = useMutation({
    mutationFn: ({ id, resolved }: { id: string; resolved: boolean }) =>
      resolveAlert(id, resolved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notificación actualizada");
    },
    onError: (e: any) => toast.error(e?.message || "No se pudo actualizar"),
  });

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleResolveOne = (id: string, resolved: boolean) => {
    mutationResolve.mutate({ id, resolved });
  };


  return (
    <div className="p-6 space-y-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          <p className="text-sm text-muted-foreground">
            Alertas del sistema relacionadas a tus cargas y operaciones.
          </p>
        </div>
      </div>

      {/* filtros */}
      

      {/* contenido */}
      <div className="space-y-3">
        {isLoading ? (
          <Card><CardContent className="p-6">Cargando…</CardContent></Card>
        ) : isError ? (
          <Card>
            <CardContent className="p-6 text-red-600">
              {String((error as any)?.message || "Error al cargar notificaciones")}
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card><CardContent className="p-6">No hay notificaciones.</CardContent></Card>
        ) : (
          items.map((a) => {
            const selectedThis = !!selected[a.Id];
            return (
              <Card key={a.Id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* checkbox selección */}
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4"
                      checked={selectedThis}
                      onChange={(e) =>
                        setSelected((prev) => ({ ...prev, [a.Id]: e.target.checked }))
                      }
                    />

                    {/* icono */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                        a.Resolved ? "bg-muted" : "bg-amber-100 dark:bg-amber-900/40"
                      }`}
                      title={typeLabel(a.Type)}
                    >
                      {typeIcon(a.Type)}
                    </div>

                    {/* contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{typeLabel(a.Type)}</span>
                        {statusBadge(a.Resolved)}
                        {a.Cargo?.TrackingCode ? (
                          <span className="inline-flex items-center text-xs text-muted-foreground gap-1">
                            <Package className="h-3.5 w-3.5" />
                            {a.Cargo.TrackingCode}
                          </span>
                        ) : null}
                        {a.Cargo?.Warehouse?.Name ? (
                          <span className="inline-flex items-center text-xs text-muted-foreground gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {a.Cargo.Warehouse.Name}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1 text-sm text-muted-foreground truncate" title={a.Message || ""}>
                        {a.Message || "—"}
                      </div>

                      <div className="mt-2 text-xs text-muted-foreground">
                        {format(new Date(a.TriggeredAt), "dd/MM/yyyy HH:mm")}
                      </div>
                    </div>

                    {/* acción */}
                    <div className="shrink-0">
                      <Button
                        size="sm"
                        variant={a.Resolved ? "outline" : "default"}
                        onClick={() => handleResolveOne(a.Id, !a.Resolved)}
                      >
                        {a.Resolved ? "Reabrir" : "Resolver"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* barra inferior: seleccionar visibles / paginación */}
      <div className="flex items-center justify-between pt-2">

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
