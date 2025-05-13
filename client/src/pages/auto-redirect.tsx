import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { authService } from '@/lib/api';
import { getDashboardPathByRole } from '@/components/layout/dynamic-app-shell';

/**
 * Componente para redirecionamento inteligente
 * Usado na rota principal para redirecionar o usuário para o dashboard correto
 */
export default function AutoRedirect() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Se o usuário não estiver autenticado ou a autenticação ainda estiver carregando, não fazer nada
    if (!isAuthenticated || isLoading || !user) {
      return;
    }

    async function fetchDashboardTypeAndRedirect() {
      setIsRedirecting(true);
      try {
        // Fazer chamada para determinar o tipo de dashboard
        console.log('Obtendo tipo de dashboard para redirecionamento automático');
        const response = await authService.getDashboardType();
        const dashboardType = response.dashboard_type;

        console.log('Tipo de dashboard recebido:', dashboardType);
        
        // Determinar para qual rota redirecionar com base no tipo
        let redirectPath = '/dashboard'; // Caminho padrão
        
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
            toast.warning('Tipo de dashboard desconhecido. Redirecionando com base no perfil.');
            const userRole = user?.role as any;
            redirectPath = getDashboardPathByRole(userRole);
        }
        
        // Redirecionar para o dashboard apropriado
        console.log('Redirecionando automaticamente para:', redirectPath);
        navigate(redirectPath);
      } catch (error) {
        console.error('Erro ao obter tipo de dashboard:', error);
        toast.error('Erro ao verificar acesso. Redirecionando para dashboard padrão.');
        
        // Em caso de erro, usar o método antigo baseado em role
        const userRole = user?.role as any;
        const fallbackPath = getDashboardPathByRole(userRole);
        
        navigate(fallbackPath);
      } finally {
        setIsRedirecting(false);
      }
    }
    
    // Iniciar o redirecionamento
    fetchDashboardTypeAndRedirect();
  }, [isAuthenticated, isLoading, user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-700 mb-2">Redirecionando</h2>
        <p className="text-gray-500">
          {isAuthenticated 
            ? 'Verificando seu acesso e redirecionando para o dashboard apropriado...' 
            : 'Verificando seu acesso...'}
        </p>
      </div>
    </div>
  );
}