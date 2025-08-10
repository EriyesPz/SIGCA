import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  HomeIcon,
  LayoutDashboard,
  Users,
  BarChart3,
  Activity,
  User,
  CreditCard,
  Bell,
  LogOut,
  ChevronUp,
  Package,
  Grid3X3,
  ChevronDown,
  Warehouse,
  PackagePlus,
  MoveHorizontal,
  Truck,
  ShieldCheck,
  MapPin,
  Building2,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 👇 todo el gating desde el AuthProvider
import { useAuth } from "@/components/providers/auth";

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openUsers, setOpenUsers] = useState(false);
  const [openWarehouse, setOpenWarehouse] = useState(false);
  const [openTracker, setOpenTracker] = useState(false);

  const {
    userName,
    email,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    roles,
    permissions,
    logout,
  } = useAuth();

  // 👀 Debug rápido: borra cuando valides
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[LAYOUT] roles:", roles, "perms:", permissions.length);
  }

  const user = {
    name: userName || "Invitado",
    email: email || "sin-correo",
    initials:
      (userName || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U",
    avatar: "",
  };

  const canManageRoles = hasAllPermissions([
    "role.manage",
    "permission.manage",
  ]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center p-4">
            <SidebarHeader>
              <div className="flex items-center justify-start">
                <img
                  src="/icons/logo-light.svg"
                  alt="Logo modo claro"
                  className="h-24 object-contain dark:hidden"
                />
                <img
                  src="/icons/logo-dark.svg"
                  alt="Logo modo oscuro"
                  className="h-24 object-contain hidden dark:block"
                />
              </div>
            </SidebarHeader>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/")}
                  aria-current={location.pathname === "/" ? "page" : undefined}
                  className="cursor-pointer"
                >
                  <HomeIcon className="mr-2" />
                  Inicio
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer"
                  aria-current={
                    location.pathname === "/dashboard" ? "page" : undefined
                  }
                >
                  <LayoutDashboard className="mr-2" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>

              {hasPermission("cargo.register") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => navigate("/register-cargo")}
                    className="cursor-pointer"
                    aria-current={
                      location.pathname === "/register-cargo"
                        ? "page"
                        : undefined
                    }
                  >
                    <Package className="mr-2" />
                    Registrar
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {hasAnyPermission([
                "cargo.register",
                "cargo.transfer",
                "cargo.deliver",
              ]) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setOpenWarehouse((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    <Warehouse className="mr-2" />
                    <span className="flex-1 text-left">Almacén</span>
                    {openWarehouse ? (
                      <ChevronUp className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    )}
                  </SidebarMenuButton>

                  {openWarehouse && (
                    <SidebarMenuSub>
                      {hasPermission("cargo.register") && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            onClick={() => navigate("/almacen/registrar-carga")}
                            isActive={
                              location.pathname === "/almacen/registrar-carga"
                            }
                            className="cursor-pointer"
                          >
                            <PackagePlus className="mr-0.5" />
                            Registrar Carga
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}

                      {hasPermission("cargo.transfer") && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            onClick={() => navigate("/almacen/trasladar-carga")}
                            isActive={
                              location.pathname === "/almacen/trasladar-carga"
                            }
                            className="cursor-pointer"
                          >
                            <MoveHorizontal className="mr-0.5 ml-0" />
                            Traslado
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}

                      {hasPermission("cargo.deliver") && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            onClick={() => navigate("/almacen/salida-carga")}
                            isActive={
                              location.pathname === "/almacen/salida-carga"
                            }
                            className="cursor-pointer"
                          >
                            <Truck className="mr-0.5 ml-0" />
                            Salida de Carga
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )}

              {hasPermission("cargo.view") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setOpenTracker((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    <Grid3X3 className="mr-2" />
                    <span className="flex-1 text-left">Tracker</span>
                    {openTracker ? (
                      <ChevronUp className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    )}
                  </SidebarMenuButton>

                  {openTracker && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/tracker/ubicaciones")}
                          isActive={
                            location.pathname === "/tracker/ubicaciones"
                          }
                          className="cursor-pointer"
                        >
                          <MapPin className="mr-2" />
                          Ubicaciones
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/tracker/almacenes")}
                          isActive={location.pathname === "/tracker/almacenes"}
                          className="cursor-pointer"
                        >
                          <Building2 className="mr-2" />
                          Almacenes
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )}

              {hasPermission("user.manage") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setOpenUsers((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    <Users className="mr-2" />
                    <span className="flex-1 text-left">Usuarios</span>
                    {openUsers ? (
                      <ChevronUp className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    )}
                  </SidebarMenuButton>

                  {openUsers && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/usuarios/lista")}
                          isActive={location.pathname === "/usuarios/lista"}
                        >
                          <User className="mr-0.5 ml-0" />
                          Lista de Usuarios
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => navigate("/usuarios/sesiones")}
                          isActive={location.pathname === "/usuarios/sesiones"}
                        >
                          <Activity className="mr-0.5" />
                          Sesiones
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => {
                            if (!canManageRoles) return;
                            navigate("/usuarios/roles-permisos");
                          }}
                          isActive={
                            location.pathname === "/usuarios/roles-permisos"
                          }
                          aria-disabled={!canManageRoles}
                          tabIndex={canManageRoles ? 0 : -1}
                          className={`${
                            !canManageRoles
                              ? "opacity-50 cursor-not-allowed pointer-events-none"
                              : ""
                          }`}
                          title={
                            canManageRoles
                              ? ""
                              : "Requiere role.manage y permission.manage"
                          }
                        >
                          <ShieldCheck className="mr-0.5" />
                          Roles y Permisos
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )}

              {hasPermission("cargo.view") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => navigate("/reportes")}
                    className="cursor-pointer"
                    aria-current={
                      location.pathname === "/reportes" ? "page" : undefined
                    }
                  >
                    <BarChart3 className="mr-2" />
                    Reportes
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/actividad")}
                  className="cursor-pointer"
                  aria-current={
                    location.pathname === "/actividad" ? "page" : undefined
                  }
                >
                  <Activity className="mr-2" />
                  Actividad
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronUp className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    <User />
                    Cuenta
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/billing")}>
                    <CreditCard />
                    Facturación
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/notifications")}>
                    <Bell />
                    Notificaciones
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate("/login", { replace: true });
                    }}
                  >
                    <LogOut />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
