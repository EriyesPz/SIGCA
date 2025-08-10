import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layout/appLayout";
import { Login } from "./Login";
import { Home } from "./Home";
import { Register } from "./Register";
import { ForgotPasswordSendOtp } from "./Forgot-Password";
import { ForgotPasswordVerify } from "./ForgotPassVerify";
import { ProtectedRoute } from "./Protected";
import { NotFound } from "./Not-Found";
import { WarehouseLocationTracker } from "./Tracker";
import { Dashboard } from "./Dashboard";
import { Reports } from "./Reports";
import { RegisterCargoWarehouse } from "./RegisterCargoWarehouse";
import { CargoRegistrationWizard } from "./RegisterCargo";
import { TransferCargo } from "@/pages/Transfer-Cargo";
import { DeliverCargoPage } from "@/pages/DeliverCargo";
import { ListUsers } from "@/pages/ListUsers";
import { Sessions } from "@/pages/Sessions";
import { RolesPermissions } from "@/pages/RolesPermisions";
import { WarehouseTracker } from "./Tracker-Warehouse";

export const router = createBrowserRouter([
  { path: "*", element: <NotFound /> },
  { path: "/login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "forgot-password", element: <ForgotPasswordSendOtp /> },
  { path: "forgot-password/verify", element: <ForgotPasswordVerify /> },

  {
    path: "/",
    element: <AppLayout />,
    children: [
      // Solo autenticación
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // Almacén
      {
        path: "almacen/registrar-carga",
        element: (
          <ProtectedRoute anyOf={["cargo.register"]}>
            <RegisterCargoWarehouse />
          </ProtectedRoute>
        ),
      },
      {
        // ojo: esta es absoluta en tu código actual; la dejo igual
        path: "/almacen/trasladar-carga",
        element: (
          <ProtectedRoute anyOf={["cargo.transfer"]}>
            <TransferCargo />
          </ProtectedRoute>
        ),
      },
      {
        path: "almacen/salida-carga",
        element: (
          <ProtectedRoute anyOf={["cargo.deliver"]}>
            <DeliverCargoPage />
          </ProtectedRoute>
        ),
      },

      // Tracker
      {
        path: "tracker/ubicaciones",
        element: (
          <ProtectedRoute anyOf={["cargo.view"]}>
            <WarehouseLocationTracker />
          </ProtectedRoute>
        ),
      },
      {
        path: "tracker/almacenes",
        element: (
          <ProtectedRoute anyOf={["cargo.view"]}>
            <WarehouseTracker />
          </ProtectedRoute>
        ),
      },

      // Wizard alterno de registro
      {
        path: "register-cargo",
        element: (
          <ProtectedRoute anyOf={["cargo.register"]}>
            <CargoRegistrationWizard />
          </ProtectedRoute>
        ),
      },

      // Reportes (solo ver)
      {
        path: "reportes",
        element: (
          <ProtectedRoute anyOf={["cargo.view"]}>
            <Reports />
          </ProtectedRoute>
        ),
      },

      // Usuarios / Administración
      {
        path: "usuarios/lista",
        element: (
          <ProtectedRoute anyOf={["user.manage"]}>
            <ListUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "usuarios/sesiones",
        element: (
          <ProtectedRoute anyOf={["user.manage"]}>
            <Sessions />
          </ProtectedRoute>
        ),
      },
      {
        path: "usuarios/roles-permisos",
        element: (
          <ProtectedRoute allOf={["role.manage", "permission.manage"]}>
            <RolesPermissions />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
