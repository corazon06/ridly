"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/shell/BottomNav";
import { useMe } from "@/lib/data/api";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const me = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!me) router.replace("/");
  }, [me, router]);

  return (
    <>
      <div className="scroll-pad-bottom">{children}</div>
      <BottomNav />
    </>
  );
}
