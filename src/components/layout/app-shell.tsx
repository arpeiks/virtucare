"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
  user?: { name?: string; email?: string; since?: number };
  onLogout?: () => void;
}

export function AppShell({ children, user, onLogout }: AppShellProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [appointmentCount] = useState(0); // This would come from your appointment data

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = () => {
    if (pathname === '/') return ['Find a doctor'];
    if (pathname === '/appointments') return ['Appointments'];
    // Add more path handling as needed
    return ['VirtuCare'];
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const rightContent = (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="h-9 w-9"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        appointmentCount={appointmentCount}
        user={user}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          crumbs={getBreadcrumbs()}
          right={rightContent}
        />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}