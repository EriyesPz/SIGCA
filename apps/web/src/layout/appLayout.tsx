// src/pages/AppLayout.tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Home as HomeIcon,
  LayoutDashboard,
  Users,
  BarChart3,
  Activity,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-lg font-semibold">Mi App</h1>
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
                <SidebarMenuButton onClick={() => navigate("/users")}>
                  <Users className="mr-2" />
                  Usuarios
                </SidebarMenuButton>
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
          <SidebarSeparator />
        </SidebarContent>
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
