"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AppShell } from "@/components/layout";
import { DoctorDetailPage } from "@/components/pages";

export default function DoctorDetailRoute() {
  const router = useRouter();
  const params = useParams();
  const { data: session, isPending } = authClient.useSession();

  const doctorId = params.id as string;

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
    since: 2024,
  };

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <DoctorDetailPage doctorId={doctorId} />
    </AppShell>
  );
}
