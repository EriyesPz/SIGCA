import { createBrowserRouter } from "react-router-dom";
import { Login } from "./Login";
import { Home } from "./Home";
import { Register } from "./Register";
import { AppLayout } from "@/layout/appLayout";

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
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
]);
