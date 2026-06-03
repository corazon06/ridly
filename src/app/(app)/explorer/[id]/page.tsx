"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ArrowLeft, CalendarDays, MapPin, MessageCircle, ShieldCheck, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import {
  useActions,
  useConnectionsLists,
  useMe,
  useUser,
} from "@/lib/data/api";
import { useMock } from "@/lib/mock/store";
import {
  MOTO_TYPE_LABEL,
  NIVEAU_LABEL,
  SORTIE_LABEL,
} from "@/lib/types";
import { ageFromBirthdate } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function RiderDetailPage() {
  return <Suspense><RiderDetailPageInner /></Suspense>;
}

function RiderDetailPageInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const backUrl = searchParams.get("from") === "ride" ? "javascript:history.back()" : "/explorer?mode=riders";
  const me = useMe();
  const rider = useUser(id);
  const rides = useMock((s) => s.rides);
  const allConnections = useMock((s) => s.connections);
  const { reseau, envoyees } = useConnectionsLists();
  const { startDmWith } = useActions();

  // 3 rides closest to today (past or future) for this rider
  const today = new Date().toISOString().slice(0, 10);
  const riderRides = rides
    .filter((r) =>
      r.statut !== "annule" &&
      (r.createur_id === id ||
        r.participants?.some((p) => p.user_id === id && (p.statut === "accepte" || p.statut === "present")))
    )
    .sort((a, b) => {
      const da = Math.abs(new Date(a.date_ride).getTime() - Date.now());
      const db = Math.abs(new Date(b.date_ride).getTime() - Date.now());
      return da - db;
    })
    .slice(0, 3);

  if (!rider) return <main className="p-6">Profil introuvable.</main>;

  // Amis en commun : intersection entre réseau de me et réseau du rider
  const riderFriendIds = new Set(
    allConnections
      .filter((c) => c.statut === "accepte" && (c.demandeur_id === rider.id || c.receveur_id === rider.id))
      .map((c) => (c.demandeur_id === rider.id ? c.receveur_id : c.demandeur_id))
  );
  const communs = reseau.filter((u) => riderFriendIds.has(u.id));
  const communsBlock = communs.length > 0 && me ? (
    <Card className="mt-6 p-4">
      <p className="text-eyebrow text-ink-muted uppercase mb-2">amis Ridly en commun</p>
      <div className="flex items-center gap-3">
        <AvatarStack users={communs.slice(0, 3).map((r) => ({ name: r.prenom, src: r.photo_url }))} />
        <p className="text-caption text-ink-muted">
          {communs.slice(0, 3).map((r) => r.prenom).join(", ")}
        </p>
      </div>
    </Card>
  ) : null;

  const [photoOpen, setPhotoOpen] = useState(false);
  const isFriend = reseau.some((r) => r.id === rider.id);
  const isPending = envoyees.some((c) => c.receveur_id === rider.id);
  const age = ageFromBirthdate(rider.date_naissance);

  function requestContact() {
    // Route to the dedicated description screen (Batch 3 SCREEN 1 sister)
    if (!rider) return;
    router.push(`/explorer/${rider.id}/request`);
  }

  function dm() {
    if (!rider) return;
    const cid = startDmWith(rider.id);
    router.push(`/messages/${cid}`);
  }

  return (
    <main className="min-h-[100dvh] pb-32">
      <div className="px-6 pt-4 safe-top flex items-center justify-between">
        <button
          onClick={() => backUrl === "javascript:history.back()" ? router.back() : router.push(backUrl)}
          className="h-10 w-10 rounded-full bg-bg-secondary flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="h-10 w-10" />
      </div>

      {/* Photo lightbox */}
      {photoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setPhotoOpen(false)}
          style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", backgroundColor: "rgba(0,0,0,0.1)" }}
        >
          <button
            className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white"
            onClick={() => setPhotoOpen(false)}
          >
            <X size={18} />
          </button>
          {rider.photo_url ? (
            <img
              src={rider.photo_url}
              alt={rider.prenom}
              className="w-72 h-72 rounded-2xl object-cover shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className="w-72 h-72 rounded-2xl bg-bg-secondary flex items-center justify-center text-[80px] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {rider.prenom[0]}
            </div>
          )}
        </div>
      )}

      <div className="px-6 mt-4">
        <button onClick={() => setPhotoOpen(true)} className="rounded-full active:opacity-80 transition-opacity">
          <Avatar src={rider.photo_url} name={rider.prenom} size="xl" online={rider.is_online} />
        </button>
        <h1 className="text-h1 mt-3">
          {rider.prenom}, {age}
        </h1>
        <p className="text-body text-ink-muted flex items-center gap-1 mt-1">
          <MapPin size={14} /> {rider.ville}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {rider.permis_verifie ? (
            <Tag tone="success">
              <ShieldCheck size={12} /> Profil vérifié
            </Tag>
          ) : null}
          {rider.is_online ? <Tag tone="trust">● En ligne</Tag> : null}
          {rider.score_fiabilite >= 85 ? (
            <Tag tone="success" title="Basé sur les présences aux balades et les avis reçus">⭐ Fiabilité {rider.score_fiabilite}%</Tag>
          ) : rider.score_fiabilite >= 70 ? (
            <Tag tone="neutral" title="Basé sur les présences aux balades et les avis reçus">Fiabilité {rider.score_fiabilite}%</Tag>
          ) : null}
        </div>

        <Card className="mt-3 p-4 grid grid-cols-3 divide-x divide-line">
          <Stat value={rider.rides_organises} label="organisés" />
          <Stat value={rider.rides_rejoints} label="rejoints" />
          <Stat value={`${rider.km_parcourus.toLocaleString("fr-FR")} km`} label="parcourus" />
        </Card>

        <h2 className="text-label mt-6 mb-2">Sa moto</h2>
        {rider.moto_type ? (
          <Card className="p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-bg-secondary flex items-center justify-center">
              <span className="text-h2">🏍</span>
            </div>
            <div className="flex-1">
              <div className="text-label">
                {rider.moto_marque
                  ? `${rider.moto_marque}${rider.moto_modele ? ` ${rider.moto_modele}` : ""}`
                  : MOTO_TYPE_LABEL[rider.moto_type]}
              </div>
              <div className="text-caption text-ink-muted">
                {MOTO_TYPE_LABEL[rider.moto_type]}
                {rider.moto_cylindree ? ` · ${rider.moto_cylindree} cm³` : ""}
                {rider.moto_annee ? ` · ${rider.moto_annee}` : ""}
              </div>
            </div>
            {rider.niveau ? <Tag tone="accent">{NIVEAU_LABEL[rider.niveau]}</Tag> : null}
          </Card>
        ) : null}

        <h2 className="text-label mt-6 mb-2">Types de sorties préférées</h2>
        <div className="flex flex-wrap gap-2">
          {rider.types_sorties.map((s) => (
            <Tag key={s} tone={s === "longue_distance" ? "roadtrip" : "neutral"}>{SORTIE_LABEL[s]}</Tag>
          ))}
        </div>

        {rider.description ? (
          <>
            <h2 className="text-label mt-6 mb-2">À propos</h2>
            <p className="text-body text-ink leading-relaxed">{rider.description}</p>
          </>
        ) : null}

        {riderRides.length > 0 && (
          <>
            <h2 className="text-label mt-6 mb-2">Ses balades</h2>
            <div className="space-y-2">
              {riderRides.map((r) => {
                const isPast = r.date_ride < today;
                const d = new Date(r.date_ride);
                return (
                  <Link key={r.id} href={`/rides/${r.id}`}>
                    <Card className="p-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-[10px] bg-bg-secondary flex items-center justify-center text-[18px] shrink-0">
                        {isPast ? "🏁" : "📍"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-[13px] leading-tight truncate">
                          {r.titre ?? "Ride"}
                        </p>
                        <p className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
                          <CalendarDays size={10} />
                          {format(d, "d MMM yyyy", { locale: fr })}
                          {r.heure_depart ? ` · ${r.heure_depart}` : ""}
                        </p>
                      </div>
                      <Tag tone={isPast ? "neutral" : "success"}>
                        {isPast ? "Passée" : "À venir"}
                      </Tag>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {communsBlock}
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 mx-auto px-[22px] pb-24 pt-3 sticky-bottom-fade"
        style={{ maxWidth: 440 }}
      >
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={isFriend || isPending}
            onClick={requestContact}
          >
            <UserPlus size={18} strokeWidth={2} />
            {isFriend ? "Connecté" : isPending ? "Demande envoyée" : "Demander contact"}
          </Button>
          <Button variant="secondary" size="lg" onClick={dm} disabled={!isFriend}>
            <MessageCircle size={18} strokeWidth={2} />
          </Button>
        </div>
        {!isFriend ? (
          <p className="text-[12px] text-ink-muted text-center mt-2">
            La messagerie s&apos;ouvre une fois la demande acceptée.
          </p>
        ) : null}
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      <div className="text-h2">{value}</div>
      <div className="text-eyebrow text-ink-muted uppercase">{label}</div>
    </div>
  );
}
