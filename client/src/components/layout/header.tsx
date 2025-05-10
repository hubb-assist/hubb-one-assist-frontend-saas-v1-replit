import React from "react";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "@/lib/auth";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  user: User | null;
  onLogout: () => Promise<void>;
  isMobile?: boolean;
  onToggleSidebar?: () => void;
}

/**
 * Componente padrão de cabeçalho para toda a aplicação
 * Este componente substitui as implementações anteriores (AppHeader e HeaderDashboard)
 */
export default function Header({
  title = "HUBB ONE Assist",
  subtitle,
  user,
  onLogout,
  isMobile,
  onToggleSidebar
}: HeaderProps) {
  const handleLogout = async () => {
    console.log('Iniciando logout...');
    await onLogout();
  };

  return (
    <header className="bg-secondary h-16 sticky top-0 z-10 flex items-center justify-between shadow-md px-4">
      <div className="flex items-center">
        {isMobile && onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white/90 hover:bg-white/10"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5 text-white" />
            <span className="sr-only">Menu</span>
          </Button>
        )}
        
        <div className="flex items-center text-white">
          {title && (
            <div className="flex items-center">
              <h1 className="text-lg font-medium">{title}</h1>
              
              {subtitle && (
                <>
                  <ChevronRight className="mx-1 h-4 w-4 opacity-50" />
                  <p className="text-sm opacity-80">{subtitle}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white/90 hover:bg-white/10 relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-medium text-primary">
            3
          </span>
          <span className="sr-only">Notificações</span>
        </Button>
        
        <Button 
          variant="ghost"
          className="text-white/90 hover:bg-white/10 flex items-center gap-2"
        >
          <UserCircle className="h-5 w-5" />
          <span>Meus Dados</span>
        </Button>
        
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 border-2 border-white/20">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback className="bg-white/10 text-white">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'UA'}
            </AvatarFallback>
          </Avatar>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white/90 hover:bg-white/10 hover:text-red-300"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}