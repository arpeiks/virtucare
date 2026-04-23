"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onLogin: (user: { email: string; name: string; since: number }) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = validEmail && password.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      if (!validEmail) setError("Please enter a valid email address.");
      else if (password.length < 6) setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    setError("");
    setTimeout(() => {
      const name =
        email
          .split("@")[0]
          .replace(/[._-]+/g, " ")
          .split(" ")
          .filter(Boolean)
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(" ") || "Patient";
      onLogin({ email, name, since: new Date().getFullYear() });
    }, 400);
  };

  return (
    <>
      <div className="text-xs tracking-[0.6px] uppercase text-subtle-foreground">Sign in</div>
      <h1 className="font-serif font-normal text-[44px] leading-[1.05] tracking-[-0.5px] mt-2.5 mb-2 text-foreground">
        Welcome back.
      </h1>
      <p className="text-sm text-muted-foreground mb-7 leading-[1.55]">
        Sign in to manage your appointments, message your care team, and review your visit history.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle-foreground pointer-events-none"
            />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className="pl-9 h-[50px] rounded-[10px] focus-visible:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle-foreground pointer-events-none"
            />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="At least 6 characters"
              autoComplete="current-password"
              className="pl-9 pr-10 h-[50px] rounded-[10px] focus-visible:border-primary"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPw((s) => !s)}
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-[13px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!canSubmit || submitting}
          className="w-full mt-1.5"
        >
          {submitting ? "Signing in…" : "Sign in"}
          {!submitting && <ArrowRight size={16} />}
        </Button>

      </form>
    </>
  );
}
