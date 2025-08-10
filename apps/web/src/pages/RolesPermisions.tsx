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
  CardTitle,
  CardDescription,
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
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  useGetPermissions,
  useGetRoles,
  useGetRolesWithPermissions,
} from "@/lib/roles-permissions";
import {
  type RoleWithPermissions,
  type Permission,
  type Role,
} from "@/types/roles-permisions";
import type { UseQueryResult } from "@tanstack/react-query";

export const RolesPermissions = () => {
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(
    null
  );

  // Usamos tus hooks personalizados con tipos explícitos
  const {
    data: rolesWithPermissions,
    isLoading: isLoadingRolesWithPermissions,
  }: UseQueryResult<RoleWithPermissions[], Error> =
    useGetRolesWithPermissions();

  const { isLoading: isLoadingRoles }: UseQueryResult<Role[], Error> =
    useGetRoles();

  const {
    data: permissions,
    isLoading: isLoadingPermissions,
  }: UseQueryResult<Permission[], Error> = useGetPermissions();

  if (isLoadingRolesWithPermissions || isLoadingRoles || isLoadingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pl-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Roles y Permisos
        </h1>
        <p className=" mt-1 sm:mt-2">
          Roles y permisos de los usuarios del sistema.
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-rows-2 gap-6">
          {/* Roles Table */}
          <Card className="">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Roles</CardTitle>
                  <CardDescription>
                    Gestiona los roles del sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="">Nombre</TableHead>
                    <TableHead className="">
                      Descripción
                    </TableHead>
                    <TableHead className="">Permisos</TableHead>
                    <TableHead className="">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesWithPermissions?.map((role: RoleWithPermissions) => (
                    <TableRow
                      key={role.Id}
                      className=" cursor-pointer hover:/50 transition-colors"
                      onClick={() => {
                        setSelectedRole(role);
                        setIsEditRoleOpen(true);
                      }}
                    >
                      <TableCell className=" font-medium">
                        {role.Name}
                      </TableCell>
                      <TableCell className="">
                        {role.Description}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {role.Permissions.slice(0, 2).map(
                            (permission: Permission) => (
                              <Badge
                                key={permission.Id}
                                variant="secondary"
                                className="  text-xs"
                              >
                                {permission.Name}
                              </Badge>
                            )
                          )}
                          {role.Permissions.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="  text-xs"
                            >
                              +{role.Permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0  hover:"
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
                              className=" hover:"
                              onClick={() => {
                                setSelectedRole(role);
                                setIsEditRoleOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className=" hover:">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="" />
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

          {/* Permissions Table */}
          <Card className=" mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="">Permisos</CardTitle>
                  <CardDescription>
                    Lista de permisos del sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="">Nombre</TableHead>
                    <TableHead className="">
                      Descripción
                    </TableHead>
                    <TableHead className="">ID</TableHead>
                    <TableHead className="">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions?.map((permission: Permission) => (
                    <TableRow key={permission.Id} className="">
                      <TableCell className=" font-medium">
                        {permission.Name}
                      </TableCell>
                      <TableCell className="">
                        {permission.Description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-slate-600  text-xs"
                        >
                          {permission.Id}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0  hover:"
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
                            <DropdownMenuItem className=" hover:">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className=" hover:">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="" />
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
        </div>

        {/* Role Edit Dialog */}
        <Dialog
          open={isEditRoleOpen && !!selectedRole}
          onOpenChange={(open) => {
            setIsEditRoleOpen(open);
            if (!open) setSelectedRole(null);
          }}
        >
          <DialogContent className="  max-w-2xl">
            <DialogHeader>
              <DialogTitle className="">
                Editar Rol: {selectedRole?.Name}
              </DialogTitle>
              <DialogDescription>
                Modifica la información y permisos del rol
              </DialogDescription>
            </DialogHeader>
            {selectedRole && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name" className="">
                      Nombre del Rol
                    </Label>
                    <Input
                      id="role-name"
                      defaultValue={selectedRole.Name}
                      className="  "
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-description" className="">
                      Descripción
                    </Label>
                    <Input
                      id="role-description"
                      defaultValue={selectedRole.Description}
                      className="  "
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className=" font-medium">
                    Permisos Asignados
                  </Label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {permissions?.map((permission: Permission) => (
                      <div
                        key={permission.Id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`perm-${permission.Id}`}
                          defaultChecked={selectedRole.Permissions.some(
                            (p) => p.Id === permission.Id
                          )}
                          className="border-slate-600"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`perm-${permission.Id}`}
                            className=" text-sm font-medium cursor-pointer"
                          >
                            {permission.Name}
                          </Label>
                          <p className="text-xs ">
                            {permission.Description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditRoleOpen(false)}
                className="border-slate-600  hover:"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  console.log("Guardando cambios del rol:", selectedRole?.Name);
                  setIsEditRoleOpen(false);
                }}
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
