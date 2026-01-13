import { ShieldAlert } from "lucide-react";
import { ErrorLayout } from "@/shared/layouts/ErrorLayout";

export const ForbiddenPage = () => {
  return (
    <ErrorLayout
      icon={<ShieldAlert className="h-10 w-10" />}
      title="Acceso Denegado"
      description="Lo sentimos, no tienes los permisos necesarios para ver este recurso. Contacta con tu administrador."
      showBackButton={true}
      showHomeButton={true}
    />
  );
};