import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-20 h-screen bg-primary text-primary-foreground transition-all duration-300",
          expanded ? "w-60" : "w-20",
          isMobile && !mobileSidebarOpen && "-left-20"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-primary-foreground/10">
          {expanded ? (
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
        <div className="p-4">
          {children}
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
          </Button>
        )}
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen bg-background",
          expanded ? "ml-60" : "ml-20",
          isMobile && "ml-0"
        )}
      >
        {/* Main Content goes here */}
      </main>
    </div>
  );
}