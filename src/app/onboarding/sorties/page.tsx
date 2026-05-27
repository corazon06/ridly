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
  Plus,
  Smile,
  Sun,
  Waves,
  X,
} from "lucide-react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/ui/Button";
import { useActions } from "@/lib/data/api";
import { type SortieType } from "@/lib/types";

const GOUTS = [
  "Chill 😌", "Sportif 🏁", "Découverte 🗺️", "Social 🤝",
  "Solitaire 🎧", "Nature 🌿", "Gastronomie 🍽️", "Photo / Vidéo 📸",
  "Technique 🔧", "Nocturne 🌙",
];

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
  const [picked, setPicked] = useState<SortieType[]>(onboardingDraft.types_sorties ?? []);
  const [gouts, setGouts] = useState<string[]>([]);
  const [autreOpen, setAutreOpen] = useState(false);
  const [autreText, setAutreText] = useState("");

  function toggle(id: SortieType) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function toggleGout(g: string) {
    setGouts((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]);
  }

  function addAutre() {
    const val = autreText.trim();
    if (!val || gouts.includes(val)) return;
    setGouts((p) => [...p, val]);
    setAutreText("");
    setAutreOpen(false);
  }

  function next() {
    setOnboardingDraft({
      types_sorties: picked,
      gouts,
    });
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

        {/* Mes goûts */}
        <div className="mt-7">
          <p className="text-label mb-1">Mes goûts</p>
          <p className="text-[12px] text-ink-muted mb-3">Ce qui te définit au-delà du type de ride.</p>
          <div className="flex flex-wrap gap-2">
            {/* Prédéfinis */}
            {GOUTS.map((g) => {
              const active = gouts.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGout(g)}
                  className={`px-3.5 py-2 rounded-chip text-[13px] font-display font-bold border-[1.5px] transition-colors ${
                    active ? "bg-ink text-bg-primary border-ink" : "bg-white text-ink border-line"
                  }`}
                >
                  {active && <Check size={11} strokeWidth={3} className="inline mr-1" />}
                  {g}
                </button>
              );
            })}

            {/* Étiquettes custom ajoutées via "Autre" */}
            {gouts.filter((g) => !GOUTS.includes(g)).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGout(g)}
                className="px-3.5 py-2 rounded-chip text-[13px] font-display font-bold border-[1.5px] bg-ink text-bg-primary border-ink"
              >
                <Check size={11} strokeWidth={3} className="inline mr-1" />
                {g}
              </button>
            ))}

            {/* Bouton + Autre / champ texte */}
            {!autreOpen ? (
              <button
                type="button"
                onClick={() => setAutreOpen(true)}
                className="px-3.5 py-2 rounded-chip text-[13px] font-display font-bold border-[1.5px] border-dashed border-line text-ink-muted flex items-center gap-1.5"
              >
                <Plus size={13} strokeWidth={2.5} /> Autre
              </button>
            ) : (
              <div className="flex items-center gap-1.5 w-full mt-1">
                <input
                  autoFocus
                  value={autreText}
                  onChange={(e) => setAutreText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAutre()}
                  placeholder="Écris ton goût…"
                  className="flex-1 h-10 px-3 rounded-chip border-[1.5px] border-ink text-[13px] font-display outline-none"
                />
                <button type="button" onClick={addAutre} className="h-10 w-10 rounded-chip bg-ink flex items-center justify-center text-bg-primary">
                  <Check size={14} strokeWidth={2.5} />
                </button>
                <button type="button" onClick={() => { setAutreOpen(false); setAutreText(""); }} className="h-10 w-10 rounded-chip bg-bg-secondary flex items-center justify-center text-ink-muted">
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade space-y-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={next}
          disabled={picked.length === 0}
        >
          Continuer <ArrowRight size={16} strokeWidth={2.2} />
        </Button>
        <button
          onClick={() => router.push("/onboarding/description")}
          className="w-full text-center text-[13px] font-semibold text-ink-muted underline"
        >
          Passer cette étape
        </button>
      </div>
    </main>
  );
}
