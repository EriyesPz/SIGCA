import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Alert,
  AlertDescription,
} from "@/components/ui";
import { MoreHorizontal, Eye, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { useSessionsLogs } from "@/lib/session";
import type { UseQueryResult } from "@tanstack/react-query";

type Session = {
  sessionId: string;
  token: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    username: string;
  };
};

export const Sessions = () => {
  const {
    data: sessions,
    isLoading,
    isError,
    error,
    refetch,
  }: UseQueryResult<Session[], Error> = useSessionsLogs();

  // Efecto para depuración
  useEffect(() => {
    console.log("Estado de carga:", isLoading);
    console.log("Error:", isError, error);
    console.log("Datos de sesiones:", sessions);
    
    if (sessions) {
      console.log("Número de sesiones:", sessions.length);
      if (sessions.length > 0) {
        console.log("Primera sesión:", sessions[0]);
      }
    }
  }, [sessions, isLoading, isError, error]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      console.error("Error formateando fecha:", dateString, e);
      return "Fecha inválida";
    }
  };

  const getStatus = (expiresAt: string) => {
    try {
      return new Date(expiresAt) > new Date() ? "Activa" : "Expirada";
    } catch (e) {
      console.error("Error verificando estado:", expiresAt, e);
      return "Error";
    }
  };

  const getStatusColor = (expiresAt: string) => {
    try {
      return new Date(expiresAt) > new Date() ? "bg-green-500" : "bg-red-500";
    } catch (e) {
      console.error("Error determinando color:", expiresAt, e);
      return "bg-gray-500";
    }
  };

  if (isLoading) {
    console.log("Renderizando estado de carga...");
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
        Cargando sesiones...
      </div>
    );
  }

  if (isError) {
    console.error("Error detectado:", error);
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar las sesiones: {error?.message || "Error desconocido"}
            <div className="mt-2 text-xs">
              {JSON.stringify(error, null, 2)}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  console.log("Preparando para renderizar sesiones...", sessions);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sesiones de Usuarios</h1>
            <p className="text-slate-400 mt-2">
              Lista de todas las sesiones activas e históricas
            </p>
          </div>
          <Button 
            variant="outline" 
            className="text-slate-300 hover:text-white"
            onClick={() => {
              console.log("Refrescando datos...");
              refetch();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Sesiones</CardTitle>
                <CardDescription>
                  {sessions?.length ?? 0} sesiones encontradas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <>
                <div className="hidden">
                  {/* Mensaje de depuración oculto */}
                  Datos completos: {JSON.stringify(sessions, null, 2)}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Usuario</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Dispositivo</TableHead>
                      <TableHead className="text-slate-300">IP</TableHead>
                      <TableHead className="text-slate-300">Creada</TableHead>
                      <TableHead className="text-slate-300">Expira</TableHead>
                      <TableHead className="text-slate-300">Estado</TableHead>
                      <TableHead className="text-slate-300">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session, index) => {
                      console.log(`Renderizando sesión ${index}:`, session);
                      return (
                        <TableRow key={session.sessionId} className="border-slate-700">
                          <TableCell className="text-white font-medium">
                            {session.user.username || session.user.name || "N/A"}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {session.user.email}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="max-w-[200px] truncate">
                              {session.userAgent}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {session.ipAddress}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {formatDate(session.createdAt)}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {formatDate(session.expiresAt)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(session.expiresAt)} text-white border-transparent`}
                            >
                              {getStatus(session.expiresAt)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-slate-800 border-slate-700"
                              >
                                <DropdownMenuLabel className="text-white">
                                  Acciones
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem className="text-slate-300 hover:text-white">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem className="text-red-400 hover:text-red-300">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Terminar sesión
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                No se encontraron sesiones
                <div className="mt-2 text-xs">
                  {sessions ? "La respuesta fue un array vacío" : "La respuesta fue null/undefined"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};