import React from "react";
import { Toaster } from "sonner";
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarLogo, 
  SidebarMain,
  SidebarToggle,
  SidebarNavItem,
  SidebarLabel,
  SidebarDivider,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle,
  MessageSquareText
} from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarLogo />
          <SidebarMain>
            <SidebarNavItem 
              href="/" 
              icon={<Home className="h-5 w-5" />}
              label="Início" 
              active={true} 
            />
            
            <SidebarNavItem 
              href="/dashboard" 
              icon={<BarChart3 className="h-5 w-5" />}
              label="Dashboard" 
              active={false} 
            />
            
            <SidebarNavItem 
              href="/clientes" 
              icon={<Users className="h-5 w-5" />}
              label="Clientes" 
              active={false} 
            />
            
            <SidebarNavItem 
              href="/chat" 
              icon={<MessageSquareText className="h-5 w-5" />}
              label="Chat" 
              active={window.location.pathname === "/chat"} 
            />
            
            <SidebarDivider />
            
            <SidebarLabel>Sistema</SidebarLabel>
            
            <SidebarNavItem 
              href="/configuracoes" 
              icon={<Settings className="h-5 w-5" />}
              label="Configurações" 
              active={window.location.pathname === "/configuracoes"} 
            />
            
            <SidebarNavItem 
              href="/setup" 
              icon={<HelpCircle className="h-5 w-5" />}
              label="Setup" 
              active={window.location.pathname === "/setup"} 
            />
          </SidebarMain>
          <SidebarToggle />
        </Sidebar>
        
        <MainContent>
          {children}
        </MainContent>
        
        <Toaster position="top-right" />
      </div>
    </SidebarProvider>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar();
  
  return (
    <main
      className={cn(
        "flex-1 overflow-auto transition-all duration-300 p-6",
        state === "expanded" ? "ml-60" : "ml-20",
        isMobile && "ml-0"
      )}
    >
      {children}
    </main>
  );
}