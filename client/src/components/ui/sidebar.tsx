"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Criando um contexto para o estado da sidebar
type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined);

// Hook para acessar o contexto da Sidebar
const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de um SidebarProvider");
  }
  return context;
}

export { useSidebar };

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultState?: "expanded" | "collapsed";
}

export function SidebarProvider({
  children,
  defaultState = "expanded",
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultState === "expanded");
  const [openMobile, setOpenMobile] = React.useState(false);
  
  const isMobile = useIsMobile();
  const state = open ? "expanded" : "collapsed";

  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  // Fechando a sidebar mobile ao pressionar Escape
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMobile(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpenMobile]);

  // Função para alternar o estado da sidebar
  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen(!open);
    }
  }, [isMobile, open, openMobile, setOpen, setOpenMobile]);

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// Componente principal da Sidebar
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { state, open, openMobile, isMobile } = useSidebar();

  // Lógica para mostrar sidebar baseada no estado
  const showSidebar = isMobile ? openMobile : true;
  
  // Se estiver no mobile e a sidebar não estiver aberta, não renderiza nada
  if (isMobile && !openMobile) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-primary transition-all duration-300",
        state === "expanded" ? "w-60" : "w-20",
        isMobile && "w-60",
        className
      )}
      {...props}
    />
  );
}

// Logo da Sidebar
interface SidebarLogoProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarLogo({ className, ...props }: SidebarLogoProps) {
  const { state, isMobile } = useSidebar();
  const isExpanded = state === "expanded" || isMobile;

  return (
    <div
      className={cn(
        "flex h-16 items-center border-b border-border/50 px-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-full">
        {isExpanded ? (
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNjAiIGZpbGw9Im5vbmUiPgogIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMkQxMTNGIi8+CiAgPHBhdGggZD0iTTQyIDE1SDMwVjQ1SDQyVjE1WiIgZmlsbD0id2hpdGUiLz4KICA8cGF0aCBkPSJNNjAgMTVINDhWMzBINjBWMTVaIiBmaWxsPSJ3aGl0ZSIvPgogIDxwYXRoIGQ9Ik02MCAzMEg0OFY0NUg2MFYzMFoiIGZpbGw9IndoaXRlIi8+CiAgPHBhdGggZD0iTTc4IDE1SDY2VjQ1SDc4VjE1WiIgZmlsbD0id2hpdGUiLz4KICA8cGF0aCBkPSJNOTYgMTVIODRWNDVIOTZWMTVaIiBmaWxsPSJ3aGl0ZSIvPgogIDxwYXRoIGQ9Ik0xMTQgMTVIMTAyVjMwSDExNFYxNVoiIGZpbGw9IndoaXRlIi8+CiAgPHBhdGggZD0iTTEzMiAzMEgxMDJWNDVIMTE0VjM3LjVIMTMyVjMwWiIgZmlsbD0id2hpdGUiLz4KICA8cGF0aCBkPSJNMTQ3IDE1SDEzNVY0NUgxNDdWMTVaIiBmaWxsPSJ3aGl0ZSIvPgogIDxwYXRoIGQ9Ik0xNjUgMTVIMTUzVjMwSDE2NVYxNVoiIGZpbGw9IndoaXRlIi8+CiAgPHBhdGggZD0iTTE2NSAzMEgxNTNWNDVIMTY1VjMwWiIgZmlsbD0id2hpdGUiLz4KICA8cGF0aCBkPSJNMTcwIDE1VjQ1SDE4MlYxNUgxNzBaIiBmaWxsPSIjQzUyMzM5Ii8+Cjwvc3ZnPg=="
            alt="HUBB Assist Logo"
            className="h-8"
          />
        ) : (
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSI+CiAgPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iMzAiIGZpbGw9IiMyRDExM0YiLz4KICA8cGF0aCBkPSJNMzAgMjBDMjUuNiAyMCAyMiAyMy42IDIyIDI4VjM2QzIyIDQwLjQgMjUuNiA0NCAzMCA0NEMzNC40IDQ0IDM4IDQwLjQgMzggMzZWMjhDMzggMjMuNiAzNC40IDIwIDMwIDIwWiIgZmlsbD0id2hpdGUiLz4KICA8cGF0aCBkPSJNMzAgMjZDMjguOSAyNiAyOCAyNi45IDI4IDI4VjMyQzI4IDMzLjEgMjguOSAzNCAzMCAzNEMzMS4xIDM0IDMyIDMzLjEgMzIgMzJWMjhDMzIgMjYuOSAzMS4xIDI2IDMwIDI2WiIgZmlsbD0iI0M1MjMzOSIvPgogIDxwYXRoIGQ9Ik0zNiAxMkwzMCAyMEgzOEwzNiAxMloiIGZpbGw9IndoaXRlIi8+CiAgPHBhdGggZD0iTTI0IDEyTDMwIDIwSDIyTDI0IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+"
            alt="HUBB Icon"
            className="h-8 w-auto"
          />
        )}
      </div>
    </div>
  );
}

// Conteúdo principal da Sidebar
interface SidebarMainProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMain({ className, ...props }: SidebarMainProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-y-2 overflow-auto p-4",
        className
      )}
      {...props}
    />
  );
}

// Rodapé da Sidebar
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-x-4 border-t border-border/50 p-4",
        className
      )}
      {...props}
    />
  );
}

// Toggle para expandir/colapsar a Sidebar
interface SidebarToggleProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function SidebarToggle({ className, ...props }: SidebarToggleProps) {
  const { toggleSidebar, state, isMobile } = useSidebar();

  // Se estivermos no mobile, não mostramos o botão de toggle
  if (isMobile) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute -right-4 top-16 h-8 w-8 rounded-full border shadow-sm",
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      {state === "expanded" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
      <span className="sr-only">
        {state === "expanded" ? "Colapsar menu" : "Expandir menu"}
      </span>
    </Button>
  );
}

// Item de navegação na Sidebar
interface SidebarNavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  label: string;
  isChild?: boolean;
  external?: boolean;
}

export function SidebarNavItem({
  className,
  children,
  icon,
  href,
  active,
  label,
  isChild = false,
  external = false,
  ...props
}: SidebarNavItemProps) {
  const { state, isMobile } = useSidebar();
  const isExpanded = state === "expanded" || isMobile;

  const link = (
    <a
      href={href}
      className={cn(
        "flex items-center gap-x-2 rounded-md px-3 py-2 text-base text-white/70 transition-all hover:bg-white/10 hover:text-white",
        active && "bg-white/10 text-white font-medium",
        isChild && "pl-10 text-sm",
        className
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      {...props}
    >
      {icon}
      {(isExpanded) && <span>{label}</span>}
    </a>
  );

  if (!isExpanded) {
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
}

// Separador de itens da Sidebar
export function SidebarDivider() {
  return <div className="my-2 h-px bg-white/10" />;
}

// Rótulo de seção na Sidebar
interface SidebarLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function SidebarLabel({ className, ...props }: SidebarLabelProps) {
  const { state, isMobile } = useSidebar();
  const isExpanded = state === "expanded" || isMobile;

  if (!isExpanded) {
    return null;
  }

  return (
    <p
      className={cn(
        "mb-2 px-3 text-xs font-medium uppercase tracking-wider text-white/50",
        className
      )}
      {...props}
    />
  );
}