"use client";

import {
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Hidden from "@/components/control/hidden";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth";
import { useState } from "react";

interface FormProps {
  onLogin: () => void;
}

export const Form = ({ onLogin }: FormProps) => {
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginSchema) => {
    const { email, password } = data;

    const { error: signInError } = await authClient.signIn.email({ email, password });

    if (!signInError) {
      toast.success("Signed in successfully.");
      onLogin();
      return;
    }

    const derivedName = email.split("@")[0] || "User";
    const { error: signUpError } = await authClient.signUp.email({
      name: derivedName,
      email,
      password,
    });

    if (signUpError) {
      const signUpCode = (signUpError as { code?: string } | null)?.code;
      const signUpMessage = signUpError.message ?? "";
      const isAlreadyExists =
        signUpCode === "EMAIL_ALREADY_EXISTS" ||
        signUpCode === "email_already_exists" ||
        /already\s+exists/i.test(signUpMessage);

      const message = isAlreadyExists
        ? (signInError.message ?? "Invalid email or password.")
        : (signUpError.message ?? "Unable to create account.");

      setError("root", { message });
      toast.error(message);
      return;
    }

    const { error: signInAfterSignUpError } = await authClient.signIn.email({ email, password });

    if (signInAfterSignUpError) {
      const message = signInAfterSignUpError.message ?? "Unable to sign in.";
      setError("root", { message });
      toast.error(message);
      return;
    }

    toast.success("Account created and signed in.");
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

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col gap-3">
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
              placeholder="you@example.com"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              {...register("email")}
            />
          </InputGroup>
          <Hidden display={!!errors.email}>
            <p className="text-[12px] text-destructive">{errors.email?.message}</p>
          </Hidden>
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
              placeholder="At least 8 characters"
              autoComplete="off"
              {...register("password")}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" onClick={() => setShowPw((s) => !s)} tabIndex={-1}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <Hidden display={!!errors.password}>
            <p className="text-[12px] text-destructive">{errors.password?.message}</p>
          </Hidden>
        </div>

        <Hidden display={!!errors.root}>
          <div className="text-[13px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {errors.root?.message}
          </div>
        </Hidden>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isValid || isSubmitting}
          className="w-full mt-1.5"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
          <Hidden display={!isSubmitting}>
            <ArrowRight size={16} />
          </Hidden>
        </Button>
      </form>
    </>
  );
};
