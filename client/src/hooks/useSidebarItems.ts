import { useAuth } from "@/lib/auth";

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
  const { user, hasPermission, canAccessAdmin, canAccessClinica, canAccessApp } = useAuth();
  
  if (!user) return [];
  
  // Itens comuns a todos os usuários
  const commonItems: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];
  
  // Itens específicos para cada role
  const roleSpecificItems: Record<UserRole, SidebarItem[]> = {
    SUPER_ADMIN: [
      { label: "Assinantes", href: "/admin/subscribers", permission: "CAN_MANAGE_SUBSCRIBERS" },
      { label: "Usuários", href: "/admin/system-users", permission: "CAN_MANAGE_USERS" },
      { label: "Segmentos", href: "/admin/segments", permission: "CAN_MANAGE_SEGMENTS" },
      { label: "Módulos", href: "/admin/modules", permission: "CAN_MANAGE_MODULES" },
      { label: "Planos", href: "/admin/plans", permission: "CAN_MANAGE_PLANS" },
    ],
    DIRETOR: [
      { label: "Assinantes", href: "/admin/subscribers", permission: "CAN_MANAGE_SUBSCRIBERS" },
      { label: "Usuários", href: "/admin/system-users", permission: "CAN_MANAGE_USERS" },
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
  let menuItems: SidebarItem[] = [];
  
  // Adicionar itens baseados nas áreas que o usuário pode acessar
  if (canAccessAdmin()) {
    // Se pode acessar área administrativa, adicionar itens de SUPER_ADMIN ou DIRETOR
    menuItems = [...menuItems, ...roleSpecificItems.SUPER_ADMIN];
  }
  
  if (canAccessClinica()) {
    // Se pode acessar área da clínica, adicionar itens de DONO_ASSINANTE
    menuItems = [...menuItems, ...roleSpecificItems.DONO_ASSINANTE];
  }
  
  if (canAccessApp()) {
    // Se pode acessar área do app, adicionar itens de COLABORADOR_NIVEL_2
    menuItems = [...menuItems, ...roleSpecificItems.COLABORADOR_NIVEL_2];
  }
  
  // Remover duplicatas (como mesmo link pode aparecer em múltiplas roles)
  const uniqueItems = menuItems.filter((item, index, self) => 
    index === self.findIndex((t) => t.href === item.href)
  );
  
  // Filtrar itens com base nas permissões
  const filteredItems = uniqueItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });
  
  return [...commonItems, ...filteredItems];
}