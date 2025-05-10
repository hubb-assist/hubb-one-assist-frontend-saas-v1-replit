import { Menu, Bell, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderDashboardProps {
  title: string;
  onToggleSidebar?: () => void;
}

export default function HeaderDashboard({ title, onToggleSidebar }: HeaderDashboardProps) {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    console.log('Iniciando logout...');
    await logout();
  };
  return (
    <header className="bg-secondary h-16 fixed top-0 left-0 right-0 z-20 flex items-center px-4 shadow-md">
      <div className="flex-1 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 text-white/90 hover:bg-white/10"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <h1 className="text-white text-lg font-medium">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-white/90 hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-medium text-primary">
            3
          </span>
          <span className="sr-only">Notificações</span>
        </Button>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarFallback className="bg-white/10 text-white">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                  </AvatarFallback>
                </Avatar>
                
                <Button 
                  variant="ghost"
                  size="sm"
                  className="ml-1 text-white/90 hover:bg-white/10 flex items-center"
                >
                  <span className="mr-1 text-sm hidden sm:inline">
                    {user?.name || 'Usuário'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-default">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer flex items-center text-destructive focus:text-destructive" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}