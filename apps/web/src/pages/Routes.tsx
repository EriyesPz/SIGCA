import { createBrowserRouter } from "react-router-dom";
import { Login } from "./Login";
import { Home } from "./Home";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);
