import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarSeparator,
  SidebarGroup,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar"

import {
  BarChart3,
  Home as HomeIcon,
  Users,
  Activity,
  LayoutDashboard,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const Home = () => {
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
                <SidebarMenuButton isActive>
                  <HomeIcon className="mr-2" />
                  Inicio
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LayoutDashboard className="mr-2" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Users className="mr-2" />
                  Usuarios
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BarChart3 className="mr-2" />
                  Reportes
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
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
          <h2 className="text-xl font-semibold">Panel Principal</h2>
        </div>

        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Bienvenido de vuelta. Aquí tienes un resumen de tu actividad.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">+12.5% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">+19% desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 desde ayer</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Resumen de la actividad de los últimos 7 días</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo usuario registrado</p>
                    <p className="text-xs text-muted-foreground">Hace 2 minutos</p>
                  </div>
                  <Badge variant="secondary">Nuevo</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Venta completada</p>
                    <p className="text-xs text-muted-foreground">Hace 15 minutos</p>
                  </div>
                  <Badge variant="default">Completado</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Proyecto actualizado</p>
                    <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                  </div>
                  <Badge variant="outline">Actualizado</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo comentario</p>
                    <p className="text-xs text-muted-foreground">Hace 3 horas</p>
                  </div>
                  <Badge variant="secondary">Comentario</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Acciones frecuentes para agilizar tu trabajo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Agregar Usuario
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver Reportes
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="mr-2 h-4 w-4" />
                  Monitorear Sistema
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}