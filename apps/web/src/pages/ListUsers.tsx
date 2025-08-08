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
  Checkbox, // <-- asegúrate que esté disponible en tu UI lib
} from "@/components/ui";
import { MoreHorizontal, Shield, Eye, Edit, Trash2, Plus } from "lucide-react";
import { useListUsers, useCreateUserWithRoles } from "@/lib/users"; // <-- usamos tu hook nuevo
import { type UserType } from "@/types/user";

/** Catálogo de roles según tu seed (Id => Name) */
const ROLES_CATALOG: { id: string; name: string }[] = [
  { id: "admin", name: "Administrador" },
  { id: "digitador", name: "Digitador" },
  { id: "supervisor", name: "Supervisor" },
  { id: "talonador", name: "Talonador" },
  { id: "operador", name: "Operador" },
  { id: "auditor", name: "Auditor" },
  { id: "cliente", name: "Cliente" },
];

export const ListUsers = () => {
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users } = useListUsers();

  // ---- Estado modal "Nuevo Usuario"
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const { mutateAsync: createUserWithRoles } = useCreateUserWithRoles();

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    );
  };

  const resetCreateForm = () => {
    setEmail("");
    setUserName("");
    setPassword("");
    setSelectedRoles([]);
  };

  const onSubmitCreate = async () => {
    try {
      if (!email || !userName || !password || selectedRoles.length === 0) {
        alert("Completa todos los campos y selecciona al menos un rol.");
        return;
      }
      setCreating(true);
      const created = await createUserWithRoles({
        email,
        userName,
        password,
        roles: selectedRoles,
      });
      // Opcional: abre el modal de detalles al crear
      setViewingUser({
        Id: created.Id,
        Email: created.Email,
        Name: created.Name,
        User: created.User,
        IsActive: created.IsActive,
        CreatedAt: created.CreatedAt,
        Roles: created.Roles,
        LastSessionAt: null,
        LastSessionIp: null,
        LastSessionUserAgent: null,
        Avatar: null,
      });
      setIsViewUserOpen(true);
      setIsCreateOpen(false);
      resetCreateForm();
    } catch (err: any) {
      alert(err?.message || "No se pudo crear el usuario");
    } finally {
      setCreating(false);
    }
  };

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

  // Filtro simple por búsqueda
  const filteredUsers = (users ?? []).filter((u: UserType) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      u.User.toLowerCase().includes(q) ||
      u.Email.toLowerCase().includes(q) ||
      u.Roles.some((r) => r.Name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Usuarios</h1>
            <p className="text-slate-400 mt-2">Administra los usuarios del sistema.</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

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
                  <TableHead className="text-slate-300">Último Login</TableHead>
                  <TableHead className="text-slate-300">Roles</TableHead>
                  <TableHead className="text-slate-300">Estado</TableHead>
                  <TableHead className="text-slate-300">Creado</TableHead>
                  <TableHead className="text-slate-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: UserType) => (
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
                      <span className="text-white font-medium">{user.User}</span>
                    </TableCell>
                    <TableCell className="text-slate-300">{user.Email}</TableCell>
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
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-400">
                      No hay usuarios que coincidan con “{searchTerm}”.
                    </TableCell>
                  </TableRow>
                )}
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
                      {viewingUser.User.split(" ").map((n) => n[0]).join("")}
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
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          viewingUser.IsActive
                        )}`}
                      ></div>
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
              <Button onClick={() => setIsViewUserOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para crear usuario */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Nuevo Usuario</DialogTitle>
              <DialogDescription>Crear usuario y asignar roles</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label className="text-white" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white" htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  placeholder="Nombre de usuario"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white" htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Roles</Label>
                <div className="grid grid-cols-2 gap-2 bg-slate-800 p-3 rounded-md border border-slate-700">
                  {ROLES_CATALOG.map((r) => {
                    const checked = selectedRoles.includes(r.id);
                    return (
                      <label key={r.id} className="flex items-center gap-2 text-slate-200 cursor-pointer">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleRole(r.id)}
                        />
                        <span>{r.name}</span>
                      </label>
                    );
                  })}
                </div>
                {selectedRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedRoles.map((rid) => {
                      const role = ROLES_CATALOG.find((r) => r.id === rid);
                      return (
                        <Badge key={rid} className="bg-slate-700 text-slate-300">
                          {role?.name || rid}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={onSubmitCreate}
                disabled={creating}
              >
                {creating ? "Creando..." : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
