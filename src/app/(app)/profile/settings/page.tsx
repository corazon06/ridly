"use client";
import { Bell, Download, Eye, HelpCircle, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TopBar } from "@/components/ui/TopBar";
import { useActions, useMe } from "@/lib/data/api";

export default function SettingsPage() {
  const me = useMe();
  const { upsertUser } = useActions();
  const [pushOn, setPushOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);

  return (
    <main className="min-h-[100dvh]">
      <TopBar title="Réglages" />
      <div className="px-6 space-y-5">
        <Section title="Disponibilité">
          <Toggle
            label="Visible en ligne"
            sub="Les motards proches savent que tu es dispo"
            on={!!me?.is_online}
            onChange={(v) => me && upsertUser({ ...me, is_online: v })}
          />
        </Section>

        <Section title="Notifications">
          <Toggle
            icon={<Bell size={16} />}
            label="Push"
            sub="Demandes, messages, rappels"
            on={pushOn}
            onChange={setPushOn}
          />
          <Toggle
            icon={<Bell size={16} />}
            label="Email"
            sub="1 résumé par mois max"
            on={emailOn}
            onChange={setEmailOn}
          />
        </Section>

        <Section title="Confidentialité">
          <Toggle
            icon={<Eye size={16} />}
            label="Profil visible"
            on={profilePublic}
            onChange={setProfilePublic}
          />
        </Section>

        <Section title="Vérification">
          <Row icon={<ShieldCheck size={16} />} label="Vérifier mon permis" sub="Optionnel — badge confiance" />
        </Section>

        <Section title="Données (RGPD)">
          <Row icon={<Download size={16} />} label="Exporter mes données" sub="Format JSON, par email" />
          <Row icon={<Trash2 size={16} />} label="Supprimer mon compte" sub="Action irréversible" tone="danger" />
        </Section>

        <Section title="Aide">
          <Row icon={<HelpCircle size={16} />} label="FAQ & contact" />
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-eyebrow text-ink-muted uppercase mb-2">{title}</p>
      <Card className="divide-y divide-line">{children}</Card>
    </div>
  );
}

function Toggle({
  label,
  sub,
  on,
  onChange,
  icon,
}: {
  label: string;
  sub?: string;
  on: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      {icon ? <span className="text-ink-muted">{icon}</span> : null}
      <div className="flex-1">
        <p className="text-label">{label}</p>
        {sub ? <p className="text-caption text-ink-muted">{sub}</p> : null}
      </div>
      <button
        onClick={() => onChange(!on)}
        className={`h-7 w-12 rounded-full p-1 transition-colors ${on ? "bg-accent" : "bg-line"}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}

function Row({
  icon,
  label,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  tone?: "danger";
}) {
  return (
    <div className={`flex items-center gap-3 p-4 ${tone === "danger" ? "text-accent-dark" : ""}`}>
      <span className={tone === "danger" ? "text-accent-dark" : "text-ink-muted"}>{icon}</span>
      <div className="flex-1">
        <p className="text-label">{label}</p>
        {sub ? <p className="text-caption text-ink-muted">{sub}</p> : null}
      </div>
    </div>
  );
}
