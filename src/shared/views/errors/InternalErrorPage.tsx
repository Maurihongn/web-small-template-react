import { ServerCrash, RotateCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ErrorLayout } from "@/shared/layouts/ErrorLayout";

interface Props {
  error?: Error; // Para loguear si hiciera falta
  resetErrorBoundary?: () => void; // Función inyectada por react-error-boundary
}

export const InternalErrorPage = ({ resetErrorBoundary }: Props) => {
  
  const handleReload = () => {
    // Si viene del ErrorBoundary, intentamos resetear el estado de React
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      // Fallback nativo del navegador
      window.location.reload();
    }
  };

  return (
    <ErrorLayout
      icon={<ServerCrash className="h-10 w-10" />}
      title="Algo salió mal"
      description="Ha ocurrido un error crítico en el sistema. Estamos trabajando para solucionarlo."
      showHomeButton={true}
      showBackButton={false}
      // Inyectamos el botón de acción personalizado
      action={
        <Button variant="default" onClick={handleReload}>
          <RotateCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      }
    />
  );
};