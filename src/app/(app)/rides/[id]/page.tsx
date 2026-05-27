"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  Flag,
  MapPin,
  MessageCircle,
  Quote,
  Search,
  Share2,
  Shield,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import {
  useActions,
  useConnectionsLists,
  useMe,
  useRide,
  useUser,
} from "@/lib/data/api";
import { useMock } from "@/lib/mock/store";
import {
  ALLURE_LABEL,
  DUREE_LABEL,
  MOTO_TYPE_LABEL,
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
  const { reseau } = useConnectionsLists();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteSearch, setInviteSearch] = useState("");
  const [pendingInvites, setPendingInvites] = useState<string[]>([]); // countdown en cours
  const [confirmedInvites, setConfirmedInvites] = useState<string[]>([]); // invitations confirmées
  const inviteTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  if (!ride || !createur) return <main className="p-6">Ride introuvable.</main>;

  const accepted = (ride.participants ?? []).filter((p) => p.statut === "accepte");
  const participantIds = new Set((ride.participants ?? []).map((p) => p.user_id));
  const myParticipation = ride.participants?.find((p) => p.user_id === me?.id);
  const isAccepted = myParticipation?.statut === "accepte";
  const isPending = myParticipation?.statut === "en_attente";
  const isParticipant = !!myParticipation;
  const isCreateur = me?.id === ride.createur_id;
  const dateObj = new Date(`${ride.date_ride}T${ride.heure_depart}`);
  const placesRestantes = ride.nb_places_max - accepted.length;

  return (
    <main className="min-h-[100dvh] pb-36">
      {/* Header */}
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted font-bold">
          Détail du ride
        </div>
        <button className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink">
          <Share2 size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="px-6 space-y-4 mt-2">

        {/* Hero — types + titre + date */}
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {ride.type_sortie.map((s) => (
              <Tag key={s} tone="ink">{SORTIE_LABEL[s]}</Tag>
            ))}
          </div>
          <h1 className="text-h1 leading-tight">{ride.titre}</h1>
          <p className="text-body text-ink-muted mt-1 flex items-center gap-1.5">
            <CalendarDays size={14} />
            {format(dateObj, "EEEE d MMMM", { locale: fr })}
            <span className="text-ink-muted/50">·</span>
            <Clock size={14} />
            {ride.heure_depart}
          </p>
        </div>

        {/* Itinéraire */}
        <Card className="p-4">
          <div className="flex gap-3">
            {/* Ligne verticale */}
            <div className="flex flex-col items-center pt-1 shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-accent-dark" />
              <div className="w-[2px] bg-line my-1" style={{ flex: 1, minHeight: 20 }} />
              {(ride.arrets ?? []).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-ink-muted" />
                  <div className="w-[2px] bg-line my-1" style={{ minHeight: 20 }} />
                </div>
              ))}
              <div className="h-2.5 w-2.5 rounded-full border-[2px] border-ink-muted bg-white" />
            </div>
            {/* Points */}
            <div className="flex-1 space-y-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-ink-muted mb-0.5">Départ</p>
                <p className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
                  <MapPin size={13} className="text-accent-dark shrink-0" />
                  {ride.point_depart}
                </p>
              </div>
              {(ride.arrets ?? []).filter(Boolean).map((a, i) => (
                <div key={i}>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-ink-muted mb-0.5">Arrêt {i + 1}</p>
                  <p className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
                    <MapPin size={13} className="text-ink-muted shrink-0" />
                    {a}
                  </p>
                </div>
              ))}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-ink-muted mb-0.5">Arrivée</p>
                <p className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
                  <Flag size={13} className="text-ink-muted shrink-0" />
                  {(ride as any).point_arrivee || "Boucle"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Infos grid */}
        <div className="grid grid-cols-2 gap-2">
          <InfoCell icon={<Clock size={15} className="text-accent-dark" />} label="Durée" value={DUREE_LABEL[ride.duree_estimee]} />
          <InfoCell icon={<Users size={15} className="text-accent-dark" />} label="Places" value={`${accepted.length} / ${ride.nb_places_max} · ${placesRestantes > 0 ? `${placesRestantes} dispo` : "Complet"}`} />
          {ride.allure ? (
            <InfoCell icon={<span className="text-[15px]">🏍</span>} label="Allure" value={ALLURE_LABEL[ride.allure]} />
          ) : null}
          {ride.niveau_requis ? (
            <InfoCell icon={<Shield size={15} className="text-accent-dark" />} label="Niveau requis" value={NIVEAU_LABEL[ride.niveau_requis]} />
          ) : (
            <InfoCell icon={<Shield size={15} className="text-ink-muted" />} label="Niveau requis" value="🤝 Libre" />
          )}
          <InfoCell
            icon={<CheckCircle size={15} className={ride.validation_manuelle ? "text-accent-dark" : "text-success"} />}
            label="Validation"
            value={ride.validation_manuelle ? "Manuelle" : "Automatique"}
          />
        </div>

        {/* Mot libre */}
        {ride.mot_libre ? (
          <Card className="p-4 bg-accent-soft border-accent/20">
            <Quote size={16} className="text-accent-dark mb-2" />
            <p className="text-body text-ink leading-relaxed italic">{ride.mot_libre}</p>
          </Card>
        ) : null}

        {/* Participants */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-label">Participant(e)s · {accepted.length}</h2>
          </div>
          <div className="flex items-center gap-3">
            <AvatarStack
              users={accepted
                .map((p) => users.find((u) => u.id === p.user_id))
                .filter(Boolean)
                .map((u) => ({ name: u!.prenom, src: u!.photo_url }))}
              max={5}
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
        </div>

        {/* Créateur */}
        <Card className="p-4 flex items-center gap-3">
          <Avatar src={createur.photo_url} name={createur.prenom} size="md" />
          <div className="flex-1 min-w-0">
            <div className="text-label flex items-center gap-1.5">
              {createur.prenom}
              {createur.permis_verifie ? <Tag tone="success" className="text-[10px]">Permis ✓</Tag> : null}
            </div>
            <div className="text-caption text-ink-muted">
              Organisateur · {createur.rides_organises} rides · fiabilité {createur.score_fiabilite}%
            </div>
          </div>
          <button
            onClick={() => router.push(`/explorer/${createur.id}`)}
            className="text-[12px] font-semibold text-accent underline shrink-0"
          >
            Voir profil
          </button>
        </Card>

      </div>

      {/* CTA sticky */}
      <div
        className="fixed bottom-0 left-0 right-0 mx-auto px-[22px] pb-24 pt-3 sticky-bottom-fade"
        style={{ maxWidth: 440 }}
      >
        {!isCreateur && (
          <>
            {isAccepted ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-center gap-2 h-12 rounded-card bg-white border border-line">
                  <span className="text-[18px]">🎉</span>
                  <span className="font-display font-bold text-[15px] text-ink">Tu participes !</span>
                </div>
                <button
                  onClick={() => setInviteOpen(true)}
                  className="h-12 w-12 rounded-card bg-ink text-bg-primary flex items-center justify-center shrink-0"
                  title="Inviter un(e) motard(e)"
                >
                  <UserPlus size={18} strokeWidth={2} />
                </button>
              </div>
            ) : isPending ? (
              <Button variant="primary" size="lg" fullWidth disabled>
                ⏳ Demande en cours
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={placesRestantes === 0}
                onClick={() => {
                  if (!me) return;
                  joinRide(ride.id, me.id);
                }}
              >
                {placesRestantes === 0 ? "Complet" : "Demander à rejoindre"}
              </Button>
            )}
            <button className="w-full mt-2 h-12 rounded-card bg-ink text-bg-primary font-display font-bold text-[14px] flex items-center justify-center gap-2">
              <MessageCircle size={15} strokeWidth={2} /> Contacter {createur.prenom}
            </button>
          </>
        )}
        {isCreateur && (
          <Button variant="primary" size="lg" fullWidth>
            Gérer le ride
          </Button>
        )}
      </div>
      {/* Invite sheet */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 440, margin: "0 auto" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setInviteOpen(false)} />
          <div className="relative bg-white rounded-t-[20px] overflow-hidden flex flex-col" style={{ maxHeight: "75dvh" }}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-line" />
            </div>
            {/* Header */}
            <div className="px-5 pb-3 flex items-center justify-between">
              <h3 className="font-display font-bold text-[16px]">Inviter un(e) motard(e)</h3>
              <button onClick={() => setInviteOpen(false)} className="h-8 w-8 rounded-full bg-bg-secondary flex items-center justify-center">
                <X size={15} strokeWidth={2} />
              </button>
            </div>
            {/* Search */}
            <div className="px-5 pb-3">
              <div className="flex items-center gap-2 bg-bg-secondary rounded-card px-3 h-10">
                <Search size={15} className="text-ink-muted shrink-0" />
                <input
                  autoFocus
                  value={inviteSearch}
                  onChange={(e) => setInviteSearch(e.target.value)}
                  placeholder="Prénom, moto, niveau…"
                  className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-muted"
                />
              </div>
            </div>
            {/* List */}
            <div className="overflow-y-auto flex-1 px-5 pb-6 space-y-2">
              {(() => {
                const q = inviteSearch.toLowerCase();
                const filtered = reseau
                  .filter((u) => !participantIds.has(u.id)) // exclure déjà participants
                  .filter((u) => {
                    if (!q) return true;
                    return [
                      u.prenom,
                      u.moto_marque ?? "",
                      u.moto_modele ?? "",
                      u.moto_type ?? "",
                      u.niveau ?? "",
                      u.description ?? "",
                      u.ville,
                      ...(u.types_sorties ?? []),
                      ...(u.gouts ?? []),
                    ].some((v) => v.toLowerCase().includes(q));
                  });

                if (filtered.length === 0) {
                  return (
                    <p className="text-center text-[13px] text-ink-muted py-6">
                      {reseau.filter((u) => !participantIds.has(u.id)).length === 0
                        ? "Tous tes contacts participent déjà 🎉"
                        : "Aucun résultat"}
                    </p>
                  );
                }

                return filtered.map((u) => {
                  const isPending = pendingInvites.includes(u.id);
                  const isConfirmed = confirmedInvites.includes(u.id);

                  function startInvite() {
                    setPendingInvites((prev) => [...prev, u.id]);
                    inviteTimers.current[u.id] = setTimeout(() => {
                      setPendingInvites((prev) => prev.filter((x) => x !== u.id));
                      setConfirmedInvites((prev) => [...prev, u.id]);
                    }, 10000);
                  }

                  function cancelInvite() {
                    clearTimeout(inviteTimers.current[u.id]);
                    delete inviteTimers.current[u.id];
                    setPendingInvites((prev) => prev.filter((x) => x !== u.id));
                  }

                  return (
                    <div key={u.id} className="flex items-center gap-3 p-3 rounded-card border border-line bg-white">
                      <img
                        src={u.photo_url ?? ""}
                        alt={u.prenom}
                        className="h-10 w-10 rounded-full object-cover bg-bg-secondary shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-[13px]">{u.prenom}</p>
                        <p className="text-[11px] text-ink-muted truncate">
                          {u.moto_marque ? `${u.moto_marque} ${u.moto_modele ?? ""}` : u.moto_type ? MOTO_TYPE_LABEL[u.moto_type] : ""}
                          {u.niveau ? ` · ${NIVEAU_LABEL[u.niveau]}` : ""}
                        </p>
                      </div>
                      {isConfirmed ? (
                        <span className="h-8 px-3 rounded-[8px] text-[12px] font-bold shrink-0 bg-success/10 text-success flex items-center">
                          ✓ Invité(e)
                        </span>
                      ) : isPending ? (
                        <button
                          key={`drain-${u.id}`}
                          onClick={cancelInvite}
                          className="relative h-8 px-3 rounded-[8px] overflow-hidden text-[12px] font-bold shrink-0 whitespace-nowrap"
                          style={{ background: "#E8E4DC", color: "#2A2624", minWidth: 72 }}
                        >
                          <span
                            className="absolute inset-0 bg-ink rounded-[8px]"
                            style={{ animation: "drain-rtl 10s linear forwards", transformOrigin: "left center" }}
                          />
                          <span className="relative z-10 text-bg-primary">Annuler</span>
                        </button>
                      ) : (
                        <button
                          onClick={startInvite}
                          className="h-8 px-3 rounded-[8px] text-[12px] font-bold shrink-0 bg-ink text-bg-primary"
                        >
                          Inviter
                        </button>
                      )}
                    </div>
                  );
                });

              })()}
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes drain-rtl {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </main>
  );
}

function InfoCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-3 flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">{label}</p>
        <p className="text-[13px] font-semibold text-ink mt-0.5 leading-tight">{value}</p>
      </div>
    </Card>
  );
}
