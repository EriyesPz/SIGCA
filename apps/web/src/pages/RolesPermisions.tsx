import { useState } from "react";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
} from "@/components/ui";
import {
  MoreHorizontal,
  Shield,
  Users,
  Activity,
  Eye,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import { useListUsers } from "@/lib/users";
import { type UserType } from "@/types/user";

export const RolesPermissions = () => {
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users } = useListUsers();

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-500" : "bg-red-500";
  };

  const handleViewClick = (user: UserType) => {
    setViewingUser(user);
    setIsViewUserOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sesiones y Logs</h1>
            <p className="text-slate-400 mt-2">
              Muestra y gestiona las sesiones de los usuarios.
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="identity" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Identity Management
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Sesiones
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center space-x-2 mt-4">
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Usuario</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">
                        Último Login
                      </TableHead>
                      <TableHead className="text-slate-300">Roles</TableHead>
                      <TableHead className="text-slate-300">Estado</TableHead>
                      <TableHead className="text-slate-300">Creado</TableHead>
                      <TableHead className="text-slate-300">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(users ?? []).map((user: UserType) => (
                      <TableRow
                        key={user.Id}
                        className="border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-colors"
                        onClick={() => handleViewClick(user)}
                      >
                        <TableCell className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.Avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-slate-700 text-white">
                              {user.User.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white font-medium">
                            {user.User}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {user.Email}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {formatDate(user.LastSessionAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.Roles.map((role) => (
                              <Badge
                                key={role.Id}
                                variant="secondary"
                                className="bg-slate-700 text-slate-300"
                              >
                                {role.Name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(
                                user.IsActive
                              )}`}
                            ></div>
                            <span className="text-slate-300">
                              {user.IsActive ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-300">
                            {new Date(user.CreatedAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
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
                              <DropdownMenuItem
                                className="text-slate-300 hover:text-white"
                                onClick={() => handleViewClick(user)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-slate-300 hover:text-white"
                                onClick={() => handleViewClick(user)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300 hover:text-white">
                                <Shield className="mr-2 h-4 w-4" />
                                Gestionar roles
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-700" />
                              <DropdownMenuItem className="text-red-400 hover:text-red-300">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Dialog para ver usuario */}
            <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
              <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Detalles del Usuario</DialogTitle>
                  <DialogDescription>Información detallada del usuario</DialogDescription>
                </DialogHeader>
                {viewingUser && (
                  <div className="grid gap-6 py-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={viewingUser.Avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-slate-700 text-white text-lg">
                          {viewingUser.User.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{viewingUser.User}</h3>
                        <p className="text-slate-400">{viewingUser.Email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Nombre</Label>
                        <p className="text-slate-300 bg-slate-800 p-2 rounded">
                          {viewingUser.Name || "No especificado"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Usuario</Label>
                        <p className="text-slate-300 bg-slate-800 p-2 rounded">
                          {viewingUser.User}
                        </p>
                      
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Estado</Label>
                        <div className="flex items-center space-x-2 bg-slate-800 p-2 rounded">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(viewingUser.IsActive)}`}></div>
                          <span className="text-slate-300">
                            {viewingUser.IsActive ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Roles</Label>
                        <div className="flex flex-wrap gap-1 bg-slate-800 p-2 rounded">
                          {viewingUser.Roles.length > 0 ? (
                            viewingUser.Roles.map((role) => (
                              <Badge
                                key={role.Id}
                                variant="secondary"
                                className="bg-slate-700 text-slate-300"
                              >
                                {role.Name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-slate-400 text-sm">Sin roles asignados</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Fecha de Creación</Label>
                        <p className="text-slate-300 bg-slate-800 p-2 rounded">
                          {new Date(viewingUser.CreatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Última Sesión</Label>
                        <p className="text-slate-300 bg-slate-800 p-2 rounded">
                          {formatDate(viewingUser.LastSessionAt)}
                        </p>
                      </div>
                      {viewingUser.LastSessionIp && (
                        <div className="space-y-2">
                          <Label className="text-white">IP Última Sesión</Label>
                          <p className="text-slate-300 bg-slate-800 p-2 rounded">
                            {viewingUser.LastSessionIp}
                          </p>
                        </div>
                      )}
                    </div>

                    {viewingUser.LastSessionUserAgent && (
                      <div className="space-y-2">
                        <Label className="text-white">Dispositivo/Navegador</Label>
                        <p className="text-slate-300 bg-slate-800 p-2 rounded text-sm">
                          {viewingUser.LastSessionUserAgent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button 
                    onClick={() => setIsViewUserOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Cerrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};