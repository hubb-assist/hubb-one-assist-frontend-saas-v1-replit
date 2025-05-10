import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation()[0];
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        await checkAuth();
        setIsChecking(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        
        // Tentativas limitadas para evitar loops infinitos
        if (retryCount < 3) {
          console.log(`Tentando novamente (${retryCount + 1}/3)...`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => verificarAutenticacao(), 1000); // Tentar novamente após 1 segundo
        } else {
          console.error("Número máximo de tentativas excedido");
          setIsChecking(false);
          toast.error("Não foi possível verificar a autenticação. Faça login novamente.");
        }
      }
    };

    verificarAutenticacao();
  }, [checkAuth, retryCount]);

  // Verificação adicional do estado do usuário obtido do Auth context
  const { user } = useAuth();
  
  // Validar com mais rigor se o usuário está realmente autenticado
  const isReallyAuthenticated = 
    isAuthenticated && // Verificação básica do estado 
    user && // Usuário existe
    user.id && // ID do usuário existe
    user.email && // Email do usuário existe
    // Verificar que não há flag explícita indicando não autenticado 
    (user.authenticated !== false); 
  
  // Log para debug com informações detalhadas
  console.log("Estado de autenticação:", { 
    isChecking, 
    isLoading, 
    isAuthenticated,
    isReallyAuthenticated,
    user: user ? { 
      id: user.id, 
      email: user.email, 
      authenticated: user.authenticated
    } : null,
    currentRoute: location 
  });

  if (isChecking || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Verificando autenticação... {retryCount > 0 ? `(Tentativa ${retryCount}/3)` : ''}</span>
      </div>
    );
  }

  // Usar a verificação mais rigorosa
  if (!isReallyAuthenticated) {
    console.log("Não autenticado ou autenticação inválida, redirecionando para login");
    // Armazenar a URL atual para redirecionamento após o login
    sessionStorage.setItem('redirectTo', location);
    toast.error("Acesso restrito. Por favor, faça login para continuar.");
    return <Redirect to="/login" />;
  }

  console.log("Autenticado, mostrando conteúdo protegido");
  return <>{children}</>;
}