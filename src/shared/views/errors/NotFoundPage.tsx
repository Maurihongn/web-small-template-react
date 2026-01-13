import { ErrorLayout } from "@/shared/layouts/ErrorLayout";
import { MapPinOff } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <ErrorLayout
      icon={<MapPinOff className="h-10 w-10" />}
      title="404"
      description="Parece que te has perdido. La página que buscas no existe o ha sido movida."
      showBackButton={true}
      showHomeButton={true}
    />
  );
};
