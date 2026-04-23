"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, router, session]);

  if (isPending || !session) return null;

  return (
    <main className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground font-sans text-sm">Virtucare</p>
    </main>
  );
}
