import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Label,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui";
import { MoreHorizontal, Eye, AlertCircle } from "lucide-react";
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
  }: UseQueryResult<Session[], Error> = useSessionsLogs();

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10); // Número de sesiones por página

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

  // Lógica de paginación
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions =
    sessions?.slice(indexOfFirstSession, indexOfLastSession) || [];
  const totalPages = sessions
    ? Math.ceil(sessions.length / sessionsPerPage)
    : 0;

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Máximo número de páginas a mostrar en la paginación

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Mostrar páginas alrededor de la página actual
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      pageNumbers.push(1);

      if (startPage > 2) {
        pageNumbers.push(-1); // -1 representa el ellipsis
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push(-1); // -1 representa el ellipsis
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

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

  const openSessionDetails = (session: Session) => {
    setSelectedSession(session);
    setIsDialogOpen(true);
  };

  const closeSessionDetails = () => {
    setIsDialogOpen(false);
    setSelectedSession(null);
  };

  if (isLoading) {
    console.log("Renderizando estado de carga...");
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        Cargando sesiones...
      </div>
    );
  }

  if (isError) {
    console.error("Error detectado:", error);
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar las sesiones:{" "}
            {error?.message || "Error desconocido"}
            <div className="mt-2 text-xs">{JSON.stringify(error, null, 2)}</div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen pl-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Sesiones de Usuarios
        </h1>
        <p className=" mt-1 sm:mt-2">
          Lista de todas las sesiones activas e históricas
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <Card className="">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="">Sesiones</CardTitle>
                <CardDescription>
                  Mostrando {currentSessions.length} de {sessions?.length ?? 0}{" "}
                  sesiones
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="">
                      <TableHead className="">Usuario</TableHead>
                      <TableHead className="">Email</TableHead>
                      <TableHead className="">
                        Dispositivo
                      </TableHead>
                      <TableHead className="">IP</TableHead>
                      <TableHead className="">Creada</TableHead>
                      <TableHead className="">Expira</TableHead>
                      <TableHead className="">Estado</TableHead>
                      <TableHead className="">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSessions.map((session) => (
                      <TableRow
                        key={session.sessionId}
                        className=""
                      >
                        <TableCell className=" font-medium">
                          {session.user.username || session.user.name || "N/A"}
                        </TableCell>
                        <TableCell className="">
                          {session.user.email}
                        </TableCell>
                        <TableCell className="">
                          <div className="max-w-[200px] truncate">
                            {session.userAgent}
                          </div>
                        </TableCell>
                        <TableCell className="">
                          {session.ipAddress}
                        </TableCell>
                        <TableCell className="">
                          {formatDate(session.createdAt)}
                        </TableCell>
                        <TableCell className="">
                          {formatDate(session.expiresAt)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              session.expiresAt
                            )}  border-transparent`}
                          >
                            {getStatus(session.expiresAt)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0  :"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className=" "
                            >
                              <DropdownMenuLabel className="">
                                Acciones
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="" />
                              <DropdownMenuItem
                                className=" :"
                                onClick={() => openSessionDetails(session)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="" />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e: any) => {
                              e.preventDefault();
                              if (currentPage > 1) {
                                paginate(currentPage - 1);
                              }
                            }}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          >
                            Anterior
                          </PaginationPrevious>
                        </PaginationItem>

                        {getPageNumbers().map((number, index) => (
                          <PaginationItem key={index}>
                            {number === -1 ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  paginate(number);
                                }}
                                isActive={number === currentPage}
                              >
                                {number}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) {
                                paginate(currentPage + 1);
                              }
                            }}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          >
                            Siguiente
                          </PaginationNext>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 ">
                No se encontraron sesiones
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para detalles de sesión */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="">
                Detalles de Sesión
              </DialogTitle>
              <DialogDescription className="">
                Información detallada de la sesión seleccionada
              </DialogDescription>
            </DialogHeader>

            {selectedSession && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="">Usuario</Label>
                    <div className="">
                      {selectedSession.user.username ||
                        selectedSession.user.name ||
                        "N/A"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="">Email</Label>
                    <div className="">
                      {selectedSession.user.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="">ID de Sesión</Label>
                  <div className=" font-mono text-sm p-2  rounded">
                    {selectedSession.sessionId}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="">Estado</Label>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(
                        selectedSession.expiresAt
                      )}  border-transparent`}
                    >
                      {getStatus(selectedSession.expiresAt)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="">Dirección IP</Label>
                    <div className="">
                      {selectedSession.ipAddress}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="">Creada</Label>
                    <div className="">
                      {formatDate(selectedSession.createdAt)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="">Expira</Label>
                    <div className="">
                      {formatDate(selectedSession.expiresAt)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="">
                    Dispositivo/Navegador
                  </Label>
                  <div className=" p-2  rounded">
                    {selectedSession.userAgent}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeSessionDetails}
                className="  :"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
