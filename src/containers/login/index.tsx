"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./form";

export function LoginContainer() {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogin = (_user: { email: string; name: string; since: number }) => {
    router.push("/");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="min-h-screen w-full grid"
      style={{ gridTemplateColumns: "minmax(0, 480px) 1fr" }}
    >
      {/* Left: form */}
      <div className="flex flex-col px-14 py-10 min-h-screen bg-background">
        {/* Brand row */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-primary text-primary-foreground grid place-items-center font-serif text-xl leading-none">
            v
          </div>
          <div className="font-serif text-[22px] text-foreground leading-none">VirtuCare</div>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="border border-border"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>

        <div className="flex-1" />

        <div className="max-w-[380px]">
          <LoginForm onLogin={handleLogin} />
        </div>

        <div className="flex-1" />
      </div>

      {/* Right: brand panel */}
      <div className="relative bg-muted border-l border-border overflow-hidden flex-col p-14 hidden lg:flex">
        {/* Subtle grid */}
        <svg
          aria-hidden
          width="100%"
          height="100%"
          className="absolute inset-0 opacity-50 pointer-events-none"
        >
          <defs>
            <pattern id="lg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="var(--color-border)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lg-grid)" />
        </svg>

        <div className="relative flex-1 flex flex-col justify-center max-w-[520px]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs text-muted-foreground self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Telehealth appointments available today
          </div>

          <h2 className="font-serif font-normal text-[56px] leading-[1.02] tracking-[-0.8px] mt-5 mb-3.5 text-foreground">
            Care that fits
            <br />
            <em className="italic text-primary">around your day.</em>
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[440px]">
            Book video visits with board-certified physicians in minutes. No phone calls, no waiting
            rooms — just your care team, when you need them.
          </p>

          <div className="mt-9 grid grid-cols-3 gap-3.5">
            {[
              { k: "24/7", v: "Same-day booking" },
              { k: "120+", v: "Specialists" },
              { k: "4.9", v: "Avg. rating" },
            ].map((s) => (
              <div key={s.k} className="p-4 bg-card border border-border rounded-xl">
                <div className="font-serif text-[28px] text-foreground leading-none">{s.k}</div>
                <div className="text-xs text-subtle-foreground mt-1.5">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
