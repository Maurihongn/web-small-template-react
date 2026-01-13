

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ComponentError } from "./ComponentError";

interface SafeSectionProps {
  children: ReactNode;
  fallbackClassName?: string; // Para pasar clases al cuadradito de error
}

export const SafeSection = ({ children, fallbackClassName }: SafeSectionProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset} // Resetea React Query al dar click
          fallbackRender={(props) => (
            <ComponentError {...props} className={fallbackClassName} />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};