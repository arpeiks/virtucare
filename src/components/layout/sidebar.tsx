"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Stethoscope, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  appointmentCount?: number;
  user?: { name?: string; email?: string; since?: number };
  onLogout?: () => void;
}

const primaryItems = [
  { id: 'doctors', label: 'Find a doctor', icon: Stethoscope, href: '/' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments' },
];

const secondaryItems = [
  { id: 'messages', label: 'Messages', icon: MessageSquare, disabled: true },
  { id: 'records', label: 'Records', icon: FileText, disabled: true },
  { id: 'settings', label: 'Settings', icon: Settings, disabled: true },
];

export function Sidebar({ appointmentCount = 0, user, onLogout }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const NavItem = ({ item, active }: { item: any; active: boolean }) => {
    const Icon = item.icon;
    
    return (
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 h-11 px-3.5",
          item.disabled && "opacity-50 cursor-not-allowed",
          active && "bg-card border-ring"
        )}
        onClick={() => !item.disabled && item.href && router.push(item.href)}
        disabled={item.disabled}
      >
        <Icon className="h-[18px] w-[18px]" />
        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
        {item.id === 'appointments' && appointmentCount > 0 && (
          <Badge variant="default" className="h-5 min-w-5 text-xs px-1.5">
            {appointmentCount}
          </Badge>
        )}
      </Button>
    );
  };

  return (
    <aside className="w-[260px] bg-background border-r border-border p-[18px] flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-1.5 pb-5.5">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-serif text-xl leading-none">
          v
        </div>
        <div>
          <div className="font-serif text-xl text-foreground leading-none">VirtuCare</div>
          <div className="font-sans text-[11px] text-muted-foreground mt-0.5 tracking-wider uppercase">
            Patient
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex flex-col gap-1">
        {primaryItems.map(item => (
          <NavItem key={item.id} item={item} active={isActive(item.href)} />
        ))}
      </div>

      {/* More Section */}
      <div className="mx-2.5 my-6">
        <div className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
          More
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {secondaryItems.map(item => (
          <NavItem key={item.id} item={item} active={false} />
        ))}
      </div>

      <div className="flex-1" />

      {/* User Profile */}
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
        <Avatar className="h-9 w-9">
          <AvatarImage src="" />
          <AvatarFallback className="text-sm font-medium">
            {user?.name?.charAt(0) || 'P'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-foreground truncate">
            {user?.name || 'Patient'}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {user?.email || `Member since ${user?.since || 2024}`}
          </div>
        </div>
        {onLogout && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onLogout}
            title="Sign out"
          >
            <LogOut className="h-[15px] w-[15px]" />
          </Button>
        )}
      </div>
    </aside>
  );
}