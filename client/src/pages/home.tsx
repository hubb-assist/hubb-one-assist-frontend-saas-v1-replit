import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Home as HomeIcon, ArrowRight } from "lucide-react";
import AppShell from "@/components/layout/app-shell";

export default function Home() {
  return (
    <AppShell>
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-4xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-6 gap-2">
              <HomeIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Bem-vindo ao HUBB ONE Assist</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-medium mb-2">Sobre o Sistema</h2>
                <p className="text-gray-600 mb-4">
                  Esta é a plataforma HUBB ONE Assist, configurada com React, Vite, Tailwind CSS e outros componentes essenciais.
                </p>
                <p className="text-gray-600">
                  Navegue pelo menu lateral para acessar as diferentes seções do sistema.
                </p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="p-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Acesse o Dashboard
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Visualize estatísticas e gráficos importantes para seu negócio.
                    </p>
                    <Button 
                      className="mt-4 w-full"
                      onClick={() => {
                        toast.success("Navegando para Dashboard");
                        window.location.href = "/dashboard";
                      }}
                    >
                      Ir para Dashboard
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-secondary/5 border-secondary/10">
                  <CardContent className="p-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Consulte a Configuração
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Veja a configuração inicial do projeto e detalhes técnicos.
                    </p>
                    <Button 
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => {
                        toast.success("Navegando para Setup");
                        window.location.href = "/setup";
                      }}
                    >
                      Ir para Setup
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
