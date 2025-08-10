/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { getApiUrl } from "@/lib/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/providers/auth";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  ShieldCheck,
  Smartphone,
  Globe,
  Camera,
  Trash2,
  Upload,
  MonitorSmartphone,
  Link as LinkIcon,
  Eye,
  EyeOff,
} from "lucide-react";

/* ------------ types según tus endpoints ------------ */
type MeResponse = {
  userId: string;
  email: string;
  userName: string;
  roles: string[];
  permissions: string[];
};

type UserDetails = {
  Id: string;
  Email: string;
  Name?: string | null;
  User: string;        // username
  Avatar?: string | null;
  CreatedAt?: string;  // si tu modelo lo expone
};

type UpdateUserPayload = {
  Name?: string | null;
  User?: string;
  Avatar?: string | null;
  Password?: string | null; // opcional
};

type SessionLog = {
  id?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt?: string | null;
  expiresAt?: string | null;
};

/* ----------------- helpers fetch ----------------- */
async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, { credentials: "include" });
  if (!res.ok) {
    try {
      const j = await res.json();
      throw new Error(j?.message || JSON.stringify(j));
    } catch {
      throw new Error(await res.text());
    }
  }
  return res.json();
}

async function apiPatch<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    try {
      const j = await res.json();
      throw new Error(j?.message || JSON.stringify(j));
    } catch {
      throw new Error(await res.text());
    }
  }
  return res.json();
}

/* ----------------- UI helpers ----------------- */
function KV({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="col-span-2">{value ?? "-"}</div>
    </div>
  );
}

/* ----------------- Page ----------------- */
export const AccountPage = () => {
  const { userName: authName, email: authEmail } = useAuth();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // sesiones
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // avatar local (se guarda al hacer submit del perfil)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // password opcional (no se envía si está vacío)
  const [showPwd, setShowPwd] = useState(false);

  const initials = useMemo(() => {
    const raw = userDetails?.Name || me?.userName || authName || "U";
    return raw.split(" ").map((x) => x[0]).join("").toUpperCase();
  }, [userDetails?.Name, me?.userName, authName]);

  /* ------- cargar /me y /users/:userId ------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const m = await apiGet<MeResponse>("/me");
        if (!mounted) return;
        setMe(m);

        const u = await apiGet<UserDetails>(`/users/${m.userId}`);
        if (!mounted) return;
        setUserDetails(u);
        setAvatarUrl(u.Avatar ?? null);
      } catch {
        toast({
          title: "Error",
          description: "No se pudo cargar tu cuenta.",
          variant: "destructive",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ------- cargar sesiones (solo lectura) ------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const logs = await apiGet<SessionLog[]>("/api/sessions");
        if (!mounted) return;
        setSessions(logs || []);
      } catch {
        // silencioso si no está implementado
      } finally {
        if (mounted) setLoadingSessions(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ------- forms ------- */
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateUserPayload>({
    defaultValues: {
      Name: "",
      User: "",
      Avatar: null,
      Password: "", // opcional
    },
  });

  // cuando cambien userDetails / avatar, hidrata el formulario
  useEffect(() => {
    reset({
      Name: userDetails?.Name ?? "",
      User: userDetails?.User ?? "",
      Avatar: avatarUrl ?? null,
      Password: "", // nunca rellenamos password
    });
  }, [userDetails, avatarUrl, reset]);

  const onSave = async (data: UpdateUserPayload) => {
    if (!me?.userId) return;
    try {
      const pwdToSend =
        data.Password && data.Password.trim().length >= 6
          ? data.Password.trim()
          : undefined;

      const payload: UpdateUserPayload = {
        Name: (data.Name ?? "").trim() || null,
        User: data.User?.trim(),
        Avatar: avatarUrl ?? null,
        ...(pwdToSend ? { Password: pwdToSend } : {}),
      };

      const updated = await apiPatch<UserDetails>(`/users/${me.userId}`, payload);
      setUserDetails(updated);
      setAvatarUrl(updated.Avatar ?? null);

      toast({
        title: "Perfil actualizado",
        description: pwdToSend
          ? "Datos y contraseña guardados correctamente."
          : "Datos guardados correctamente.",
      });

      reset({
        Name: updated.Name ?? "",
        User: updated.User,
        Avatar: updated.Avatar ?? null,
        Password: "",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "No se pudo actualizar el perfil.",
        variant: "destructive",
      });
    }
  };

  // Subir archivo (solo preview local). Persistes al guardar.
  const onPickAvatar = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setAvatarUrl(dataUrl);
      setValue("Avatar", dataUrl);
    };
    reader.readAsDataURL(file);
    toast({
      title: "Avatar listo para guardar",
      description: "Haz clic en 'Guardar cambios' para persistirlo.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pl-4 pt-6">
        <div className="max-w-7xl">
          <p className="text-muted-foreground">Cargando cuenta…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pl-4 pt-6">
      <div className="max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Cuenta</h1>
          <p className="text-slate-400 mt-1 sm:mt-2">
            Gestiona tu perfil y consulta tus permisos y sesiones.
          </p>
        </div>

        {/* Perfil */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-xl">
                <AvatarImage src={avatarUrl || undefined} alt={userDetails?.Name || "avatar"} />
                <AvatarFallback className="rounded-xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPickAvatar(f);
                  }}
                />
                <Button variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
                  <Camera className="h-4 w-4" />
                  Subir archivo
                </Button>

                {/* OPCIONAL: pegar URL manual para avatar */}
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2"
                  onClick={() => {
                    const u = prompt("Pega la URL pública de tu avatar:");
                    if (u) {
                      setAvatarUrl(u);
                      setValue("Avatar", u);
                      toast({
                        title: "Avatar preparado",
                        description: "Se guardará al confirmar cambios.",
                      });
                    }
                  }}
                >
                  <LinkIcon className="h-4 w-4" />
                  Usar URL
                </Button>

                {avatarUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="gap-2 text-red-600 hover:text-red-700"
                    onClick={() => {
                      setAvatarUrl(null);
                      setValue("Avatar", null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Quitar
                  </Button>
                ) : null}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input placeholder="Tu nombre" {...register("Name")} />
                </div>
                <div className="space-y-2">
                  <Label>Usuario</Label>
                  <Input placeholder="Tu usuario" {...register("User")} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Correo
                  </Label>
                  <Input value={me?.email ?? authEmail ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>ID Usuario</Label>
                  <Input value={me?.userId ?? ""} disabled />
                </div>
              </div>

              {/* OPCIONAL: cambiar contraseña (solo se envía si escribes >= 6 chars) */}
              <div className="space-y-2">
                <Label>Nueva contraseña (opcional)</Label>
                <div className="relative">
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    {...register("Password")}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2.5 text-muted-foreground"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Ocultar" : "Mostrar"}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Si dejas este campo vacío, no se cambia tu contraseña.
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  <Upload className="h-4 w-4" />
                  {isSubmitting ? "Guardando…" : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Roles & Permisos (de /me) */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Roles & Permisos
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-2 font-medium">Roles</h4>
                <div className="space-y-2">
                  {(me?.roles ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin roles asignados.</p>
                  ) : (
                    me?.roles?.map((r) => <KV key={r} label={r} value="" />)
                  )}
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Permisos</h4>
                <div className="space-y-2">
                  {(me?.permissions ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin permisos asignados.</p>
                  ) : (
                    me?.permissions?.map((p) => <KV key={p} label={p} value="" />)
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sesiones (solo lectura) */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MonitorSmartphone className="h-5 w-5" />
              Sesiones
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            {loadingSessions ? (
              <p className="text-sm text-muted-foreground">Cargando sesiones…</p>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay sesiones registradas.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((s, i) => (
                  <div key={s.id ?? i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        {s.userAgent || "Dispositivo"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                        <span>{s.ipAddress || "IP desconocida"}</span>
                        {s.createdAt ? (
                          <>
                            <span>•</span>
                            <span>Desde: {new Date(s.createdAt).toLocaleString("es-ES")}</span>
                          </>
                        ) : null}
                        {s.expiresAt ? (
                          <>
                            <span>•</span>
                            <span>Expira: {new Date(s.expiresAt).toLocaleString("es-ES")}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    {/* No hay endpoint para revocar; solo muestra */}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
