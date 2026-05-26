"use client";
import Link from "next/link";
import { MapPin, UserPlus, Check } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import {
  MOTO_TYPE_LABEL,
  NIVEAU_LABEL,
  SORTIE_LABEL,
  type User,
} from "@/lib/types";
import { ageFromBirthdate, distanceKm } from "@/lib/utils";
import { useActions, useConnectionsLists } from "@/lib/data/api";

export function RiderCard({
  rider,
  origin,
  amisCommuns,
  compact,
}: {
  rider: User;
  origin?: { lat: number; lng: number };
  amisCommuns?: number;
  compact?: boolean;
}) {
  const dist = origin
    ? distanceKm(origin, { lat: rider.lat, lng: rider.lng }).toFixed(1)
    : null;
  const age = ageFromBirthdate(rider.date_naissance);
  const { sendConnection } = useActions();
  const { reseau, envoyees } = useConnectionsLists();
  const isConnected = reseau.some((u) => u.id === rider.id);
  const isPending = envoyees.some((c) => c.receveur_id === rider.id);

  if (compact) {
    return (
      <Link href={`/explorer/${rider.id}`}>
        <Card className="p-3 w-44 shrink-0">
          <Avatar src={rider.photo_url} name={rider.prenom} size="md" online={rider.is_online} />
          <div className="mt-3 text-label">
            {rider.prenom}, {age}
          </div>
          <div className="text-caption text-ink-muted">{rider.ville} · {dist} km</div>
          {amisCommuns ? (
            <div className="mt-2 text-caption text-accent-dark">
              ● {amisCommuns} ami{amisCommuns > 1 ? "s" : ""} en commun
            </div>
          ) : null}
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/explorer/${rider.id}`}>
      <Card className="p-4 flex gap-3 active:scale-[0.99] transition-transform">
        <Avatar src={rider.photo_url} name={rider.prenom} size="lg" online={rider.is_online} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-label text-ink">
                {rider.prenom}, {age}
                {rider.permis_verifie ? (
                  <span className="ml-1.5 text-success" title="Permis vérifié">●</span>
                ) : null}
              </div>
              <div className="text-caption text-ink-muted flex items-center gap-1">
                <MapPin size={12} /> {rider.ville}
                {dist ? ` · ${dist} km` : ""}
              </div>
            </div>
            {!isConnected && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!isPending) sendConnection(rider.id);
                }}
                className={`h-9 w-9 rounded-[10px] flex items-center justify-center shrink-0 transition-colors ${
                  isPending
                    ? "bg-accent-soft text-accent cursor-default"
                    : "bg-ink text-bg-primary active:opacity-80"
                }`}
                title={isPending ? "Demande envoyée" : "Envoyer une demande"}
              >
                {isPending ? <Check size={16} strokeWidth={2.4} /> : <UserPlus size={16} strokeWidth={1.8} />}
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Tag tone="accent">{NIVEAU_LABEL[rider.niveau]}</Tag>
            <Tag tone="neutral">{MOTO_TYPE_LABEL[rider.moto_type]}</Tag>
            {rider.types_sorties.slice(0, 1).map((s) => (
              <Tag key={s} tone="neutral">{SORTIE_LABEL[s]}</Tag>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
