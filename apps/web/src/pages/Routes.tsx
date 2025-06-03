import { createBrowserRouter } from "react-router-dom";
import { Login } from "./Login";
import { Home } from "./Home";
import { AppLayout } from "@/layout/appLayout"; 

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      }
    ]
  },
]);
