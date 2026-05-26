"use client";
import Link from "next/link";
import { ChevronRight, MapPin, Star } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar } from "@/components/ui/Avatar";
import { type Ride, type User } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatWhen(ride: Ride): string {
  const d = new Date(`${ride.date_ride}T${ride.heure_depart}`);
  if (isToday(d)) return `Aujourd'hui · ${ride.heure_depart}`;
  if (isTomorrow(d)) return `Demain · ${ride.heure_depart}`;
  return `${format(d, "EEE d MMM", { locale: fr })} · ${ride.heure_depart}`;
}

function approximateKm(ride: Ride): number {
  // Mock-only heuristic so the cards display a realistic distance.
  // Map ride id → predefined km if we know it, else fall back to 80.
  const map: Record<string, number> = {
    r_col_rousset: 120,
    r_beaujolais: 75,
    r_tour_lyonnais: 95,
    r_chartreuse: 85,
  };
  return map[ride.id] ?? 80;
}

export function RideCard({
  ride,
  users,
  highlight,
  badge,
}: {
  ride: Ride;
  users: User[];
  highlight?: boolean;
  badge?: { label: string; tone: "accent" | "success" | "neutral" };
}) {
  const accepted = (ride.participants ?? []).filter(
    (p) => p.statut === "accepte" || p.statut === "present"
  );
  const participantUsers = accepted
    .map((p) => users.find((u) => u.id === p.user_id))
    .filter(Boolean) as User[];
  const visible = participantUsers.slice(0, 3);
  const overflow = Math.max(accepted.length - 3, 0);

  return (
    <Link href={`/rides/${ride.id}`} className="block">
      <div
        className={cn(
          "relative bg-white border rounded-card-xl px-4 py-3.5",
          highlight
            ? "border-[1.5px] border-accent shadow-accent"
            : "border-line"
        )}
      >
        {highlight ? (
          <span
            className="absolute top-3.5 left-0 h-7 w-[3px] rounded-r"
            style={{ background: "var(--accent)" }}
          />
        ) : null}

        <div className="flex items-start justify-between gap-2.5">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent font-bold mb-1">
              {formatWhen(ride)}
            </p>
            <h3 className="font-display font-bold text-[17px] leading-tight tracking-[-0.01em]">
              {ride.titre ?? "Ride"}
            </h3>
            <p className="text-[12px] text-ink-muted mt-0.5 flex items-center gap-1">
              <MapPin size={11} strokeWidth={1.9} />
              {ride.point_depart} · {approximateKm(ride)} km
            </p>
          </div>
          {badge ? <RideBadge tone={badge.tone}>{badge.label}</RideBadge> : null}
        </div>

        <div className="mt-3 pt-3 border-t border-bg-secondary flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            {visible.map((u) => (
              <Avatar key={u.id} src={u.photo_url} name={u.prenom} size="sm" ring />
            ))}
            {overflow > 0 ? (
              <div className="h-9 w-9 rounded-full bg-bg-tertiary text-ink ring-2 ring-white flex items-center justify-center font-display font-bold text-[10px]">
                +{overflow}
              </div>
            ) : null}
          </div>
          <p className="text-[11px] text-ink-muted">
            <b className="text-ink font-bold">
              {accepted.length} / {ride.nb_places_max}
            </b>{" "}
            participants
          </p>
          <ChevronRight size={14} strokeWidth={2} className="text-ink" />
        </div>
      </div>
    </Link>
  );
}

function RideBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "accent" | "success" | "neutral";
}) {
  const cls =
    tone === "accent"
      ? "bg-accent text-bg-primary"
      : tone === "success"
      ? "bg-[rgba(94,124,90,0.15)] text-[#3F5E48]"
      : "bg-bg-secondary text-ink-muted";
  return (
    <span
      className={`font-display font-bold text-[10px] px-2.5 py-1.5 rounded-chip whitespace-nowrap inline-flex items-center gap-1 ${cls}`}
    >
      {tone === "accent" ? <Star size={9} strokeWidth={3} /> : null}
      {children}
    </span>
  );
}

export function RideCardCompact({ ride }: { ride: Ride }) {
  return (
    <Link href={`/rides/${ride.id}`} className="block">
      <div className="bg-white border border-line rounded-card p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted font-bold">
          {formatWhen(ride)}
        </p>
        <h3 className="font-display font-bold text-[14px] mt-1">
          {ride.titre ?? ride.point_depart}
        </h3>
      </div>
    </Link>
  );
}
