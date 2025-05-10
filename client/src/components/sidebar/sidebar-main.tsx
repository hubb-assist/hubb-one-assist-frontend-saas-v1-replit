import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart3, 
  Users, 
  MessageSquareText, 
  Settings, 
  HelpCircle,
  Layers,
  AppWindow,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  active?: boolean;
}

const NavItem = ({ href, icon, label, expanded, active = false }: NavItemProps) => {
  const link = (
    <a
      href={href}
      className={cn(
        'flex items-center gap-x-2 rounded-md px-3 py-2 text-white/70 transition-all hover:bg-white/10 hover:text-white',
        active && 'bg-white/10 text-white font-medium'
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      {expanded && <span>{label}</span>}
    </a>
  );

  if (!expanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="bg-primary-foreground">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
};

interface SidebarMainProps {
  expanded: boolean;
}

export default function SidebarMain({ expanded }: SidebarMainProps) {
  const pathname = window.location.pathname;
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    console.log('Iniciando logout...');
    await logout();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className={cn(
          "text-white/50 text-xs font-medium uppercase tracking-wider",
          !expanded && "sr-only"
        )}>
          Menu Principal
        </h2>

        <div className="mt-2 space-y-1">
          <NavItem
            href="/"
            icon={<Home className="h-5 w-5" />}
            label="Início"
            expanded={expanded}
            active={pathname === '/'}
          />
          
          <NavItem
            href="/dashboard"
            icon={<BarChart3 className="h-5 w-5" />}
            label="Dashboard"
            expanded={expanded}
            active={pathname === '/dashboard'}
          />
          
          <NavItem
            href="/clientes"
            icon={<Users className="h-5 w-5" />}
            label="Clientes"
            expanded={expanded}
            active={pathname === '/clientes'}
          />
          
          <NavItem
            href="/chat"
            icon={<MessageSquareText className="h-5 w-5" />}
            label="Chat"
            expanded={expanded}
            active={pathname === '/chat'}
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
          {/* Item de Módulos */}
          <NavItem
            href="/admin/modules"
            icon={<AppWindow className="h-5 w-5" />}
            label="Módulos Funcionais"
            expanded={expanded}
            active={pathname === '/admin/modules'}
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
            href="/configuracoes"
            icon={<Settings className="h-5 w-5" />}
            label="Configurações"
            expanded={expanded}
            active={pathname === '/configuracoes'}
          />
          
          <NavItem
            href="/setup"
            icon={<HelpCircle className="h-5 w-5" />}
            label="Setup"
            expanded={expanded}
            active={pathname === '/setup'}
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