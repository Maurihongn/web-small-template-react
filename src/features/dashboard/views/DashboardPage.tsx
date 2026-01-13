import { SafeSection } from "@/shared/components/feedback/SafeSection";
import { BuggyButton, BuggyWidget } from "@/shared/components/debug/BuggyComponents";

export const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Panel de Control</h1>

      {/* PRUEBA 1: Un botón suelto protegido */}
      <SafeSection fallbackClassName="w-fit">
        <div className="p-4 border rounded shadow-sm">
           <h3>Prueba de Botón</h3>
           <BuggyButton />
        </div>
      </SafeSection>

      {/* PRUEBA 2: Un Widget completo protegido (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Este funcionará bien */}
        <div className="p-6 border rounded shadow-sm bg-white">
           <h2 className="font-bold mb-2">Widget Seguro</h2>
           <p>Yo sigo vivo aunque mi vecino muera.</p>
        </div>

        {/* Este explotará pero no afectará al de al lado */}
        <SafeSection fallbackClassName="h-[200px]">
           <div className="p-4 border rounded shadow-sm bg-white h-full">
             <h2 className="font-bold mb-2">Widget Inestable</h2>
             <BuggyWidget />
           </div>
        </SafeSection>

      </div>
    </div>
  );
};