import React from 'react';
import { AppShellAdmin, AppShellClinic, AppShellUser } from './app-shells';
import { useAuth } from '@/lib/auth';

// Tipos de roles suportados
export type UserRole = 'SUPER_ADMIN' | 'DIRETOR' | 'COLABORADOR_NIVEL_2' | 'DONO_ASSINANTE' | 'PROFISSIONAL' | 'CLIENTE';

interface DynamicAppShellProps {
  children: React.ReactNode;
  role?: UserRole;
  title?: string;
  subtitle?: string;
}

/**
 * Função para determinar o caminho do dashboard com base na role
 * Pode ser importada e usada após o login para redirecionamento apropriado
 */
export function getDashboardPathByRole(role?: UserRole): string {
  if (!role) return '/login';
  
  switch (role) {
    case 'SUPER_ADMIN':
    case 'DIRETOR':
      return '/admin';
    case 'DONO_ASSINANTE':
      return '/clinica';
    case 'COLABORADOR_NIVEL_2':
    case 'PROFISSIONAL':
    case 'CLIENTE':
      return '/app';
    default:
      return '/login';
  }
}

/**
 * Componente DynamicAppShell que renderiza o AppShell apropriado
 * baseado na role do usuário
 */
export default function DynamicAppShell({ 
  children, 
  role: explicitRole,
  title,
  subtitle
}: DynamicAppShellProps) {
  // Se não for fornecida uma role explícita, usa a role do usuário autenticado
  const { user } = useAuth();
  const role = explicitRole || (user?.role as UserRole);
  
  // Log para verificar qual role está sendo usada
  console.log('DynamicAppShell - Role atual:', role, 'User completo:', user);

  // Se não houver role definida, não renderiza nada
  // Isso não deveria acontecer, pois rotas protegidas verificam autenticação
  if (!role) {
    console.warn('DynamicAppShell: nenhuma role definida');
    return <>{children}</>;
  }

  // Renderiza o AppShell baseado na role
  switch (role) {
    case 'SUPER_ADMIN':
    case 'DIRETOR':
      return <AppShellAdmin title={title} subtitle={subtitle}>{children}</AppShellAdmin>;
    
    case 'DONO_ASSINANTE':
      return <AppShellClinic title={title} subtitle={subtitle}>{children}</AppShellClinic>;
    
    case 'COLABORADOR_NIVEL_2':
    case 'PROFISSIONAL':
    case 'CLIENTE':
      return <AppShellUser title={title} subtitle={subtitle}>{children}</AppShellUser>;
    
    default:
      console.warn(`DynamicAppShell: role desconhecida: ${role}`);
      return <AppShellUser title={title} subtitle={subtitle}>{children}</AppShellUser>;
  }
}