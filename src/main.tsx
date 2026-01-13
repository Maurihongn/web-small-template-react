import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryProvider } from "./app/providers/core/QueryProvider";
import { ThemeProvider } from "./app/providers/core/ThemeProvider";
import { Routing } from "./app/routes";

// TODO: Cambiar el storageKey y defaultTheme según el proyecto

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="template-theme">
        <Routing />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
