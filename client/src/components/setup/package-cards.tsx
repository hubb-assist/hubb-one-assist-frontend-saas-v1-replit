import { 
  Paintbrush, 
  RadioTower,
  Sliders, 
  CircleDashed, 
  BarChart3,
  Code 
} from "lucide-react";

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  icon: React.ReactNode;
}

export default function PackageCards() {
  const packages: PackageInfo[] = [
    {
      name: "Tailwind CSS",
      version: "3.4.17",
      description: "Biblioteca de utilitários CSS para construção de interfaces",
      icon: <Paintbrush className="h-5 w-5 text-primary-600" />
    },
    {
      name: "ShadCN UI",
      version: "Integrado com Tailwind",
      description: "Componentes de interface reutilizáveis e acessíveis",
      icon: <RadioTower className="h-5 w-5 text-primary-600" />
    },
    {
      name: "Sonner",
      version: "1.0.0",
      description: "Biblioteca para notificações toast elegantes",
      icon: <Sliders className="h-5 w-5 text-primary-600" />
    },
    {
      name: "Lucide-react",
      version: "0.453.0",
      description: "Biblioteca de ícones para React",
      icon: <CircleDashed className="h-5 w-5 text-primary-600" />
    },
    {
      name: "Recharts",
      version: "2.15.2",
      description: "Biblioteca de gráficos para React com suporte a gradientes",
      icon: <BarChart3 className="h-5 w-5 text-primary-600" />
    },
    {
      name: "React + Vite",
      version: "Base do projeto",
      description: "Framework e bundler para desenvolvimento frontend",
      icon: <Code className="h-5 w-5 text-primary-600" />
    }
  ];

  return (
    <div className="py-6 border-b border-gray-200">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Pacotes instalados</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-2">
                {pkg.icon}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-semibold text-gray-900">{pkg.name}</h4>
                <span className="text-xs text-gray-500">{pkg.version}</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-600">{pkg.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
