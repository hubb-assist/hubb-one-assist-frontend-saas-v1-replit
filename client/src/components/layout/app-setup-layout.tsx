import { Toaster } from "sonner";

interface AppSetupLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout simplificado para páginas de setup e login
 * Não contém cabeçalho ou barra lateral
 */
export default function AppSetupLayout({ children }: AppSetupLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#2D113F]">
      {/* Conteúdo principal sem cabeçalho */}
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      {/* Footer simplificado */}
      <footer className="py-4 mt-auto">
        <div className="mx-auto px-4 max-w-7xl">
          <p className="text-xs text-white/50 text-center">© {new Date().getFullYear()} HUBB ONE Assist. Todos os direitos reservados.</p>
        </div>
      </footer>
      
      <Toaster position="top-right" />
    </div>
  );
}
