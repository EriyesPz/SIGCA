"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useListUsers } from "@/lib/users";
import { type UserType } from "@/types/user";
import { useState } from "react";
import {
  User as UserIcon,
  Calendar,
  LogIn,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

export const ListUsers = () => {
  const { data: users = [], isLoading } = useListUsers();
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const toggleExpand = (userId: string) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <UserIcon className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Usuarios</h1>
          </div>
          <p className="text-muted-foreground">Todos los usuarios del sistema</p>
        </header>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead> {/* Columna de expansión */}
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user: UserType) => (
                  <>
                    <TableRow
                      key={user.Id}
                      className="cursor-pointer hover:bg-muted/30 transition"
                      onClick={() => toggleExpand(user.Id)}
                    >
                      <TableCell className="w-[40px]">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => toggleExpand(user.Id)}
            >
              {expandedUserId === user.Id ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.User.split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                          <AvatarImage src="" />
                        </Avatar>
                        <span className="font-medium">{user.User}</span>
                      </TableCell>

                      <TableCell>
                        <span className="text-muted-foreground text-sm">
                          {user.Email}
                        </span>
                      </TableCell>

                      <TableCell>
                        {user.Roles.length ? (
                          <div className="flex flex-wrap gap-1">
                            {user.Roles.map((role) => (
                              <Badge key={role.Id} variant="outline">
                                {role.Name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Sin rol
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.IsActive
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-500"
                              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500"
                          }
                        >
                          {user.IsActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {user.LastSessionAt ? (
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1">
                              <LogIn className="w-4 h-4 text-muted-foreground" />
                              {new Date(user.LastSessionAt).toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(user.CreatedAt).toLocaleDateString("es-ES")}
                        </div>
                      </TableCell>

                      <TableCell className="text-right pr-4">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(user.Id);
                          }}
                        >
                          {expandedUserId === user.Id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expandedUserId === user.Id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/10 py-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Info className="w-4 h-4" />
                              <span>
                                <strong>ID:</strong> {user.Id}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span>
                                <strong>IP Última Sesión:</strong>{" "}
                                {user.LastSessionIp || "—"}
                              </span>
                              <span className="ml-4">
                                <strong>Navegador:</strong>{" "}
                                {user.LastSessionUserAgent || "—"}
                              </span>
                            </div>

                            {/* Puedes agregar más campos aquí */}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
