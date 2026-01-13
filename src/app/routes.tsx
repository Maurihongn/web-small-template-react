import { HomePage } from "@/features/home/views/HomePage";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router";
export const Routing = () => {
  const router = createBrowserRouter([
    {
      element: <Outlet />,
      children: [
        {
          // Aca irian las rutas que configures para tu aplicacion
          index: true,
          element: <HomePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
