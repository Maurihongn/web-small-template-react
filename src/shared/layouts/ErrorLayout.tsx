import { type ReactNode } from "react";
import { useNavigate } from "react-router"; // Nota: en React Router v7 a veces es 'react-router-dom'
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/shared/components/ui/button"; // Asegúrate de tener este componente

interface ErrorLayoutProps {
  icon: ReactNode;
  title: string;
  description: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  action?: ReactNode; // Botón extra opcional (ej: "Recargar")
}

export const ErrorLayout = ({
  icon,
  title,
  description,
  showBackButton = false,
  showHomeButton = true,
  action,
}: ErrorLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      {/* Círculo con Icono */}
      <div className="mb-6 rounded-full bg-muted p-4 text-primary">{icon}</div>

      {/* Textos */}
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
        {title}
      </h1>
      <p className="mb-8 max-w-125 text-lg text-muted-foreground">
        {description}
      </p>

      {/* Botonera */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {showBackButton && (
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver atrás
          </Button>
        )}

        {showHomeButton && (
          <Button onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Ir al Inicio
          </Button>
        )}

        {/* Botón personalizado extra */}
        {action}
      </div>
    </div>
  );
};
