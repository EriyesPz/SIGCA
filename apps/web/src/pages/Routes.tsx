import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layout/appLayout";
import { Login } from "./Login";
import { Home } from "./Home";
import { Register } from "./Register";
import { ForgotPasswordSendOtp } from "./Forgot-Password";
import { ForgotPasswordVerify } from "./ForgotPassVerify";
import { Warehouse } from "./Warehouse"
 
export const router = createBrowserRouter([
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
        element: <Home />,
      },
      {
        path: "almacen",
        element: <Warehouse />,
      }
    ],
  },
]);
