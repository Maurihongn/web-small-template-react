import { ForbiddenPage } from "@/shared/views/errors/ForbiddenPage";
import { NotFoundPage } from "@/shared/views/errors/NotFoundPage";
import {
    createBrowserRouter,
    Navigate,
    Outlet,
    RouterProvider,
} from "react-router";

// 🏗️ En una app real, estos imports vendrían de tus features
// import { LoginPage } from "@/features/auth/views/LoginPage";
// import { DashboardPage } from "@/features/dashboard/views/DashboardPage";
// import { AuthLayout } from "@/shared/layouts/AuthLayout";
// import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
// import { RequireAuth } from "@/app/guards/RequireAuth"; // Tu Guard de protección

// 👇 MOCK COMPONENTS (Solo para que el ejemplo no rompa si lo copias)
const AuthLayout = () => (
  <div className="auth-layout">
    <Outlet />
  </div>
);
const AppLayout = () => (
  <div className="app-layout">
    <nav>Sidebar</nav>
    <Outlet />
  </div>
);
const RequireAuth = () => {
  const isAuth = true;
  return isAuth ? <Outlet /> : <Navigate to="/auth/login" />;
};
const LoginPage = () => <h1>Login Screen</h1>;
const DashboardPage = () => <h1>Dashboard</h1>;
const UsersPage = () => <h1>Users Management</h1>;

export const Routing = () => {
  const router = createBrowserRouter([
    // =================================================================
    // 🔓 1. ZONA PÚBLICA (Authentication)
    // =================================================================
    {
      path: "/auth",
      element: <AuthLayout />, // Layout específico (ej: caja centrada, fondo branding)
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          // element: <RegisterPage />,
          element: <div>Register</div>,
        },
        // Redirige /auth a /auth/login por defecto
        {
          index: true,
          element: <Navigate to="/auth/login" replace />,
        },
      ],
    },

    // =================================================================
    // 🔒 2. ZONA PRIVADA (Application Core)
    // =================================================================
    {
      path: "/",
      // 🛡️ GUARD: Este componente verifica si tienes token.
      // Si no, te patea al login automáticamente.
      element: <RequireAuth />,
      children: [
        {
          // 🎨 LAYOUT PRINCIPAL: Aquí vive el Sidebar, Header, Footer
          element: <AppLayout />,
          children: [
            // Redirige la raíz "/" al dashboard
            {
              index: true,
              element: <Navigate to="/dashboard" replace />,
            },
            {
              path: "dashboard",
              element: <DashboardPage />,
            },
            // Ejemplo de Feature "Users"
            {
              path: "users",
              element: <UsersPage />,
            },
            // Ejemplo de rutas anidadas (Detail)
            {
              path: "users/:id",
              element: <div>User Detail View</div>,
            },
          ],
        },
      ],
    },

    // =================================================================
    // 🚫 3. FALLBACK (404 Not Found)
    // =================================================================
    {
      path: "*",
      element: <NotFoundPage />,
    },
    {
        path:'/403',
        element:<ForbiddenPage />
    },

  ]);

  return <RouterProvider router={router} />;
};
