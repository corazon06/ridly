"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bike, Check, Flame, Plus, Sparkles, Trash2, Zap } from "lucide-react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Tag";
import { useActions } from "@/lib/data/api";
import { MOTO_TYPE_LABEL, type MotoType, type Niveau } from "@/lib/types";

type MotoEntry = { type: MotoType | null; marque: string; modele: string };
const emptyMoto = (): MotoEntry => ({ type: null, marque: "", modele: "" });

const MOTO_OPTIONS: { id: MotoType; sub: string }[] = [
  { id: "roadster", sub: "Polyvalent, urbain" },
  { id: "trail", sub: "Routes & chemins" },
  { id: "sportive", sub: "Vitesse & circuit" },
  { id: "touring", sub: "Longues distances" },
  { id: "cafe_racer", sub: "Style rétro" },
  { id: "custom", sub: "Custom & cruiser" },
];

const NIVEAU_OPTIONS: { id: Niveau; label: string; icon: React.ReactNode }[] = [
  { id: "debutant", label: "Débutant", icon: <Sparkles size={20} strokeWidth={1.7} /> },
  { id: "intermediaire", label: "Intermédiaire", icon: <Flame size={20} strokeWidth={1.7} /> },
  { id: "confirme", label: "Confirmé", icon: <Zap size={20} strokeWidth={1.7} /> },
];

export default function StepMoto() {
  const router = useRouter();
  const { setOnboardingDraft, onboardingDraft } = useActions();
  // `moto` = types sélectionnés (chips visuels)
  // `motos` = entrées détaillées (marque / modèle)
  // À la sauvegarde : moto[0] → moto_type, motos[0] → marque/modèle
  const [moto, setMoto] = useState<MotoType[]>(onboardingDraft.moto_type ? [onboardingDraft.moto_type] : []);

  function toggleMotoType(m: MotoType) {
    setMoto((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  }
  const [niveau, setNiveau] = useState<Niveau | null>(onboardingDraft.niveau ?? null);
  const [motos, setMotos] = useState<MotoEntry[]>([]);
  const valid = moto.length > 0 && niveau;

  function addMoto() {
    if (motos.length >= 10) return;
    setMotos((prev) => [...prev, emptyMoto()]);
  }
  function removeMoto(i: number) {
    setMotos((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateMoto(i: number, patch: Partial<MotoEntry>) {
    setMotos((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }

  function next() {
    if (!valid) return;
    const first = motos[0];
    setOnboardingDraft({
      moto_type: moto[0],
      niveau: niveau!,
      moto_marque: first?.marque || null,
      moto_modele: first?.modele || null,
    });
    // Photo moto uniquement si un type ET une marque/modèle sont renseignés
    const hasMotoDetail = moto.length > 0 && motos.length > 0 && (motos[0].marque || motos[0].modele);
    router.push(hasMotoDetail ? "/onboarding/photo-moto" : "/onboarding/sorties");
  }

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      <StepHeader
        step={3}
        eyebrow="ta / tes moto(s)"
        title="Parle-nous de ta/tes moto(s)"
        subtitle="On utilise ces infos pour te connecter aux bons motard(e)s, pas pour te juger."
      />

      <div className="px-6 pt-3 pb-48 flex-1 no-scrollbar overflow-y-auto">
        <div className="flex items-center justify-between mb-3 mt-1">
          <span className="text-label">Type(s) de moto</span>
          <span className="text-[11.5px] text-ink-muted">une ou plusieurs</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {MOTO_OPTIONS.map((m) => {
            const active = moto.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMotoType(m.id)}
                className={`relative text-left rounded-card border-[1.5px] p-3.5 min-h-[110px] flex flex-col gap-2.5 ${
                  active
                    ? "bg-ink text-bg-primary border-ink"
                    : "bg-white text-ink border-line"
                }`}
              >
                <span
                  className={`h-[38px] w-[38px] rounded-[11px] flex items-center justify-center ${
                    active ? "bg-white/10 text-bg-primary" : "bg-bg-secondary text-ink"
                  }`}
                >
                  <Bike size={20} strokeWidth={1.7} />
                </span>
                <div>
                  <div className="font-display font-bold text-[13px] leading-tight">
                    {MOTO_TYPE_LABEL[m.id]}
                  </div>
                  <div
                    className={`text-[11px] leading-snug mt-1 ${
                      active ? "text-bg-primary/55" : "text-ink-muted"
                    }`}
                  >
                    {m.sub}
                  </div>
                </div>
                {active ? (
                  <span className="absolute top-2.5 right-2.5 h-[22px] w-[22px] rounded-full bg-accent text-bg-primary flex items-center justify-center shadow-accent">
                    <Check size={11} strokeWidth={3} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-7 mb-3">
          <span className="text-label">Ton niveau</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {NIVEAU_OPTIONS.map((n) => {
            const active = niveau === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setNiveau(n.id)}
                className={`h-[88px] rounded-card border-[1.5px] flex flex-col items-center justify-center gap-1.5 ${
                  active
                    ? "bg-ink text-bg-primary border-ink"
                    : "bg-white text-ink border-line"
                }`}
              >
                {n.icon}
                <span className="text-[12px] font-display font-bold">{n.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 bg-ink text-bg-primary rounded-card p-4 flex gap-3">
          <span className="text-[18px] leading-none mt-0.5">🤍</span>
          <p className="text-[12px] leading-relaxed opacity-80 italic">
            Sois honnête sur ton niveau — le bon groupe, c'est celui où tout le monde rentre chez soi.
          </p>
        </div>

        {/* Mes motos */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label">Mes motos</span>
            {motos.length > 0 && (
              <span className="font-mono text-[10px] text-ink-muted">{motos.length}/10</span>
            )}
          </div>

          <div className="space-y-3">
            {motos.map((entry, i) => (
              <div key={i} className="rounded-card border border-line bg-white p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-[12px] text-ink-muted uppercase tracking-wider">Moto {i + 1}</span>
                  <button type="button" onClick={() => removeMoto(i)} className="h-7 w-7 rounded-full bg-bg-secondary flex items-center justify-center text-accent">
                    <Trash2 size={13} strokeWidth={2} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(MOTO_TYPE_LABEL) as MotoType[]).map((t) => (
                    <Chip key={t} active={entry.type === t} onClick={() => updateMoto(i, { type: entry.type === t ? null : t })}>
                      {MOTO_TYPE_LABEL[t]}
                    </Chip>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Marque" value={entry.marque} onChange={(e) => updateMoto(i, { marque: e.target.value })} />
                  <Input placeholder="Modèle" value={entry.modele} onChange={(e) => updateMoto(i, { modele: e.target.value })} />
                </div>
              </div>
            ))}
          </div>

          {motos.length < 10 && (
            <button
              type="button"
              onClick={addMoto}
              className="mt-2.5 w-full h-10 rounded-card bg-accent flex items-center justify-center gap-2 text-[13px] font-display font-bold text-white"
            >
              <Plus size={15} strokeWidth={2.2} /> Ajouter une moto
            </button>
          )}
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade space-y-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!valid}
          onClick={next}
        >
          Continuer <ArrowRight size={16} strokeWidth={2.2} />
        </Button>
        <button
          onClick={() => {
            if (moto.length > 0) setOnboardingDraft({ moto_type: moto[0] });
            if (niveau) setOnboardingDraft({ niveau });
            router.push("/onboarding/sorties");
          }}
          className="w-full text-center text-[13px] font-semibold text-ink-muted underline"
        >
          Passer cette étape
        </button>
      </div>
    </main>
  );
}
