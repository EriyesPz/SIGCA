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
  CardTitle,
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
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  CardDescription,
} from "@/components/ui";
import {
  Plus,
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

export const ListUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users } = useListUsers();

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-500" : "bg-red-500";
  };

  const handleRowClick = (user) => {
    setEditingUser(user);
    setIsEditUserOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Usuarios
            </h1>
            <p className="text-slate-400 mt-2">
              Administra los usuarios del sistema.
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

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  
                  {/* <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Usuario
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Agregar Nuevo Usuario</DialogTitle>
                        <DialogDescription>Completa la información del nuevo usuario</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right text-white">Nombre</Label>
                          <Input id="name" className="col-span-3 bg-slate-800 border-slate-700 text-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right text-white">Email</Label>
                          <Input id="email" type="email" className="col-span-3 bg-slate-800 border-slate-700 text-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="role" className="text-right text-white">Rol</Label>
                          <Select>
                            <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700 text-white">
                              <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              {roles.map(role => (
                                <SelectItem key={role.id} value={role.name} className="text-white">{role.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Crear Usuario</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog> */}

                  {/* Dialog para editar usuario */}
                  {/* <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                    <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">Editar Usuario</DialogTitle>
                        <DialogDescription>Modifica la información del usuario</DialogDescription>
                      </DialogHeader>
                      {editingUser && (
                        <div className="grid gap-6 py-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={editingUser.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-slate-700 text-white text-lg">
                                {editingUser.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                              Cambiar Avatar
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name" className="text-white">Nombre Completo</Label>
                              <Input 
                                id="edit-name" 
                                defaultValue={editingUser.name}
                                className="bg-slate-800 border-slate-700 text-white" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-email" className="text-white">Email</Label>
                              <Input 
                                id="edit-email" 
                                type="email"
                                defaultValue={editingUser.email}
                                className="bg-slate-800 border-slate-700 text-white" 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-username" className="text-white">Nombre de Usuario</Label>
                              <Input 
                                id="edit-username" 
                                defaultValue={editingUser.username}
                                className="bg-slate-800 border-slate-700 text-white" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-organization" className="text-white">Organización</Label>
                              <Input 
                                id="edit-organization" 
                                defaultValue={editingUser.organization}
                                className="bg-slate-800 border-slate-700 text-white" 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-status" className="text-white">Estado</Label>
                              <Select defaultValue={editingUser.status}>
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  <SelectItem value="Active" className="text-white">Activo</SelectItem>
                                  <SelectItem value="Inactive" className="text-white">Inactivo</SelectItem>
                                  <SelectItem value="Pending" className="text-white">Pendiente</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-white">Roles Asignados</Label>
                              <div className="space-y-2">
                                {roles.map(role => (
                                  <div key={role.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`role-${role.id}`}
                                      defaultChecked={editingUser.roles.includes(role.name)}
                                      className="border-slate-600"
                                    />
                                    <Label htmlFor={`role-${role.id}`} className="text-white text-sm">
                                      {role.name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white">Información Adicional</Label>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <span className="text-slate-400">Último Login:</span>
                                <p className="text-white">{editingUser.lastLogin}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-slate-400">Fecha de Creación:</span>
                                <p className="text-white">{editingUser.created}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditUserOpen(false)}
                          className="border-slate-600 text-slate-300 hover:text-white"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            // Aquí iría la lógica para guardar los cambios
                            console.log('Guardando cambios del usuario:', editingUser.name)
                            setIsEditUserOpen(false)
                          }}
                        >
                          Guardar Cambios
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog> */}
                </div>
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
                        onClick={() => handleRowClick(user)}
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
                          <span className="text-white font-medium">
                            {user.User}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {user.Email}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {user.LastSessionAt}
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
                                onClick={() => handleRowClick(user)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-slate-300 hover:text-white"
                                onClick={() => handleRowClick(user)}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
