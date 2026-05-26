"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bike, Check, Flame, Sparkles, Zap } from "lucide-react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/ui/Button";
import { useActions } from "@/lib/data/api";
import { MOTO_TYPE_LABEL, type MotoType, type Niveau } from "@/lib/types";

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
  const [moto, setMoto] = useState<MotoType | null>(onboardingDraft.moto_type ?? null);
  const [niveau, setNiveau] = useState<Niveau | null>(onboardingDraft.niveau ?? null);
  const valid = moto && niveau;

  function next() {
    if (!valid) return;
    setOnboardingDraft({ moto_type: moto!, niveau: niveau! });
    router.push("/onboarding/sorties");
  }

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      <StepHeader
        step={3}
        eyebrow="ta moto"
        title="Parle-nous de ta moto"
        subtitle="On utilise ces infos pour te connecter aux bons riders, pas pour te juger."
      />

      <div className="px-6 pt-3 pb-48 flex-1 no-scrollbar overflow-y-auto">
        <div className="flex items-center justify-between mb-3 mt-1">
          <span className="text-label">Type de moto</span>
          <span className="text-[11.5px] text-ink-muted">choisis-en une</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {MOTO_OPTIONS.map((m) => {
            const active = moto === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMoto(m.id)}
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
          <span className="text-[11.5px] text-ink-muted">honnêteté = sécurité</span>
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
          onClick={() => router.push("/onboarding/sorties")}
          className="w-full text-center text-[13px] font-semibold text-ink-muted underline"
        >
          Passer cette étape
        </button>
      </div>
    </main>
  );
}
