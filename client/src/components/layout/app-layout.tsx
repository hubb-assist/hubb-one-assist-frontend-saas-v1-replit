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
import AppHeader from "@/components/layout/app-header";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle,
  MessageSquareText
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppLayout({ 
  children, 
  title, 
  subtitle 
}: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F5F5F5]">
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
            />
            
            <SidebarNavItem 
              href="/clientes" 
              icon={<Users className="h-5 w-5" />}
              label="Clientes" 
            />
            
            <SidebarNavItem 
              href="/chat" 
              icon={<MessageSquareText className="h-5 w-5" />}
              label="Chat" 
            />
            
            <SidebarDivider />
            
            <SidebarLabel>Sistema</SidebarLabel>
            
            <SidebarNavItem 
              href="/configuracoes" 
              icon={<Settings className="h-5 w-5" />}
              label="Configurações" 
            />
            
            <SidebarNavItem 
              href="/ajuda" 
              icon={<HelpCircle className="h-5 w-5" />}
              label="Ajuda" 
            />
          </SidebarMain>
          <SidebarToggle />
        </Sidebar>
        
        <AppHeader 
          title={title} 
          subtitle={subtitle} 
        />
        
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
        "flex-1 overflow-auto transition-all duration-300 pt-16 p-6",
        state === "expanded" ? "ml-60" : "ml-20",
        isMobile && "ml-0"
      )}
    >
      {children}
    </main>
  );
}