import React from 'react';
import OnboardingForm from '@/components/onboarding/onboarding-form';

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-[#2D113F] flex flex-col">
      {/* Header simples */}
      <header className="bg-[#1B0B25] shadow-sm py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://sq360.com.br/logo-hubb-novo/logo_hubb_assisit.png" 
              alt="HUBB ONE Assist" 
              className="h-10"
            />
          </div>
          <div>
            <a 
              href="/login" 
              className="text-sm font-medium text-white hover:text-white/90"
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
      <footer className="bg-[#1B0B25] py-8 px-6 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} HUBB ONE Assist. Todos os direitos reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-sm text-white/60 hover:text-white/90 mr-4">
                Termos de Uso
              </a>
              <a href="#" className="text-sm text-white/60 hover:text-white/90">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}