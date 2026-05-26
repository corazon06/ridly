"use client";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MessageCircle,
  Quote,
  Share2,
  Users,
} from "lucide-react";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import {
  useActions,
  useMe,
  useRide,
  useUser,
} from "@/lib/data/api";
import { useMock } from "@/lib/mock/store";
import {
  DUREE_LABEL,
  NIVEAU_LABEL,
  SORTIE_LABEL,
} from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function RideDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const me = useMe();
  const ride = useRide(id);
  const createur = useUser(ride?.createur_id);
  const users = useMock((s) => s.users);
  const { joinRide } = useActions();

  if (!ride || !createur) return <main className="p-6">Ride introuvable.</main>;

  const accepted = (ride.participants ?? []).filter((p) => p.statut === "accepte");
  const isParticipant = !!ride.participants?.find((p) => p.user_id === me?.id);
  const dateObj = new Date(`${ride.date_ride}T${ride.heure_depart}`);

  return (
    <main className="min-h-[100dvh] pb-32">
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted font-bold">
          RIDE · #{ride.id.slice(-3).toUpperCase()}
        </div>
        <button className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink">
          <Share2 size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="px-6">
        <Card className="mt-4 p-4 flex items-center gap-3">
          <Avatar src={createur.photo_url} name={createur.prenom} size="md" />
          <div className="flex-1">
            <div className="text-label">
              {createur.prenom}, {new Date().getFullYear() - new Date(createur.date_naissance).getFullYear()}
              {createur.permis_verifie ? <Tag tone="success" className="ml-2">Permis ✓</Tag> : null}
            </div>
            <div className="text-caption text-ink-muted">
              Créateur · {createur.rides_organises} rides organisés
            </div>
          </div>
        </Card>

        <div className="mt-5">
          <div className="flex flex-wrap gap-2 mb-2">
            {ride.type_sortie.map((s) => (
              <Tag key={s} tone="ink">{SORTIE_LABEL[s]}</Tag>
            ))}
          </div>
          <h1 className="text-h1 leading-tight">{ride.titre}</h1>
          <p className="text-body text-ink-muted mt-1">
            {format(dateObj, "EEEE d MMMM · HH'h'mm", { locale: fr })}
          </p>
        </div>

        <Card className="mt-5 p-4">
          <div className="grid grid-cols-1 divide-x divide-line">
            <Stat top={DUREE_LABEL[ride.duree_estimee]} bottom="Durée estimée" />
          </div>
        </Card>

        <Card className="mt-3 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-accent-soft to-bg-secondary relative">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 128" preserveAspectRatio="none">
              <path d="M20 90 Q80 30 160 70 T 300 40" stroke="#B25234" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              <circle cx="20" cy="90" r="6" fill="#9A4429" />
              <circle cx="300" cy="40" r="6" fill="#2A2624" />
            </svg>
            <div className="absolute top-2 left-2 bg-white rounded-chip text-caption px-3 py-1">
              Départ · {ride.point_depart}
            </div>
          </div>
        </Card>

        {ride.mot_libre ? (
          <Card className="mt-3 p-4 bg-accent-soft border-accent/20">
            <Quote size={16} className="text-accent-dark mb-1" />
            <p className="text-body text-ink leading-relaxed italic">{ride.mot_libre}</p>
          </Card>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-label">Participants · {accepted.length}</h2>
          <Tag tone="neutral">
            <Users size={12} /> {accepted.length} / {ride.nb_places_max}
          </Tag>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <AvatarStack
            users={accepted
              .map((p) => users.find((u) => u.id === p.user_id))
              .filter(Boolean)
              .map((u) => ({ name: u!.prenom, src: u!.photo_url }))}
            max={4}
          />
          <span className="text-caption text-ink-muted">
            {accepted
              .slice(0, 3)
              .map((p) => users.find((u) => u.id === p.user_id)?.prenom)
              .filter(Boolean)
              .join(", ")}
            {accepted.length > 3 ? ` + ${accepted.length - 3} autres` : ""}
          </span>
        </div>

        <h2 className="text-label mt-6 mb-3">Ce ride en chiffres</h2>
        <div className="grid grid-cols-2 gap-3">
          <MiniStat label="Distance estimée" value="120 km" />
          <MiniStat label="Allure moyenne" value="~80 km/h" />
          <MiniStat label="Pauses prévues" value="2 stops" />
          <MiniStat label="Niveau requis" value={NIVEAU_LABEL[createur.niveau]} />
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 mx-auto px-[22px] pb-24 pt-3 sticky-bottom-fade"
        style={{ maxWidth: 440 }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={isParticipant}
          onClick={() => {
            if (!me) return;
            joinRide(ride.id, me.id);
          }}
        >
          {isParticipant ? "Demande en cours" : "Demander à rejoindre"}
        </Button>
        <button className="w-full text-center text-caption text-ink-muted mt-3 flex items-center justify-center gap-1.5">
          <MessageCircle size={14} /> Message à {createur.prenom}
        </button>
      </div>
    </main>
  );
}

function Stat({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="text-center">
      <div className="text-label">{top}</div>
      <div className="text-eyebrow text-ink-muted uppercase mt-0.5">{bottom}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3">
      <div className="text-eyebrow text-ink-muted uppercase">{label}</div>
      <div className="text-label mt-1">{value}</div>
    </Card>
  );
}
