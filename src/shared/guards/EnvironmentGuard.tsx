/**
 * EnvironmentGuard.tsx
 * @description: Componente guardián para renderizar contenido basado en el entorno de ejecución.
 * Permite proteger vistas o componentes para que solo se muestren en entornos específicos
 * (por ejemplo, desarrollo o pruebas).
 */

import { type ReactNode } from "react";
import { Navigate } from "react-router";

type Environment = "development" | "test" | "production" | "staging";

interface EnvironmentGuardProps {
  children: ReactNode;
  allowedEnvs?: Environment[];
  redirect?: string;
}

/**
 * @description: Componente para el Routing que protege rutas basadas en el entorno de ejecución.
 * Permite redirigir a los usuarios si intentan acceder a rutas no permitidas en el entorno actual.
 * Ejemplo: Proteger rutas de administración para que solo estén accesibles en entornos de desarrollo o prueba.
 * Uso:
 * element:(
 * <EnvironmentGuard allowedEnvs={['development', 'test']} redirect="/home">
 *   <AdminPage />
 * </EnvironmentGuard>
 * )
 */
export const EnvironmentGuard = ({
  children,
  allowedEnvs = ["development", "test"], // Por defecto solo dev/test
  redirect = "/",
}: EnvironmentGuardProps) => {
  const currentEnv = import.meta.env.VITE_ENV as Environment;

  if (allowedEnvs.includes(currentEnv)) {
    return <>{children}</>;
  }

  return <Navigate to={redirect} replace />;
};

/**
 * @description: Componente guardián para renderizar vistas o componentes basados en el entorno de ejecución.
 * Similar a EnvironmentGuard pero no redirige, simplemente no renderiza nada si el entorno no es permitido.
 * Útil para ocultar partes de la UI en ciertos entornos.
 * Ejemplo: Mostrar herramientas de desarrollo solo en entornos de desarrollo o prueba.
 *
 * Uso:
 * <EnvironmentViewGuard allowedEnvs={['development', 'test']}>
 *   <DevTools />
 * </EnvironmentViewGuard>
 */

export const EnvironmentViewGuard = ({
  children,
  allowedEnvs = ["development", "test"], // Por defecto solo dev/test
}: EnvironmentGuardProps) => {
  const currentEnv = import.meta.env.VITE_ENV as Environment;
  if (allowedEnvs.includes(currentEnv)) {
    return <>{children}</>;
  }
  return null;
};
