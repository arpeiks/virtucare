"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ternary } from "@/components/control/ternary";

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-[8px] bg-primary text-primary-foreground grid place-items-center font-serif text-xl leading-none">
        v
      </div>
      <div className="font-serif text-[22px] text-foreground leading-none">VirtuCare</div>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon-sm"
        className="border border-border"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <Ternary condition={isDark}>
          <Sun size={16} />
          <Moon size={16} />
        </Ternary>
      </Button>
    </div>
  );
};
