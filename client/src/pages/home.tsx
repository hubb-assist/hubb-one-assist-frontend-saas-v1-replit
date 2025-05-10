import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Home as HomeIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <HomeIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">HUBB ONE Assist</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Vá para a página de setup para ver a configuração inicial do projeto.
          </p>

          <div className="mt-6">
            <Button 
              onClick={() => {
                toast.success("Navegando para setup");
                window.location.href = "/setup";
              }}
            >
              Ir para Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
