import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Bug, Skull } from "lucide-react";

// ----------------------------------------------------------------------
// 1. Botón Suicida (BuggyButton)
// ----------------------------------------------------------------------
// Úsalo para probar errores puntuales en formularios o acciones.
export const BuggyButton = () => {
  const [shouldExplode, setShouldExplode] = useState(false);

  // 💣 Esto ocurre durante el render -> Activa el ErrorBoundary
  if (shouldExplode) {
    throw new Error("💥 ¡CRASH! El botón ha explotado intencionalmente.");
  }

  return (
    <Button 
      variant="destructive" 
      onClick={() => setShouldExplode(true)}
      className="gap-2"
    >
      <Bug className="h-4 w-4" />
      Simular Error
    </Button>
  );
};

// ----------------------------------------------------------------------
// 2. Widget Roto (BuggyWidget)
// ----------------------------------------------------------------------
// Úsalo dentro de <SafeSection> en tu Dashboard para ver el aislamiento.
export const BuggyWidget = () => {
  const [shouldExplode, setShouldExplode] = useState(false);

  if (shouldExplode) {
    throw new Error("💀 Error crítico cargando los datos del Widget.");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="rounded-full bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30">
        <span className="text-2xl font-bold">100%</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        El sistema está estable... por ahora.
      </p>

      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShouldExplode(true)}
        className="mt-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-900/50 dark:hover:bg-orange-900/20"
      >
        <Skull className="mr-2 h-4 w-4" />
        Romper Widget
      </Button>
    </div>
  );
};