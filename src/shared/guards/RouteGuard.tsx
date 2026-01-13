/**
 * Antes llamado GiroGuard
 * @description Este guardia se encarga de redirigir a una página de error si no tenes los permisos necesarios para ingresar a ciertas rutas.
 * Ejemplo: Proteger rutas administrativas o sensibles basadas en los claims del usuario.
 * Uso:
 * element:(
 * <RouteGuard allowedClaims={[ClaimName.Admin]}>
 *   <AdminPage />
 * </RouteGuard>
 * )
 */

import { type ReactNode } from "react";
import { Navigate } from "react-router";

interface RouteGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export const RouteGuard = ({
  children,
  redirectTo = "/403",
}: RouteGuardProps) => {
  const hasAccess = true; // TODO: Implementa la lógica real de permisos aquí puede ser con un hook o contexto de autenticación

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
