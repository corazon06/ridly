"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Search, Star, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { RideCard } from "@/components/ride/RideCard";
import {
  useActions,
  useLifetimeStats,
  useMe,
  useMyRides,
  usePastRidesWithReports,
} from "@/lib/data/api";
import { useMock } from "@/lib/mock/store";
import type { Ride, RideReport, User } from "@/lib/types";

type Tab = "a-venir" | "en-attente" | "passe";

export default function RidesPage() {
  const me = useMe();
  const users = useMock((s) => s.users);
  const my = useMyRides();
  const past = usePastRidesWithReports();
  const stats = useLifetimeStats();
  const [tab, setTab] = useState<Tab>("a-venir");

  return (
    <main className="min-h-[100dvh]">
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center justify-between">
        <h1 className="text-h1">Mes rides</h1>
        <button className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink">
          <Search size={16} strokeWidth={1.8} />
        </button>
      </div>

      {/* Tabs (Batch 4 mockup) */}
      <div className="mx-[22px] mt-3 p-1 bg-bg-secondary rounded-[14px] flex gap-1">
        <Tab
          active={tab === "a-venir"}
          onClick={() => setTab("a-venir")}
          label="À venir"
          count={my.aVenir.length}
        />
        <Tab
          active={tab === "en-attente"}
          onClick={() => setTab("en-attente")}
          label="En attente"
          count={my.enAttente.length}
        />
        <Tab
          active={tab === "passe"}
          onClick={() => setTab("passe")}
          label="Passés"
          count={past.length}
        />
      </div>

      {tab === "a-venir" ? (
        <UpcomingFeed rides={my.aVenir} meId={me?.id} users={users} />
      ) : tab === "en-attente" ? (
        <PendingFeed rides={my.enAttente} users={users} />
      ) : (
        <PastFeed past={past} stats={stats} />
      )}
    </main>
  );
}

function Tab({
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
        active
          ? "bg-white text-ink shadow-card"
          : "text-ink-muted"
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

function UpcomingFeed({
  rides,
  meId,
  users,
}: {
  rides: Ride[];
  meId?: string;
  users: User[];
}) {
  if (rides.length === 0) {
    return (
      <div className="px-6 mt-12 text-center text-[13px] text-ink-muted">
        Aucun ride à venir. Crée-en un pour démarrer.
      </div>
    );
  }
  return (
    <section className="px-[22px] pt-3.5 pb-32 space-y-3">
      {rides.map((r, i) => {
        const isOrganizer = meId === r.createur_id;
        const featured = i === 0; // First upcoming = "Demain" highlight
        return (
          <RideCard
            key={r.id}
            ride={r}
            users={users}
            highlight={featured}
            badge={
              isOrganizer
                ? { label: "Tu organises", tone: "accent" }
                : { label: "Confirmé", tone: "success" }
            }
          />
        );
      })}
    </section>
  );
}

function PendingFeed({
  rides,
  users,
}: {
  rides: Ride[];
  users: User[];
}) {
  if (rides.length === 0) {
    return (
      <div className="px-6 mt-12 text-center text-[13px] text-ink-muted">
        Aucune demande en attente.
      </div>
    );
  }
  return (
    <section className="px-[22px] pt-3.5 pb-32 space-y-3">
      {rides.map((r) => (
        <RideCard
          key={r.id}
          ride={r}
          users={users}
          badge={{ label: "En attente", tone: "neutral" }}
        />
      ))}
    </section>
  );
}

function PastFeed({
  past,
  stats,
}: {
  past: { ride: Ride; report: RideReport | undefined }[];
  stats: { rides: number; km: number; riders: number };
}) {
  if (past.length === 0) {
    return (
      <div className="px-6 mt-12 text-center text-[13px] text-ink-muted">
        Pas encore de rides passés.
      </div>
    );
  }

  // Group by month
  const groups = new Map<string, typeof past>();
  past.forEach((p) => {
    const key = format(new Date(p.ride.date_ride), "MMMM yyyy", { locale: fr });
    const arr = groups.get(key) ?? [];
    arr.push(p);
    groups.set(key, arr);
  });

  const groupArr = Array.from(groups.entries());
  const today = new Date();
  const thisMonthLabel = format(today, "MMMM yyyy", { locale: fr });

  return (
    <section className="px-[22px] pt-3.5 pb-32">
      {groupArr.map(([month, items]) => {
        const totalKm = items.reduce((acc, x) => acc + (x.report?.km ?? 0), 0);
        const isThisMonth = month === thisMonthLabel;
        return (
          <div key={month} className="mt-1.5 first:mt-0">
            <div className="flex items-baseline justify-between mb-2.5 mt-4">
              <h3 className="font-display font-bold text-[14px] capitalize">
                {isThisMonth ? "Ce mois-ci" : month}
              </h3>
              <div className="font-mono text-[10px] tracking-wide text-ink-muted">
                <b className="text-accent font-bold">{items.length} ride{items.length > 1 ? "s" : ""}</b>
                {" · "}
                {totalKm} km
              </div>
            </div>
            <div className="space-y-2">
              {items.map(({ ride, report }) => (
                <PastCard key={ride.id} ride={ride} report={report} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Lifetime totals card */}
      <div className="mt-5 p-4 rounded-card-lg bg-ink text-bg-primary flex items-center gap-3.5">
        <span className="h-11 w-11 rounded-[12px] bg-white/10 flex items-center justify-center shrink-0">
          <Star size={20} strokeWidth={1.8} />
        </span>
        <div>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-bg-primary/60 mb-1">
            Total depuis ton inscription
          </p>
          <p className="font-display font-bold text-[15px] leading-snug tracking-tight">
            <em className="not-italic text-accent">{stats.rides} ride{stats.rides > 1 ? "s" : ""}</em>{" "}
            · {stats.km.toLocaleString("fr-FR")} km · {stats.riders} motard(e)s rencontrés
          </p>
        </div>
      </div>
    </section>
  );
}

function PastCard({
  ride,
  report,
}: {
  ride: Ride;
  report: RideReport | undefined;
}) {
  const { hideRideFromHistory } = useActions();
  const [pending, setPending] = useState(false);
  const [fading, setFading] = useState(false);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const d = new Date(ride.date_ride);
  const when = format(d, "EEE d MMM", { locale: fr });
  const present = (ride.participants ?? []).filter((p) => p.statut === "present").length;
  const km = report?.km ?? 0;
  const rated = report?.rated ?? false;

  function startDelete() {
    setPending(true);
    deleteTimer.current = setTimeout(() => {
      setFading(true);
      fadeTimer.current = setTimeout(() => {
        hideRideFromHistory(ride.id);
      }, 2500);
    }, 10000);
  }

  function cancel() {
    if (deleteTimer.current) clearTimeout(deleteTimer.current);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    setPending(false);
    setFading(false);
  }

  useEffect(() => () => {
    if (deleteTimer.current) clearTimeout(deleteTimer.current);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, []);

  return (
    <div
      style={{
        opacity: fading ? 0 : pending ? 0.45 : 1,
        transition: fading ? "opacity 2.5s ease" : "opacity 0.3s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <Link
        href={`/rides/${ride.id}`}
        className="block bg-white border border-line rounded-card p-3 flex gap-3 items-center"
      >
        {/* Mini map thumb */}
        <div
          className="h-14 w-14 rounded-[12px] shrink-0 relative overflow-hidden"
          style={{ background: "linear-gradient(180deg, #E8DFCB 0%, #E0D6BE 100%)" }}
        >
          <svg viewBox="0 0 60 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M -5 35 Q 15 50 30 30 T 65 25" stroke="#FBF8F0" strokeWidth="3" fill="none" />
            <path d="M -5 35 Q 15 50 30 30 T 65 25" stroke="#B25234" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
          </svg>
          <span className="absolute left-[30%] top-[55%] h-2.5 w-2.5 rounded-full bg-accent border-[1.5px] border-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-muted font-semibold capitalize">
            {when}
          </p>
          <h4 className="font-display font-bold text-[14px] tracking-[-0.01em] mt-px">
            {ride.titre ?? "Ride"}
          </h4>
          <p className="text-[11px] text-ink-muted mt-px">
            {present} motard(e)s · {km} km
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {pending ? (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); cancel(); }}
              className="relative h-[30px] px-2.5 rounded-[8px] overflow-hidden text-bg-primary text-[11px] font-bold whitespace-nowrap"
              style={{ background: "#E8E4DC", color: "#2A2624" }}
            >
              <span
                key="drain-annuler"
                className="absolute inset-0 bg-ink rounded-[8px]"
                style={{ animation: "drain-rtl 10s linear forwards", transformOrigin: "left center" }}
              />
              <span className="relative z-10 text-bg-primary">Annuler</span>
            </button>
          ) : rated ? (
            <span className="font-display font-bold text-[10px] bg-bg-secondary text-ink-muted px-2.5 py-1.5 rounded-chip whitespace-nowrap inline-flex items-center gap-1">
              <Check size={9} strokeWidth={3} /> Noté
            </span>
          ) : (
            <span className="font-display font-bold text-[10px] bg-accent text-bg-primary px-2.5 py-1.5 rounded-chip whitespace-nowrap">
              À noter
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (pending) cancel(); else startDelete(); }}
            className="h-[30px] w-[30px] rounded-[8px] bg-accent text-bg-primary flex items-center justify-center active:opacity-80 transition-opacity"
            title={pending ? "Annuler la suppression" : "Supprimer de l'historique"}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
          <style>{`
            @keyframes drain-rtl {
              from { transform: scaleX(1); }
              to   { transform: scaleX(0); }
            }
          `}</style>
        </div>
      </Link>
    </div>
  );
}
