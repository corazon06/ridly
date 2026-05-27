"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/shell/BottomNav";
import { useMe } from "@/lib/data/api";
import { useMock } from "@/lib/mock/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const me = useMe();
  const hydrated = useMock((s) => s._hasHydrated);
  const router = useRouter();

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage before deciding to redirect.
    // Without this guard, meId starts as null (initial state) and the effect
    // fires immediately, kicking the user out on any direct URL navigation.
    if (!hydrated) return;
    if (!me) router.replace("/");
  }, [me, hydrated, router]);

  return (
    <>
      <div className="scroll-pad-bottom">{children}</div>
      <BottomNav />
    </>
  );
}
