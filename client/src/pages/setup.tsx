import AppShell from "@/components/layout/app-shell";
import { toast } from "sonner";
import PackageCards from "@/components/setup/package-cards";
import ProjectStructure from "@/components/setup/project-structure";
import ChartDemo from "@/components/setup/chart-demo";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Setup() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Configuração Inicial do Projeto</h2>
        
        <div className="bg-white shadow rounded-lg border mb-6">
          <div className="p-6">
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

        <div className="bg-white shadow rounded-lg border p-6 mb-6">
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
              onClick={() => toast.info("Configuração inicial concluída.")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Info
            </Button>
          </div>
        </div>

        <ChartDemo />
        
        <div className="mt-8 border-t border-gray-200 pt-6 flex justify-between">
          <Button 
            variant="outline"
            onClick={() => window.location.href = "/"}
          >
            Voltar para Início
          </Button>
          
          <Button 
            onClick={() => {
              toast.success("Navegando para o Dashboard");
              window.location.href = "/dashboard";
            }}
          >
            Ver Dashboard
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
