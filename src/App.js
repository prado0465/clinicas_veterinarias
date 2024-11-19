import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/global.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/ProjectedRoute/index.js";
import { UserProvider } from "./context/UserContext/UserContext.js";

import { Home } from "./pages/Home/index.js";
import { Login } from "./pages/Login/index.js";
import { Register } from "./pages/Resgister/index.js";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  

]);

export default function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
