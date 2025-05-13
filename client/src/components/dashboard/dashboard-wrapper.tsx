import React from 'react';
import DynamicAppShell from '@/components/layout/dynamic-app-shell';
import { useAuth } from '@/lib/auth';
import { Redirect } from 'wouter';
import type { UserRole } from '@/components/layout/dynamic-app-shell';

interface DashboardWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  requiredRoles?: string[];
}

/**
 * Componente wrapper para todas as páginas de dashboard
 * - Renderiza o DynamicAppShell baseado na role do usuário
 * - Verifica se o usuário tem permissão para acessar a página
 * - Redireciona para a página correta se não tiver permissão
 */
export default function DashboardWrapper({ 
  children, 
  title, 
  subtitle,
  requiredRoles 
}: DashboardWrapperProps) {
  const { user, isAuthenticated } = useAuth();
  
  // Se o usuário não estiver autenticado, não precisamos verificar aqui
  // O PrivateRoute já faz essa verificação
  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  // Verificar se o usuário tem permissão para acessar a página
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = user.role;
    if (!userRole || !requiredRoles.includes(userRole)) {
      // Redirecionar para a página correta baseada na role
      return <Redirect to="/" />;
    }
  }

  // Verificação lógica de role concluída acima
  
  return (
    <DynamicAppShell
      title={title}
      subtitle={subtitle}
      role={user.role as UserRole}
    >
      {children}
    </DynamicAppShell>
  );
}