import React from 'react';
import OnboardingForm from '@/components/onboarding/onboarding-form';

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header simples */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://sq360.com.br/logo-hubb-novo/logo_hubb_assisit.png" 
              alt="HUBB ONE Assist" 
              className="h-8"
            />
          </div>
          <div>
            <a 
              href="/login" 
              className="text-sm font-medium text-primary hover:text-primary/90"
            >
              Já possui conta? Faça login
            </a>
          </div>
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto py-12 px-4">
        <OnboardingForm />
      </main>
      
      {/* Footer simples */}
      <footer className="bg-gray-100 py-8 px-6 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} HUBB ONE Assist. Todos os direitos reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 mr-4">
                Termos de Uso
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}