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
  ShieldCheck
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
import { useCookies } from "react-cookie";

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["userName", "email"]);
  const [openUsers, setOpenUsers] = useState(false);
  const [openWarehouse, setOpenWarehouse] = useState(false);

  const user = {
    name: cookies.userName || "Invitado",
    email: cookies.email || "sin-correo",
    initials:
      cookies.userName
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase() || "U",
    avatar: "",
  };

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
                >
                  <HomeIcon className="mr-2" />
                  Inicio
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="mr-2" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/register-cargo")}>
                  <Package className="mr-2" />
                  Registrar
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setOpenWarehouse((prev) => !prev)}
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
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => navigate("/almacen/registrar-carga")}
                        isActive={location.pathname === "/almacen/registrar-carga"}
                      >
                        <PackagePlus  className="mr-0.5" />
                        Registrar Carga
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => navigate("/almacen/trasladar-carga")}
                        isActive={location.pathname === "/almacen/trasladar-carga"}
                      >
                        <MoveHorizontal className="mr-0.5 ml-0" />
                        Traslado
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => navigate("/almacen/salida-carga")}
                        isActive={location.pathname === "/almacen/salida-carga"}
                      >
                        <Truck className="mr-0.5 ml-0" />
                        Salida de Carga
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/tracker")}>
                  <Grid3X3 className="mr-2" />
                  Tracker
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setOpenUsers((prev) => !prev)}
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
                        onClick={() => navigate("usuarios/lista")}
                        isActive={location.pathname === "usuarios/lista"}
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
                        onClick={() => navigate("/usuarios/roles-permisos")}
                        isActive={location.pathname === "/usuarios/roles-permisos"}
                      >
                        <ShieldCheck className="mr-0.5" />
                        Roles y Permisos
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/reportes")}>
                  <BarChart3 className="mr-2" />
                  Reportes
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/actividad")}>
                  <Activity className="mr-2" />
                  Actividad
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          {/* <SidebarSeparator /> */}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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
                      alert("Log out");
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
