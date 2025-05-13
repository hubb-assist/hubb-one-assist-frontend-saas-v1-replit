import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  active?: boolean;
}

/**
 * Componente NavItem para itens de menu da sidebar
 * Usado por todas as sidebars especializadas
 */
export const NavItem = ({ href, icon, label, expanded, active = false }: NavItemProps) => {
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