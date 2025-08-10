import { useState, useMemo } from "react";
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
  Checkbox,
} from "@/components/ui";
import { MoreHorizontal, Eye, Edit, Trash2, Plus } from "lucide-react";
import {
  useListUsers,
  useCreateUserWithRoles,
  usePatchUser,
} from "@/lib/users";
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

  // ---- Crear usuario
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const { mutateAsync: createUserWithRoles } = useCreateUserWithRoles();

  // ---- Editar usuario
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [eEmail, setEEmail] = useState("");
  const [eName, setEName] = useState<string | null>(null);
  const [eUser, setEUser] = useState("");
  const [ePassword, setEPassword] = useState(""); // vacío = no cambiar
  const [eAvatar, setEAvatar] = useState<string | null>(null);
  const [eIsActive, setEIsActive] = useState<boolean>(true);
  const [eRoles, setERoles] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const { mutateAsync: patchUser } = usePatchUser();

  const openEdit = (user: UserType) => {
    setEditingUser(user);
    setEEmail(user.Email || "");
    setEName(user.Name ?? null);
    setEUser(user.User || "");
    setEPassword(""); // no tocar password a menos que escriba algo
    setEAvatar((user as any).Avatar ?? null);
    setEIsActive(user.IsActive);
    setERoles(user.Roles.map((r) => r.Id));
    setIsEditOpen(true);
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  const toggleEditRole = (roleId: string) => {
    setERoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
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

  const getStatusColor = (status: boolean) =>
    status ? "bg-green-500" : "bg-red-500";

  const handleViewClick = (user: UserType) => {
    setViewingUser(user);
    setIsViewUserOpen(true);
  };

  const formatDate = (dateString: string | null) =>
    !dateString ? "Nunca" : new Date(dateString).toLocaleString();

  // Guardar edición (PATCH)
  const onSubmitEdit = async () => {
    if (!editingUser) return;
    try {
      setSavingEdit(true);

      const data: any = {
        Email: eEmail || undefined,
        Name: eName === "" ? null : eName,
        User: eUser || undefined,
        IsActive: eIsActive,
        Avatar: eAvatar === "" ? null : eAvatar,
      };
      if (ePassword.trim().length > 0) {
        data.Password = ePassword;
      }

      const updated = await patchUser({
        userId: editingUser.Id,
        data: {
          ...data,
          roleOps: { setRoleIds: eRoles },
        },
      });

      setIsEditOpen(false);
      setEditingUser(null);
      setEPassword("");

      setViewingUser({
        ...(viewingUser || updated),
        ...updated,
        LastSessionAt: (viewingUser?.LastSessionAt as any) ?? null,
        LastSessionIp: (viewingUser?.LastSessionIp as any) ?? null,
        LastSessionUserAgent:
          (viewingUser?.LastSessionUserAgent as any) ?? null,
        Avatar: (viewingUser as any)?.Avatar ?? null,
      });

      alert("Usuario actualizado correctamente.");
    } catch (err: any) {
      alert(err?.message || "No se pudo actualizar el usuario");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users ?? [];
    return (users ?? []).filter((u: UserType) => {
      return (
        u.User.toLowerCase().includes(q) ||
        u.Email.toLowerCase().includes(q) ||
        u.Roles.some((r) => r.Name.toLowerCase().includes(q))
      );
    });
  }, [users, searchTerm]);

  return (
    <div className="min-h-screen bg-background pl-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Usuarios
        </h1>
        <p className="text-slate-400 mt-1 sm:mt-2">
          Administra los usuarios del sistema.
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <Button
            className="w-full sm:w-auto"
            onClick={() => setIsCreateOpen(true)}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center space-x-2 mt-2 sm:mt-4">
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-sm bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300 min-w-[170px]">
                      Usuario
                    </TableHead>
                    <TableHead className="text-slate-300 min-w-[200px]">
                      Email
                    </TableHead>
                    <TableHead className="text-slate-300 hidden md:table-cell min-w-[160px]">
                      Último Login
                    </TableHead>
                    <TableHead className="text-slate-300 hidden sm:table-cell min-w-[180px]">
                      Roles
                    </TableHead>
                    <TableHead className="text-slate-300 hidden sm:table-cell min-w-[120px]">
                      Estado
                    </TableHead>
                    <TableHead className="text-slate-300 hidden lg:table-cell min-w-[120px]">
                      Creado
                    </TableHead>
                    <TableHead className="text-slate-300 min-w-[120px]">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: UserType) => (
                    <TableRow
                      key={user.Id}
                      className="border-slate-700 hover:bg-slate-800/50 transition-colors"
                      onClick={() => handleViewClick(user)}
                    >
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.Avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-slate-700 text-white">
                            {user.User.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium truncate">
                          {user.User}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {user.Email}
                      </TableCell>
                      <TableCell className="text-slate-300 hidden md:table-cell">
                        {formatDate(user.LastSessionAt)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex gap-1 flex-wrap">
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
                      <TableCell className="hidden sm:table-cell">
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
                      <TableCell className="hidden lg:table-cell">
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
                              onClick={() => openEdit(user)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
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
                      <TableCell
                        colSpan={7}
                        className="text-center text-slate-400"
                      >
                        No hay usuarios que coincidan con “{searchTerm}”.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog para ver usuario (responsive + scroll) */}
        <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
          <DialogContent
            className="
              bg-slate-900 border-slate-700
              w-[96vw] sm:max-w-xl lg:max-w-2xl
              max-h-[calc(100svh-3rem)]
              p-0 overflow-hidden rounded-xl
            "
          >
            <DialogHeader className="p-4 sm:p-6 border-b border-slate-800">
              <DialogTitle className="text-white">
                Detalles del Usuario
              </DialogTitle>
              <DialogDescription>
                Información detallada del usuario
              </DialogDescription>
            </DialogHeader>

            <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[calc(100svh-12rem)] sm:max-h-[65vh]">
              {viewingUser && (
                <div className="grid gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 shrink-0">
                      <AvatarImage
                        src={viewingUser.Avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-slate-700 text-white text-lg">
                        {viewingUser.User.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold text-white truncate">
                        {viewingUser.User}
                      </h3>
                      <p className="text-slate-400 truncate">
                        {viewingUser.Email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="flex items-center gap-2 bg-slate-800 p-2 rounded">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(
                            viewingUser.IsActive
                          )}`}
                        />
                        <span className="text-slate-300">
                          {viewingUser.IsActive ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          <span className="text-slate-400 text-sm">
                            Sin roles asignados
                          </span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <Label className="text-white">
                        Dispositivo/Navegador
                      </Label>
                      <p className="text-slate-300 bg-slate-800 p-2 rounded text-sm">
                        {viewingUser.LastSessionUserAgent}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900 sticky bottom-0">
              <Button
                onClick={() => setIsViewUserOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para crear usuario (responsive + scroll) */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent
            className="
              bg-slate-900 border-slate-700
              w-[96vw] sm:max-w-xl
              max-h-[calc(100svh-3rem)]
              p-0 overflow-hidden rounded-xl
            "
          >
            <DialogHeader className="p-4 sm:p-6 border-b border-slate-800">
              <DialogTitle className="text-white">Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Crear usuario y asignar roles
              </DialogDescription>
            </DialogHeader>

            <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[calc(100svh-12rem)] sm:max-h-[65vh]">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="usuario@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white" htmlFor="username">
                    Usuario
                  </Label>
                  <Input
                    id="username"
                    placeholder="Nombre de usuario"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white" htmlFor="password">
                    Contraseña
                  </Label>
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
                  <div
                    className="
                      grid grid-cols-1 sm:grid-cols-2 gap-2
                      bg-slate-800 p-3 rounded-md border border-slate-700
                      max-h-56 overflow-auto
                    "
                  >
                    {ROLES_CATALOG.map((r) => {
                      const checked = selectedRoles.includes(r.id);
                      return (
                        <label
                          key={r.id}
                          className="flex items-center gap-2 text-slate-200 cursor-pointer"
                        >
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
                          <Badge
                            key={rid}
                            className="bg-slate-700 text-slate-300"
                          >
                            {role?.name || rid}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900 sticky bottom-0">
              <div className="flex w-full gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsCreateOpen(false)}
                  className="w-1/2 sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-1/2 sm:w-auto"
                  onClick={onSubmitCreate}
                  disabled={creating}
                >
                  {creating ? "Creando..." : "Crear"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para EDITAR usuario (responsive + scroll) */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent
            className="
              bg-slate-900 border-slate-700
              w-[96vw] sm:max-w-xl lg:max-w-2xl
              max-h-[calc(100svh-3rem)]
              p-0 overflow-hidden rounded-xl
            "
          >
            <DialogHeader className="p-4 sm:p-6 border-b border-slate-800">
              <DialogTitle className="text-white">Editar Usuario</DialogTitle>
              <DialogDescription>
                Actualiza campos y roles (opcional)
              </DialogDescription>
            </DialogHeader>

            <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[calc(100svh-12rem)] sm:max-h-[65vh]">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white" htmlFor="eemail">
                      Email
                    </Label>
                    <Input
                      id="eemail"
                      placeholder="usuario@empresa.com"
                      value={eEmail}
                      onChange={(e) => setEEmail(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white" htmlFor="euser">
                      Usuario
                    </Label>
                    <Input
                      id="euser"
                      placeholder="Nombre de usuario"
                      value={eUser}
                      onChange={(e) => setEUser(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white" htmlFor="ename">
                      Nombre (opcional)
                    </Label>
                    <Input
                      id="ename"
                      placeholder="Nombre real"
                      value={eName ?? ""}
                      onChange={(e) => setEName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white" htmlFor="eavatar">
                      Avatar URL (opcional)
                    </Label>
                    <Input
                      id="eavatar"
                      placeholder="https://..."
                      value={eAvatar ?? ""}
                      onChange={(e) => setEAvatar(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white" htmlFor="epass">
                    Nueva contraseña (dejar vacío para no cambiar)
                  </Label>
                  <Input
                    id="epass"
                    type="password"
                    placeholder="••••••••"
                    value={ePassword}
                    onChange={(e) => setEPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Estado</Label>
                  <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                    <Checkbox
                      checked={eIsActive}
                      onCheckedChange={() => setEIsActive((v) => !v)}
                    />
                    <span>{eIsActive ? "Activo" : "Inactivo"}</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Roles</Label>
                  <div
                    className="
                      grid grid-cols-1 sm:grid-cols-2 gap-2
                      bg-slate-800 p-3 rounded-md border border-slate-700
                      max-h-56 overflow-auto
                    "
                  >
                    {ROLES_CATALOG.map((r) => {
                      const checked = eRoles.includes(r.id);
                      return (
                        <label
                          key={r.id}
                          className="flex items-center gap-2 text-slate-200 cursor-pointer"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleEditRole(r.id)}
                          />
                          <span>{r.name}</span>
                        </label>
                      );
                    })}
                  </div>

                  {eRoles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {eRoles.map((rid) => {
                        const role = ROLES_CATALOG.find((r) => r.id === rid);
                        return (
                          <Badge
                            key={rid}
                            className="bg-slate-700 text-slate-300"
                          >
                            {role?.name || rid}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900 sticky bottom-0">
              <div className="flex w-full gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditOpen(false)}
                  className="w-1/2 sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-1/2 sm:w-auto"
                  onClick={onSubmitEdit}
                  disabled={savingEdit || !editingUser}
                >
                  {savingEdit ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
