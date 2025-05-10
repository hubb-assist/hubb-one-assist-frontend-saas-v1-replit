import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import AppShell from "./app-shell";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 md:p-6">
      {children}
    </div>
  );
}