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

export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordSendOtp />,
  },
  {
    path: "forgot-password/verify",
    element: <ForgotPasswordVerify />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "almacen/registrar-carga",
        element: <ProtectedRoute><RegisterCargoWarehouse /></ProtectedRoute>,
      },
      {
        path: "tracker",
        element: <ProtectedRoute><WarehouseLocationTracker /></ProtectedRoute>
      },
      {
        path: "register-cargo",
        element: <ProtectedRoute><CargoRegistrationWizard /></ProtectedRoute>,
      },
      {
        path: "reportes",
        element: <ProtectedRoute><Reports /></ProtectedRoute>,
      },
      {
        path: "/almacen/trasladar-carga",
        element: <ProtectedRoute><TransferCargo /></ProtectedRoute>,
      }

    ],
  },
]);
