import React from 'react';
import { NavItem } from '@/components/ui/sidebar-item';
import { cn } from '@/lib/utils';
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Layers,
  LayoutTemplate,
  UserPlus,
  LogOut,
  Building2,
  BriefcaseMedical,
  Stethoscope,
  FileText,
  ClipboardList,
  Calendar,
  User,
  Scroll
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Interface comum para todas as sidebars
interface SidebarProps {
  expanded: boolean;
}

/**
 * Sidebar para SUPER_ADMIN e DIRETOR
 */
export function SidebarAdmin({ expanded }: SidebarProps) {
  const pathname = window.location.pathname;
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    console.log('Iniciando logout...');
    await logout();
  };

  return (
    <div className="space-y-4 py-4 overflow-hidden">
      <div className="px-3 py-2">
        <h2 className={cn(
          "text-white/50 text-xs font-medium uppercase tracking-wider",
          !expanded && "sr-only"
        )}>
          Menu Principal
        </h2>

        <div className="mt-2 space-y-1">
          <NavItem
            href="/admin"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            expanded={expanded}
            active={pathname === '/admin'}
          />
          
          <NavItem
            href="/admin/usuarios"
            icon={<Users className="h-5 w-5" />}
            label="Usuários"
            expanded={expanded}
            active={pathname === '/admin/usuarios'}
          />
          
          <NavItem
            href="/admin/subscribers"
            icon={<Building2 className="h-5 w-5" />}
            label="Assinantes"
            expanded={expanded}
            active={pathname === '/admin/subscribers'}
          />
          
          <NavItem
            href="/admin/segments"
            icon={<BriefcaseMedical className="h-5 w-5" />}
            label="Segmentos"
            expanded={expanded}
            active={pathname === '/admin/segments'}
          />
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className={cn(
          "text-white/50 text-xs font-medium uppercase tracking-wider",
          !expanded && "sr-only"
        )}>
          Cadastros
        </h2>
        
        <div className="mt-2 space-y-1">
          <NavItem
            href="/admin/segments"
            icon={<Layers className="h-5 w-5" />}
            label="Segmentos"
            expanded={expanded}
            active={pathname === '/admin/segments'}
          />
          
          <NavItem
            href="/admin/modules"
            icon={<LayoutTemplate className="h-5 w-5" />}
            label="Módulos Funcionais"
            expanded={expanded}
            active={pathname === '/admin/modules'}
          />
          
          <NavItem
            href="/admin/plans"
            icon={<LayoutTemplate className="h-5 w-5" />}
            label="Planos"
            expanded={expanded}
            active={pathname === '/admin/plans'}
          />
          
          <NavItem
            href="/admin/system-users"
            icon={<Users className="h-5 w-5" />}
            label="Usuários do Sistema"
            expanded={expanded}
            active={pathname === '/admin/system-users'}
          />
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className={cn(
          "text-white/50 text-xs font-medium uppercase tracking-wider",
          !expanded && "sr-only"
        )}>
          Sistema
        </h2>
        
        <div className="mt-2 space-y-1">
          <NavItem
            href="/admin/configuracoes"
            icon={<Settings className="h-5 w-5" />}
            label="Configurações"
            expanded={expanded}
            active={pathname === '/admin/configuracoes'}
          />
          
          {expanded ? (
            <div 
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-x-2 rounded-md px-3 py-2 text-red-300 transition-all hover:bg-white/10 hover:text-red-200 cursor-pointer',
              )}
            >
              <span className="flex-shrink-0"><LogOut className="h-5 w-5" /></span>
              <span>Sair</span>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  onClick={handleLogout}
                  className={cn(
                    'flex items-center gap-x-2 rounded-md px-3 py-2 text-red-300 transition-all hover:bg-white/10 hover:text-red-200 cursor-pointer',
                  )}
                >
                  <span className="flex-shrink-0"><LogOut className="h-5 w-5" /></span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-primary-foreground">
                Sair
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="px-3 py-4 mt-auto border-t border-white/10">
          <p className="text-white/40 text-xs">
            HUBB ONE Assist v1.0
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Sidebar para DONO_CLINICA (Veterinária, Odontologia etc.)
 */
export function SidebarClinic({ expanded }: SidebarProps) {
  const pathname = window.location.pathname;
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    console.log('Iniciando logout...');
    await logout();
  };

  return (
    <div className="space-y-4 py-4 overflow-hidden">
      <div className="px-3 py-2">
        <h2 className={cn(
          "text-white/50 text-xs font-medium uppercase tracking-wider",
          !expanded && "sr-only"
        )}>
          Menu Principal
        </h2>

        <div className="mt-2 space-y-1">
          <NavItem
            href="/clinica"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            expanded={expanded}
            active={pathname === '/clinica'}
          />
          
          <NavItem
            href="/clinica/patients"
            icon={<ClipboardList className="h-5 w-5" />}
            label="Pacientes"
            expanded={expanded}
            active={pathname.startsWith('/clinica/patients')}
          />
          
          <NavItem
            href="/clinica/atendimentos"
            icon={<Stethoscope className="h-5 w-5" />}
            label="Atendimentos"
            expanded={expanded}
            active={pathname === '/clinica/atendimentos'}
          />
          
          <NavItem
            href="/clinica/procedimentos"
            icon={<Scroll className="h-5 w-5" />}
            label="Procedimentos"
            expanded={expanded}
            active={pathname === '/clinica/procedimentos'}
          />

          <NavItem
            href="/clinica/agenda"
            icon={<Calendar className="h-5 w-5" />}
            label="Agenda"
            expanded={expanded}
            active={pathname === '/clinica/agenda'}
          />
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className={cn(
          "text-white/50 text-xs font-medium uppercase tracking-wider",
          !expanded && "sr-only"
        )}>
          Sistema
        </h2>
        
        <div className="mt-2 space-y-1">
          <NavItem
            href="/clinica/configuracoes"
            icon={<Settings className="h-5 w-5" />}
            label="Configurações"
            expanded={expanded}
            active={pathname === '/clinica/configuracoes'}
          />
          
          {expanded ? (
            <div 
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-x-2 rounded-md px-3 py-2 text-red-300 transition-all hover:bg-white/10 hover:text-red-200 cursor-pointer',
              )}
            >
              <span className="flex-shrink-0"><LogOut className="h-5 w-5" /></span>
              <span>Sair</span>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  onClick={handleLogout}
                  className={cn(
                    'flex items-center gap-x-2 rounded-md px-3 py-2 text-red-300 transition-all hover:bg-white/10 hover:text-red-200 cursor-pointer',
                  )}
                >
                  <span className="flex-shrink-0"><LogOut className="h-5 w-5" /></span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-primary-foreground">
                Sair
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="px-3 py-4 mt-auto border-t border-white/10">
          <p className="text-white/40 text-xs">
            HUBB ONE Assist v1.0
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Sidebar para USUÁRIO COMUM da clínica
 */
export function SidebarUser({ expanded }: SidebarProps) {
  const pathname = window.location.pathname;
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    console.log('Iniciando logout...');
    await logout();
  };

  return (
    <div className="space-y-4 py-4 overflow-hidden">
      <div className="px-3 py-2">
        <h2 className={cn(
          "text-white/50 text-xs font-medium uppercase tracking-wider",
          !expanded && "sr-only"
        )}>
          Menu Principal
        </h2>

        <div className="mt-2 space-y-1">
          <NavItem
            href="/app"
            icon={<Home className="h-5 w-5" />}
            label="Início"
            expanded={expanded}
            active={pathname === '/app'}
          />
          
          <NavItem
            href="/app/minha-ficha"
            icon={<ClipboardList className="h-5 w-5" />}
            label="Minha Ficha"
            expanded={expanded}
            active={pathname === '/app/minha-ficha'}
          />
          
          <NavItem
            href="/app/meus-procedimentos"
            icon={<FileText className="h-5 w-5" />}
            label="Meus Procedimentos"
            expanded={expanded}
            active={pathname === '/app/meus-procedimentos'}
          />
          
          <NavItem
            href="/app/conta"
            icon={<User className="h-5 w-5" />}
            label="Conta"
            expanded={expanded}
            active={pathname === '/app/conta'}
          />
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className={cn(
          "text-white/50 text-xs font-medium uppercase tracking-wider",
          !expanded && "sr-only"
        )}>
          Sistema
        </h2>
        
        <div className="mt-2 space-y-1">          
          {expanded ? (
            <div 
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-x-2 rounded-md px-3 py-2 text-red-300 transition-all hover:bg-white/10 hover:text-red-200 cursor-pointer',
              )}
            >
              <span className="flex-shrink-0"><LogOut className="h-5 w-5" /></span>
              <span>Sair</span>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  onClick={handleLogout}
                  className={cn(
                    'flex items-center gap-x-2 rounded-md px-3 py-2 text-red-300 transition-all hover:bg-white/10 hover:text-red-200 cursor-pointer',
                  )}
                >
                  <span className="flex-shrink-0"><LogOut className="h-5 w-5" /></span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-primary-foreground">
                Sair
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="px-3 py-4 mt-auto border-t border-white/10">
          <p className="text-white/40 text-xs">
            HUBB ONE Assist v1.0
          </p>
        </div>
      )}
    </div>
  );
}