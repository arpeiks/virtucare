"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopbarProps {
  crumbs?: string[];
  onBack?: () => void;
  right?: React.ReactNode;
}

export function Topbar({ crumbs = [], onBack, right }: TopbarProps) {
  return (
    <div className="h-16 border-b border-border bg-background flex items-center px-10 gap-4.5 flex-shrink-0">
      {onBack && (
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
        {crumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <span 
              className={cn(
                index === crumbs.length - 1 
                  ? "text-foreground" 
                  : "text-muted-foreground"
              )}
            >
              {crumb}
            </span>
            {index < crumbs.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex-1" />
      
      {right}
    </div>
  );
}