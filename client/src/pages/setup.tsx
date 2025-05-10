import AppLayout from "@/components/layout/app-layout";
import { toast } from "sonner";
import PackageCards from "@/components/setup/package-cards";
import ProjectStructure from "@/components/setup/project-structure";
import ChartDemo from "@/components/setup/chart-demo";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Setup() {
  return (
    <AppLayout title="Configuração" subtitle="Detalhes Técnicos">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-6 sm:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuração Inicial do Projeto</h2>
          
          <div className="border-b border-gray-200 pb-6">
            <div className="mt-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Estrutura inicial criada</h3>
                  <p className="mt-1 text-sm text-gray-500">O projeto foi iniciado com sucesso usando React + Vite</p>
                </div>
              </div>
            </div>
          </div>

          <PackageCards />

          <ProjectStructure />

          <div className="py-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Demonstração do Sonner</h3>
            <div className="flex space-x-2">
              <Button 
                onClick={() => toast.success("Operação realizada com sucesso!")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Sucesso
              </Button>
              <Button 
                variant="destructive"
                onClick={() => toast.error("Ocorreu um erro ao processar sua solicitação.")}
              >
                Erro
              </Button>
              <Button 
                variant="default"
                onClick={() => toast.info("Configuração inicial concluída.")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Info
              </Button>
            </div>
          </div>

          <ChartDemo />
        </div>
      </div>
    </AppLayout>
  );
}
