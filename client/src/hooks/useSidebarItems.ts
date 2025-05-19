import { useAuth } from "@/lib/auth";
import { useHasPermission } from "./useHasPermission";

export type UserRole = "SUPER_ADMIN" | "DIRETOR" | "COLABORADOR_NIVEL_2" | "DONO_ASSINANTE";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
  permission?: string;
}

/**
 * Hook para gerar itens do menu lateral baseados na role e permissões do usuário
 * @returns Array de itens para o menu lateral
 */
export function useSidebarItems(): SidebarItem[] {
  const { user } = useAuth();
  const canManagePatients = useHasPermission('CAN_VIEW_PATIENT');
  
  if (!user) return [];
  
  // Itens comuns a todos os usuários
  const commonItems: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];
  
  // Itens específicos para cada role
  const roleSpecificItems: Record<UserRole, SidebarItem[]> = {
    SUPER_ADMIN: [
      { label: "Assinantes", href: "/admin/subscribers" },
      { label: "Usuários", href: "/admin/system-users" },
      { label: "Segmentos", href: "/admin/segments" },
      { label: "Módulos", href: "/admin/modules" },
      { label: "Planos", href: "/admin/plans" },
    ],
    DIRETOR: [
      { label: "Assinantes", href: "/admin/subscribers" },
      { label: "Usuários", href: "/admin/system-users" },
    ],
    DONO_ASSINANTE: [
      { label: "Pacientes", href: "/clinica/patients", permission: "CAN_VIEW_PATIENT" },
      { label: "Agenda", href: "/clinica/agenda" },
      { label: "Relatórios", href: "/clinica/reports" },
    ],
    COLABORADOR_NIVEL_2: [
      { label: "Agenda", href: "/app/agenda" },
      { label: "Atendimentos", href: "/app/atendimentos" },
    ]
  };
  
  // Obter itens específicos para a role atual
  const currentRoleItems = user.role ? (roleSpecificItems[user.role as UserRole] || []) : [];
  
  // Filtrar itens com base nas permissões
  const filteredItems = currentRoleItems.filter(item => {
    if (!item.permission) return true;
    return useHasPermission(item.permission);
  });
  
  return [...commonItems, ...filteredItems];
}