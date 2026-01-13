/**
 * Antes llamado ViewGuard
 * @description Este guardia se encarga de verificar si tenes los permisos necesarios para ver ciertos componentes UI.
 * Si no los tenes, no renderiza nada (o un fallback opcional).
 * Ejemplo: Mostrar u ocultar botones o secciones de la UI basados en permisos del usuario.
 * Uso:
 * <PermissionGuard fallback={<LockIcon />}>
 *   <SensitiveComponent />
 * </PermissionGuard>
 */

import { type ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  fallback?: ReactNode; // Opción para mostrar algo en lugar de null (ej: un candado)
}

export const PermissionGuard = ({
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const hasAccess = true; // TODO: Implementa la lógica real de permisos aquí puede ser con un hook o contexto de autenticación

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
