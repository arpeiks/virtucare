"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AppShell } from "@/components/layout";
import { AppointmentsPage } from "@/components/pages";

export default function Appointments() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, router, session]);

  if (isPending || !session) return null;

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  const user = {
    name: session.user.name || "Patient",
    email: session.user.email || "",
    since: 2024
  };

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <AppointmentsPage />
    </AppShell>
  );
}