"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, MessageCircle, Plus, Route, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/explorer", icon: Compass, label: "Explorer" },
  { href: "/rides", icon: Route, label: "Rides" },
  { href: "/create", icon: Plus, label: "Créer", center: true },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/profile", icon: User, label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Cream fade behind the nav so feed content doesn't sit under the glass */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 h-28 mx-auto pointer-events-none"
        style={{
          maxWidth: 440,
          background:
            "linear-gradient(180deg, rgba(251,246,238,0) 0%, rgba(251,246,238,1) 70%)",
        }}
      />
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 mx-auto"
        style={{ maxWidth: 440 }}
      >
        <div className="mx-4 mb-4 h-16 rounded-[32px] glass-pill flex items-center justify-around px-3">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = pathname?.startsWith(t.href);
            if (t.center) {
              return (
                <button
                  key={t.href}
                  onClick={() => router.push(t.href)}
                  aria-label={t.label}
                  className="h-[50px] w-[50px] rounded-full flex items-center justify-center text-bg-primary"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--accent) 0%, var(--accent-dark) 100%)",
                    boxShadow: "0 6px 14px -4px rgba(178,82,52,0.5)",
                  }}
                >
                  <Icon size={22} strokeWidth={2.3} />
                </button>
              );
            }
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-label={t.label}
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center transition-opacity",
                  active ? "opacity-100 text-accent" : "opacity-[0.42] text-ink"
                )}
              >
                <Icon size={20} strokeWidth={1.9} />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
