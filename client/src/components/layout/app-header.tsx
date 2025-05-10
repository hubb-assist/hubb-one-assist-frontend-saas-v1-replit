import React from "react";
import {
  Bell,
  Menu,
  User,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  const { toggleSidebar, state, isMobile } = useSidebar();
  
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-20 border-b bg-secondary transition-all duration-300",
        state === "expanded" ? "left-60" : "left-20",
        isMobile && "left-0"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/90 hover:bg-white/10"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
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
          
          <div className="flex items-center space-x-1">
            <Avatar className="h-8 w-8 border-2 border-white/20">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback className="bg-primary-700 text-white">UA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}