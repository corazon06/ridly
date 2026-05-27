"use client";
import Link from "next/link";
import { Check, MapPin, Navigation, UserCheck, UserPlus, X } from "lucide-react";
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
  const { sendConnection, cancelConnection, refuseConnection } = useActions();
  const { reseau, envoyees, recues } = useConnectionsLists();
  const isConnected = reseau.some((u) => u.id === rider.id);
  const isPending = envoyees.some((c) => c.receveur_id === rider.id);
  const isRecue = recues.some((c) => c.demandeur_id === rider.id);

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
    <Link href={`/explorer/${rider.id}`} className="block">
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
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[10px] bg-success/10 text-success text-[12px] font-bold shrink-0">
                <UserCheck size={12} strokeWidth={2.5} /> Ajouté
              </span>
            ) : isPending ? (
              <div className="inline-flex items-center gap-1 shrink-0">
                <span className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[10px] bg-bg-secondary text-ink-muted text-[12px] font-bold">
                  <Navigation size={12} strokeWidth={2} /> Envoyé
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    cancelConnection(rider.id);
                  }}
                  className="h-[30px] w-[30px] rounded-[10px] bg-accent text-bg-primary flex items-center justify-center shrink-0 active:opacity-80 transition-opacity"
                  title="Annuler la demande"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ) : isRecue ? (
              <div className="inline-flex items-center gap-1 shrink-0">
                <span className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[10px] bg-accent-soft text-accent-dark text-[12px] font-bold">
                  <Check size={12} strokeWidth={2.5} /> Reçu
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    refuseConnection(rider.id);
                  }}
                  className="h-[30px] w-[30px] rounded-[10px] bg-accent text-bg-primary flex items-center justify-center shrink-0 active:opacity-80 transition-opacity"
                  title="Refuser"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  sendConnection(rider.id);
                }}
                className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[10px] bg-ink text-bg-primary text-[12px] font-bold shrink-0 active:opacity-80 transition-opacity"
              >
                <UserPlus size={12} strokeWidth={2} /> Ajouter
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rider.niveau ? <Tag tone="accent">{NIVEAU_LABEL[rider.niveau]}</Tag> : null}
            {rider.moto_type ? <Tag tone="neutral">{MOTO_TYPE_LABEL[rider.moto_type]}</Tag> : null}
            {rider.types_sorties.slice(0, 1).map((s) => (
              <Tag key={s} tone="neutral">{SORTIE_LABEL[s]}</Tag>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
