"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Coffee,
  Globe,
  LayoutGrid,
  Mountain,
  Navigation,
  Smile,
  Sun,
  Waves,
} from "lucide-react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/ui/Button";
import { useActions } from "@/lib/data/api";
import { type SortieType } from "@/lib/types";

const OPTIONS: {
  id: SortieType;
  label: string;
  sub: string;
  icon: React.ReactNode;
}[] = [
  { id: "balade", label: "Balade tranquille", sub: "Posé, panoramas", icon: <Smile size={20} strokeWidth={1.7} /> },
  { id: "road_trip", label: "Road Trip", sub: "Plusieurs jours", icon: <Navigation size={20} strokeWidth={1.7} /> },
  { id: "cafe", label: "Café / Apéro", sub: "Pause conviviale", icon: <Coffee size={20} strokeWidth={1.7} /> },
  { id: "cols", label: "Cols de montagne", sub: "Lacets & altitude", icon: <Mountain size={20} strokeWidth={1.7} /> },
  { id: "matinale", label: "Sortie matinale", sub: "Avant 9h", icon: <Sun size={20} strokeWidth={1.7} /> },
  { id: "twisty", label: "Twisty", sub: "Routes sinueuses", icon: <Waves size={20} strokeWidth={1.7} /> },
  { id: "tour_urbain", label: "Tour urbain", sub: "Circuler en ville", icon: <LayoutGrid size={20} strokeWidth={1.7} /> },
  { id: "longue_distance", label: "Longue distance", sub: "Voyage 1+ semaine", icon: <Globe size={20} strokeWidth={1.7} /> },
];

export default function StepSorties() {
  const router = useRouter();
  const { setOnboardingDraft, onboardingDraft } = useActions();
  const [picked, setPicked] = useState<SortieType[]>(
    onboardingDraft.types_sorties ?? []
  );

  function toggle(id: SortieType) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function next() {
    setOnboardingDraft({ types_sorties: picked });
    router.push("/onboarding/description");
  }

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      <StepHeader
        step={4}
        eyebrow="tes goûts"
        title="Quel type de rides tu aimes ?"
        subtitle="Sélectionne autant que tu veux."
        trailing={
          picked.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 mt-2.5 font-mono text-[10px] uppercase tracking-wider font-bold text-accent bg-accent-soft px-2.5 py-1.5 rounded-md">
              <Check size={10} strokeWidth={3} /> {picked.length} sélectionné
              {picked.length > 1 ? "s" : ""}
            </span>
          ) : null
        }
      />

      <div className="px-6 pt-4 pb-48 flex-1 no-scrollbar overflow-y-auto">
        <div className="grid grid-cols-2 gap-2.5">
          {OPTIONS.map((o) => {
            const active = picked.includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => toggle(o.id)}
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
                  {o.icon}
                </span>
                <div>
                  <div className="font-display font-bold text-[13px] leading-tight">
                    {o.label}
                  </div>
                  <div
                    className={`text-[11px] leading-snug mt-1 ${
                      active ? "text-bg-primary/55" : "text-ink-muted"
                    }`}
                  >
                    {o.sub}
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
      </div>

      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={next}
          disabled={picked.length === 0}
        >
          Continuer <ArrowRight size={16} strokeWidth={2.2} />
        </Button>
      </div>
    </main>
  );
}
