"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = validEmail && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      if (!validEmail) setError("Please enter a valid email address.");
      else if (password.length < 8) setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    setError("");

    const { error: signInError } = await authClient.signIn.email({ email, password });

    if (!signInError) {
      onLogin();
      return;
    }

    const errorCode = (signInError as { code?: string } | null)?.code;
    const errorMessage = signInError.message ?? "";
    const isEmailNotFound =
      errorCode === "EMAIL_NOT_FOUND" || errorCode === "email_not_found" || /email\s+not\s+found/i.test(errorMessage);

    if (!isEmailNotFound) {
      setError(signInError.message ?? "Invalid email or password.");
      setSubmitting(false);
      return;
    }

    const derivedName = email.split("@")[0] || "User";
    const { error: signUpError } = await authClient.signUp.email({
      name: derivedName,
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message ?? "Unable to create account.");
      setSubmitting(false);
      return;
    }

    onLogin();
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

      <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email
          </Label>
          <InputGroup className="h-[50px] rounded-[10px]">
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <Mail size={16} />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="you@example.com"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </InputGroup>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
            Password
          </Label>
          <InputGroup className="h-[50px] rounded-[10px]">
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <Lock size={16} />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="At least 6 characters"
              autoComplete="off"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" onClick={() => setShowPw((s) => !s)} tabIndex={-1}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        {error && (
          <div className="text-[13px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" disabled={!canSubmit || submitting} className="w-full mt-1.5">
          {submitting ? "Signing in…" : "Sign in"}
          {!submitting && <ArrowRight size={16} />}
        </Button>
      </form>
    </>
  );
}
