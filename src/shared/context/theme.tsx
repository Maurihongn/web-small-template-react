// src/shared/contexts/theme.tsx
import { createContext, useContext } from "react";

// 1. Tipos
export type Theme = "dark" | "light" | "system";

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// 2. Estado Inicial (Safe default)
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

// 3. Contexto
export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// 4. Hook
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};