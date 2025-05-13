import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface SmartRedirectProps {
  children?: React.ReactNode;
}

/**
 * Componente que redireciona o usuário para o dashboard correto com base no tipo retornado pela API
 */
export default function SmartRedirect({ children }: SmartRedirectProps) {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Só executa se o usuário estiver autenticado
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    async function redirectToDashboard() {
      try {
        setIsLoading(true);
        console.log('Obtendo tipo de dashboard para redirecionamento inteligente');
        
        // Chamar o endpoint de dashboard type
        const response = await authService.getDashboardType();
        const dashboardType = response.dashboard_type;
        
        console.log('Tipo de dashboard recebido:', dashboardType);
        
        // Determinar para qual rota redirecionar com base no tipo
        let redirectPath = '/';
        
        switch (dashboardType) {
          case 'admin_global':
            redirectPath = '/admin';
            break;
          case 'clinica_veterinaria':
          case 'clinica_odontologica':
          case 'clinica_padrao':
            redirectPath = '/clinica';
            break;
          case 'usuario_clinica':
            redirectPath = '/app';
            break;
          default:
            // Se não for um tipo conhecido, usa o método antigo baseado em role
            toast.warning('Tipo de dashboard desconhecido. Redirecionando com base no perfil.');
            const userRole = user?.role as any;
            redirectPath = getDashboardPathByRole(userRole);
        }
        
        // Redirecionar para o dashboard apropriado
        console.log('Redirecionando para:', redirectPath);
        navigate(redirectPath);
      } catch (error) {
        console.error('Erro ao obter tipo de dashboard:', error);
        toast.error('Erro ao verificar acesso. Redirecionando para dashboard padrão.');
        
        // Em caso de erro, usar o método antigo baseado em role
        const userRole = user?.role as any;
        const fallbackPath = getDashboardPathByRole(userRole);
        
        navigate(fallbackPath);
      } finally {
        setIsLoading(false);
      }
    }
    
    redirectToDashboard();
  }, [isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">Redirecionando</h2>
          <p className="text-gray-500">Verificando seu acesso...</p>
        </div>
      </div>
    );
  }

  // Se não estiver carregando, renderiza os filhos (se houver)
  return <>{children}</>;
}

/**
 * Função auxiliar para determinar o caminho do dashboard com base na role (fallback)
 */
function getDashboardPathByRole(role?: string): string {
  if (!role) return '/login';
  
  switch (role) {
    case 'SUPER_ADMIN':
    case 'DIRETOR':
      return '/admin';
    case 'DONO_CLINICA':
      return '/clinica';
    case 'PROFISSIONAL':
    case 'CLIENTE':
      return '/app';
    default:
      return '/login';
  }
}