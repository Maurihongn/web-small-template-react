import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryProvider } from "./app/providers/core/QueryProvider";
import { ThemeProvider } from "./app/providers/core/ThemeProvider";
import { Routing } from "./app/routes";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { InternalErrorPage } from "./shared/views/errors/InternalErrorPage";

// TODO: Cambiar el storageKey y defaultTheme según el proyecto

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="template-theme">
        {/* 2. Conector: Permite que el botón "Reintentar" limpie la caché de errores */}
        <QueryErrorResetBoundary>
          {({ reset }) => (
            /* 3. Capa de Seguridad (ErrorBoundary) */
            <ErrorBoundary
              onReset={reset} // Se ejecuta cuando el usuario da click en "Reintentar"
              FallbackComponent={InternalErrorPage} // La página que creamos antes
            >
              <Routing />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
