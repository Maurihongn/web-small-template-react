import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface ComponentErrorProps {
  error?: Error;
  resetErrorBoundary: () => void; // Función mágica de la librería
  className?: string; // Para ajustar márgenes si hace falta
}

export const ComponentError = ({ error, resetErrorBoundary, className }: ComponentErrorProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center",
      className
    )}>
      <AlertTriangle className="mb-2 h-8 w-8 text-destructive" />
      
      <h3 className="mb-1 text-sm font-semibold text-foreground">
        Error de carga
      </h3>
      
      <p className="mb-4 text-xs text-muted-foreground max-w-50">
        {/* Mostramos el mensaje corto o uno genérico */}
        {error?.message || "No se pudo cargar esta sección."}
      </p>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={resetErrorBoundary}
        className="h-8 gap-2 border-destructive/20 hover:bg-destructive/20"
      >
        <RotateCw className="h-3 w-3" />
        Reintentar
      </Button>
    </div>
  );
};