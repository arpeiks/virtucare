"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AppShell } from "@/components/layout";
import { BookingPage } from "@/components/pages/booking";

export default function BookingPageRoute() {
  return (
    <Suspense>
      <BookingPageContent />
    </Suspense>
  );
}

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  const doctorId = searchParams.get("doctorId") ?? "1";
  const editingId = searchParams.get("editingId") ?? undefined;
  const initialDate = searchParams.get("date") ?? undefined;
  const initialTime = searchParams.get("time") ?? undefined;

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/login");
    }
  }, [isPending, router, session]);

  if (isPending || !session) return null;

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/auth/login");
  };

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    router.push("/appointments");
  };

  const user = {
    name: session.user.name || "Patient",
    email: session.user.email || "",
    since: 2024,
  };

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <BookingPage
        doctorId={doctorId}
        editingId={editingId}
        initialDate={initialDate}
        initialTime={initialTime}
        onBack={handleBack}
        onConfirm={handleConfirm}
      />
    </AppShell>
  );
}
