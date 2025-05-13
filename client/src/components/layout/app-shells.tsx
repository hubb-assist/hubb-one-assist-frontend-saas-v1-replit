import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { SidebarAdmin, SidebarClinic, SidebarUser } from "@/components/sidebar/sidebars";
import Header from "@/components/layout/header";

// Interface comum para todos os AppShells
interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * Base AppShell que contém a lógica comum para todos os tipos de AppShell
 */
function BaseAppShell({ 
  children,
  title,
  subtitle,
  SidebarComponent
}: AppShellProps & { 
  SidebarComponent: React.FC<{ expanded: boolean }> 
}) {
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
        <div className="flex-1 overflow-hidden">
          <SidebarComponent expanded={expanded || isMobile} />
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
        {/* Header Component */}
        <Header 
          title={title}
          subtitle={subtitle}
          user={user}
          onLogout={logout}
          isMobile={isMobile}
          onToggleSidebar={toggleSidebar}
        />

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

/**
 * AppShell para Administrador (Super Admin e Diretor)
 */
export function AppShellAdmin({ children, title = "Painel Admin", subtitle }: AppShellProps) {
  return (
    <BaseAppShell 
      title={title} 
      subtitle={subtitle} 
      SidebarComponent={SidebarAdmin}
    >
      {children}
    </BaseAppShell>
  );
}

/**
 * AppShell para Clínica (Dono de clínica)
 */
export function AppShellClinic({ children, title = "Painel da Clínica", subtitle }: AppShellProps) {
  return (
    <BaseAppShell 
      title={title} 
      subtitle={subtitle} 
      SidebarComponent={SidebarClinic}
    >
      {children}
    </BaseAppShell>
  );
}

/**
 * AppShell para Usuário Comum
 */
export function AppShellUser({ children, title = "Área do Usuário", subtitle }: AppShellProps) {
  return (
    <BaseAppShell 
      title={title} 
      subtitle={subtitle} 
      SidebarComponent={SidebarUser}
    >
      {children}
    </BaseAppShell>
  );
}