"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { TopBar } from "@/components/ui/TopBar";
import { useActions, useConnectionsLists } from "@/lib/data/api";
import { useMock } from "@/lib/mock/store";

type Tab = "reseau" | "recues" | "envoyees";

function MyRidersInner() {
  const { reseau, recues, envoyees } = useConnectionsLists();
  const users = useMock((s) => s.users);
  const { acceptConnection } = useActions();
  const search = useSearchParams();
  const [tab, setTab] = useState<Tab>("reseau");

  // Deep link: /profile/riders?tab=envoyees|recues|reseau
  useEffect(() => {
    const t = search.get("tab");
    if (t === "envoyees" || t === "recues" || t === "reseau") setTab(t);
  }, [search]);

  return (
    <main className="min-h-[100dvh]">
      <TopBar title="Mes Motards" />

      {/* Tabs (mockup-aligned, same as /rides) */}
      <div className="mx-[22px] mt-2 p-1 bg-bg-secondary rounded-[14px] flex gap-1">
        <Tb
          active={tab === "reseau"}
          onClick={() => setTab("reseau")}
          label="Réseau"
          count={reseau.length}
        />
        <Tb
          active={tab === "recues"}
          onClick={() => setTab("recues")}
          label="Reçues"
          count={recues.length}
        />
        <Tb
          active={tab === "envoyees"}
          onClick={() => setTab("envoyees")}
          label="Envoyées"
          count={envoyees.length}
        />
      </div>

      <div className="mt-4 px-[22px] pb-32 space-y-2">
        {tab === "reseau" &&
          reseau.map((u) => (
            <Link key={u.id} href={`/explorer/${u.id}`} className="block">
              <div className="bg-white border border-line rounded-card p-3 flex items-center gap-3">
                <Avatar src={u.photo_url} name={u.prenom} size="md" online={u.is_online} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-[14px]">{u.prenom}</p>
                  <p className="text-[12px] text-ink-muted">{u.ville}</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Connecté
                </span>
              </div>
            </Link>
          ))}

        {tab === "recues" &&
          recues.map((c) => {
            const u = users.find((x) => x.id === c.demandeur_id);
            if (!u) return null;
            return (
              <div
                key={c.id}
                className="bg-white border border-line rounded-card p-3 flex items-center gap-3"
              >
                <Avatar src={u.photo_url} name={u.prenom} size="md" online={u.is_online} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-[14px]">{u.prenom}</p>
                  <p className="text-[12px] text-ink-muted">souhaite te connecter</p>
                </div>
                <Button size="sm" onClick={() => acceptConnection(c.id)}>
                  <Check size={14} strokeWidth={2.4} /> Accepter
                </Button>
              </div>
            );
          })}

        {tab === "envoyees" &&
          envoyees.map((c) => {
            const u = users.find((x) => x.id === c.receveur_id);
            if (!u) return null;
            return (
              <div
                key={c.id}
                className="bg-white border border-line rounded-card p-3 flex items-center gap-3"
              >
                <Avatar src={u.photo_url} name={u.prenom} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-[14px]">{u.prenom}</p>
                  <p className="text-[12px] text-ink-muted">en attente de réponse</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-accent bg-accent-soft px-2 py-1 rounded-md">
                  Envoyée
                </span>
              </div>
            );
          })}

        {(tab === "reseau" && reseau.length === 0) ||
        (tab === "recues" && recues.length === 0) ||
        (tab === "envoyees" && envoyees.length === 0) ? (
          <p className="py-12 text-center text-[13px] text-ink-muted">
            Rien ici pour l&apos;instant.
          </p>
        ) : null}
      </div>
    </main>
  );
}

function Tb({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-9 rounded-[10px] font-display font-bold text-[12px] flex items-center justify-center gap-1.5 ${
        active ? "bg-white text-ink shadow-card" : "text-ink-muted"
      }`}
    >
      {label}
      <span
        className={`font-mono text-[10px] px-1.5 py-px rounded-full font-semibold ${
          active ? "bg-accent-soft text-accent" : "bg-[rgba(138,127,111,0.18)] text-ink-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export default function MyRidersPage() {
  // Suspense boundary required by Next 14 for `useSearchParams` in client pages.
  return (
    <Suspense fallback={null}>
      <MyRidersInner />
    </Suspense>
  );
}
