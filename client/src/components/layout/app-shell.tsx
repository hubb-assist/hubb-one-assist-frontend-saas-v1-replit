import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, UserCircle, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SidebarMain from "@/components/sidebar/sidebar-main";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setExpanded(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setExpanded(!expanded);
    }
  };

  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    console.log('Iniciando logout...');
    await logout();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-30 h-screen bg-primary flex flex-col transition-all duration-300",
          expanded ? "w-60" : "w-20",
          isMobile && "w-60",
          isMobile && !mobileOpen && "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          {expanded || isMobile ? (
            <img 
              src="https://sq360.com.br/logo-hubb-novo/logo_hubb_assisit.png" 
              alt="HUBB Assist Logo" 
              className="h-8"
            />
          ) : (
            <img 
              src="https://sq360.com.br/logo-hubb-novo/hubb_pet_icon.png" 
              alt="HUBB Icon" 
              className="h-8"
            />
          )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-auto">
          <SidebarMain expanded={expanded || isMobile} />
        </div>

        {/* Toggle Button */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background shadow-sm"
            onClick={toggleSidebar}
          >
            {expanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="sr-only">
              {expanded ? "Fechar Menu" : "Abrir Menu"}
            </span>
          </Button>
        )}
      </aside>

      {/* Overlay for mobile */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          expanded && !isMobile ? "ml-60" : "ml-0 sm:ml-20"
        )}
      >
        {/* Header */}
        <header className="bg-secondary h-16 sticky top-0 z-10 flex items-center justify-between shadow-md px-4">
          <div className="flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 text-white/90 hover:bg-white/10"
                onClick={toggleSidebar}
              >
                <ChevronRight className="h-5 w-5 text-white" />
                <span className="sr-only">Menu</span>
              </Button>
            )}
            <h1 className="text-white text-lg font-medium">HUBB ONE Assist</h1>
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

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>

      <Toaster position="top-right" />
    </div>
  );
}