"use client";

import {
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import Link from "next/link";
import { toast } from "sonner";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Hidden from "@/components/control/hidden";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ternary } from "@/components/control/ternary";
import { signupSchema, type SignupSchema } from "@/lib/schemas/auth";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

export const Form = () => {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);

  const form = useForm<SignupSchema>({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    const { name, email, password } = data;

    const onSuccess = () => router.push("/");

    const signUp = await authClient.signUp.email({ name, email, password });

    if (signUp.error) {
      const message = signUp.error.message ?? "Unable to create account.";
      form.setError("root", { message });
      toast.error(message);
      return;
    }

    const signIn = await authClient.signIn.email({ email, password });

    if (signIn.error) {
      const message = signIn.error.message ?? "Unable to sign in.";
      form.setError("root", { message });
      toast.error(message);
      return;
    }

    toast.success("Account created and signed in.");
    onSuccess();
  };

  return (
    <Fragment>
      <div className="text-xs tracking-[0.6px] uppercase text-subtle-foreground">
        Sign up
      </div>
      <h1 className="font-serif font-normal text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.5px] mt-2.5 mb-2 text-foreground">
        Create account.
      </h1>
      <p className="text-sm text-muted-foreground mb-7 leading-[1.55]">
        Sign up to book appointments, message your care team, and manage your
        health — all in one place.
      </p>

      <form
        autoComplete="off"
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="name"
            className="text-xs font-medium text-muted-foreground"
          >
            Full name
          </Label>
          <InputGroup className="h-[50px] rounded-[10px]">
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <User size={16} />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="name"
              type="text"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="words"
              placeholder="Jane Smith"
              {...form.register("name")}
            />
          </InputGroup>
          <Hidden display={!!form.formState.errors.name}>
            <p className="text-[12px] text-destructive">
              {form.formState.errors.name?.message}
            </p>
          </Hidden>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="email"
            className="text-xs font-medium text-muted-foreground"
          >
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
              autoCorrect="off"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="none"
              placeholder="you@example.com"
              {...form.register("email")}
            />
          </InputGroup>
          <Hidden display={!!form.formState.errors.email}>
            <p className="text-[12px] text-destructive">
              {form.formState.errors.email?.message}
            </p>
          </Hidden>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-muted-foreground"
          >
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
              autoComplete="off"
              {...form.register("password")}
              type={showPw ? "text" : "password"}
              placeholder="At least 8 characters"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                tabIndex={-1}
                size="icon-sm"
                onClick={() => setShowPw((s) => !s)}
              >
                <Ternary condition={showPw}>
                  <EyeOff size={16} />
                  <Eye size={16} />
                </Ternary>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <Hidden display={!!form.formState.errors.password}>
            <p className="text-[12px] text-destructive">
              {form.formState.errors.password?.message}
            </p>
          </Hidden>
        </div>

        <Hidden display={!!form.formState.errors.root}>
          <div className="text-[13px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {form.formState.errors.root?.message}
          </div>
        </Hidden>

        <Button
          size="lg"
          type="submit"
          variant="primary"
          className="w-full mt-1.5"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <Ternary condition={form.formState.isSubmitting}>
            <span>Creating account…</span>
            <span>Create account</span>
          </Ternary>
          <Hidden display={!form.formState.isSubmitting}>
            <ArrowRight size={16} />
          </Hidden>
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-1">
          Already have an account?{" "}
          <Link
            href="/auth/auth/login"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Fragment>
  );
};
