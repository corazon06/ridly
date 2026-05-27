"use client";
import Link from "next/link";
import {
  Bell,
  Camera,
  ChevronRight,
  LogOut,
  MapPin,
  Plus,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import {
  useActions,
  useConnectionsLists,
  useMe,
  useUnreadNotificationsCount,
} from "@/lib/data/api";
import {
  MOTO_TYPE_LABEL,
  NIVEAU_LABEL,
  SORTIE_LABEL,
} from "@/lib/types";
import { ageFromBirthdate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const me = useMe();
  const { setMe } = useActions();
  const { reseau, recues } = useConnectionsLists();
  const unread = useUnreadNotificationsCount();

  if (!me) return null;

  const hasPhoto = !!me.photo_url;
  const hasMoto = !!me.moto_type;
  const hasGouts = me.gouts && me.gouts.length > 0;
  const hasSorties = me.types_sorties && me.types_sorties.length > 0;
  const hasDescription = !!me.description;
  const hasAge = !!me.date_naissance;
  const hasVille = !!me.ville;
  const hasPrenom = !!me.prenom;

  return (
    <main className="min-h-[100dvh] pb-10">
      {/* Header */}
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center justify-between">
        <h1 className="text-h1">Mon profil</h1>
        <button
          onClick={() => router.push("/profile/settings")}
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <Settings size={16} strokeWidth={1.8} />
        </button>
      </div>

      {/* Avatar + identité */}
      <div className="px-6 mt-4 flex items-center gap-4">
        {hasPhoto ? (
          <Avatar src={me.photo_url} name={me.prenom} size="xl" online={me.is_online} />
        ) : (
          <Link href="/profile/edit">
            <div className="h-[68px] w-[68px] rounded-full border-[2px] border-dashed border-line bg-bg-secondary flex items-center justify-center text-ink-muted">
              <Camera size={22} strokeWidth={1.6} />
            </div>
          </Link>
        )}
        <div className="flex-1">
          <p className="text-h2">
            {hasPrenom ? me.prenom : <span className="text-ink-muted italic">Prénom</span>}
            {hasAge ? `, ${ageFromBirthdate(me.date_naissance)}` : ""}
          </p>
          {hasVille ? (
            <p className="text-caption text-ink-muted flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {me.ville}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {me.permis_verifie ? (
              <Tag tone="success">
                <ShieldCheck size={12} /> Permis ✓
              </Tag>
            ) : null}
            {me.is_online ? <Tag tone="trust">● En ligne</Tag> : null}
          </div>
        </div>
      </div>

      {/* Description */}
      {hasDescription && (
        <p className="px-6 mt-3 text-[13px] text-ink-soft leading-relaxed">{me.description}</p>
      )}

      {/* CTA modifier */}
      <div className="px-6 mt-4">
        <Link href="/profile/edit">
          <Button variant="secondary" fullWidth>
            Modifier mon profil
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <Card className="mx-6 mt-3 p-4 grid grid-cols-3 divide-x divide-line">
        <Stat top={String(me.rides_organises)} bottom="Organisés" />
        <Stat top={String(me.rides_rejoints)} bottom="Rejoints" />
        <Stat top={me.km_parcourus > 0 ? `${me.km_parcourus}km` : "0km"} bottom="Parcourus" />
      </Card>

      {/* Sa moto */}
      <h2 className="text-label px-6 mt-6 mb-2">Ma moto</h2>
      {hasMoto ? (
        <Card className="mx-6 p-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-bg-secondary flex items-center justify-center text-[22px]">
            🏍
          </div>
          <div className="flex-1">
            <p className="text-label">
              {me.moto_marque
                ? `${me.moto_marque}${me.moto_modele ? ` ${me.moto_modele}` : ""}`
                : MOTO_TYPE_LABEL[me.moto_type!]}
            </p>
            <p className="text-caption text-ink-muted">{MOTO_TYPE_LABEL[me.moto_type!]}</p>
          </div>
          {me.niveau ? <Tag tone="accent">{NIVEAU_LABEL[me.niveau]}</Tag> : null}
        </Card>
      ) : (
        <Link href="/profile/edit" className="mx-6 block">
          <div className="border-[1.5px] border-dashed border-line rounded-card p-4 flex items-center gap-3 text-ink-muted">
            <div className="h-10 w-10 rounded-full bg-bg-secondary flex items-center justify-center">
              <Plus size={18} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-semibold">Ajouter une moto</span>
          </div>
        </Link>
      )}

      {/* Mes goûts */}
      <h2 className="text-label px-6 mt-6 mb-2">Mes goûts</h2>
      {hasGouts ? (
        <div className="px-6 flex flex-wrap gap-2">
          {me.gouts.map((g) => (
            <Tag key={g} tone="neutral">{g}</Tag>
          ))}
        </div>
      ) : hasSorties ? (
        <div className="px-6 flex flex-wrap gap-2">
          {me.types_sorties.map((s) => (
            <Tag key={s} tone="neutral">{SORTIE_LABEL[s]}</Tag>
          ))}
        </div>
      ) : (
        <Link href="/profile/edit" className="px-6 block">
          <div className="border-[1.5px] border-dashed border-line rounded-card p-3 flex items-center gap-3 text-ink-muted">
            <Plus size={16} strokeWidth={2} />
            <span className="text-[13px] font-semibold">Ajouter mes goûts</span>
          </div>
        </Link>
      )}

      {/* Liens */}
      <div className="px-6 mt-7 space-y-2">
        <Row
          icon={<Bell size={18} />}
          title="Mes notifications"
          desc={unread > 0 ? `${unread} non lue${unread > 1 ? "s" : ""}` : "À jour"}
          href="/notifications"
          badge={unread > 0 ? unread : undefined}
        />
        <Row
          icon={<Users size={18} />}
          title="Mes Motards"
          desc={`${reseau.length} connexions · ${recues.length} en attente`}
          href="/profile/riders"
        />
        <Row
          icon={<ShieldCheck size={18} />}
          title="Vérifier mon permis"
          desc={me.permis_verifie ? "Vérifié" : "Optionnel — badge confiance"}
          href="/profile/verify"
        />
        <Row
          icon={<Settings size={18} />}
          title="Réglages & confidentialité"
          href="/profile/settings"
        />
        <button
          onClick={() => {
            setMe(null);
            router.replace("/");
          }}
          className="w-full text-left p-4 rounded-card bg-white border border-line flex items-center gap-3 text-accent-dark"
        >
          <LogOut size={18} />
          <span className="text-label">Se déconnecter</span>
        </button>
      </div>
    </main>
  );
}

function Stat({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="text-center">
      <div className="text-h2">{top}</div>
      <div className="text-eyebrow text-ink-muted uppercase mt-0.5">{bottom}</div>
    </div>
  );
}

function Row({
  icon,
  title,
  desc,
  href,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  href: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 rounded-card bg-white border border-line"
    >
      <span className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[14px] flex items-center gap-2">
          {title}
          {badge ? (
            <span className="bg-accent text-bg-primary font-display font-bold text-[10px] h-[18px] min-w-[18px] px-1.5 rounded-full flex items-center justify-center">
              {badge}
            </span>
          ) : null}
        </p>
        {desc ? <p className="text-[12px] text-ink-muted mt-0.5">{desc}</p> : null}
      </div>
      <ChevronRight size={18} className="text-ink-muted" strokeWidth={2} />
    </Link>
  );
}
