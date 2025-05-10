import { Bell, User } from "lucide-react";
import { Toaster } from "sonner";

interface AppSetupLayoutProps {
  children: React.ReactNode;
}

export default function AppSetupLayout({ children }: AppSetupLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center space-x-2">
                {/* Logo placeholder */}
                <div className="h-8 w-8 rounded-md bg-primary-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 17.6L7 21M16 6.6l-1.4 3.4"/>
                    <path d="M3 14h5l2-6h3.6"/>
                    <path d="M10 14h11.4"/>
                    <path d="M21 12v2a4 4 0 01-4 4H9"/>
                  </svg>
                </div>
                <span className="font-semibold text-xl text-primary-600">HUBB ONE Assist</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button type="button" className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <span className="sr-only">Notificações</span>
                <Bell className="h-6 w-6" />
              </button>
              <button type="button" className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <span className="sr-only">Perfil</span>
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="text-sm text-gray-500 text-center">© 2023 HUBB ONE Assist. Todos os direitos reservados.</p>
        </div>
      </footer>
      
      <Toaster position="top-right" />
    </div>
  );
}
