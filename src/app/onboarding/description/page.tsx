"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useActions } from "@/lib/data/api";
import { ME_ID } from "@/lib/mock/fixtures";

const SUGGESTIONS = ["Chill", "Confirmé", "Sortie week-end", "Café", "Matinal", "Twisty"];
const MAX = 250;

export default function StepDescription() {
  const router = useRouter();
  const { setOnboardingDraft, onboardingDraft, setMe } = useActions();
  const [text, setText] = useState(onboardingDraft.description ?? "");
  const [picked, setPicked] = useState<string[]>([]);

  function toggle(s: string) {
    const has = picked.includes(s);
    setPicked((p) => (has ? p.filter((x) => x !== s) : [...p, s]));
    if (!has && !text.toLowerCase().includes(s.toLowerCase())) {
      setText((t) => (t ? `${t} ${s}` : s).slice(0, MAX));
    }
  }

  function finish() {
    setOnboardingDraft({ description: text });
    // For the demo we sign in as Maxime so the new user lands on a
    // populated session. Real signup would persist `onboardingDraft` first.
    setMe(ME_ID);
    router.replace("/onboarding/tutorial");
  }

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      <StepHeader
        step={5}
        eyebrow="dernière touche"
        title="Présente-toi en quelques mots"
        subtitle="Optionnel, mais ça aide à briser la glace."
      />

      <div className="px-6 pt-4 pb-56 flex-1 no-scrollbar overflow-y-auto">
        <div
          className="bg-white rounded-card border-[1.5px] border-ink p-4 min-h-[170px] flex flex-col"
          style={{ boxShadow: "0 0 0 3px rgba(42,38,36,0.06)" }}
        >
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            rows={5}
            placeholder="Je roule depuis 5 ans, plutôt cool en groupe, j'aime les pauses café et les beaux paysages."
            className="border-0 p-0 shadow-none focus:shadow-none"
          />
          <div className="border-t border-bg-secondary mt-2 pt-2 text-right font-mono text-[10.5px] tracking-wide text-ink-muted font-semibold">
            <b className="text-ink font-bold">{text.length}</b> / {MAX}
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted mt-5 mb-2.5">
          Suggestions — clic pour ajouter
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => {
            const active = picked.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(s)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-chip text-[13px] font-semibold border-[1.5px] ${
                  active
                    ? "bg-accent-soft border-accent/30 text-accent-dark"
                    : "bg-white border-line text-ink"
                }`}
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full inline-flex items-center justify-center text-[11px] font-extrabold leading-none ${
                    active ? "bg-accent text-bg-primary" : "bg-accent-soft text-accent"
                  }`}
                >
                  {active ? <Check size={9} strokeWidth={4} /> : <Plus size={9} strokeWidth={4} />}
                </span>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade space-y-2">
        <Button variant="primary" size="lg" fullWidth onClick={finish}>
          Terminer mon profil <Check size={16} strokeWidth={2.2} />
        </Button>
        <button
          onClick={finish}
          className="w-full text-center text-[13px] font-semibold text-ink-muted underline"
        >
          Passer cette étape
        </button>
      </div>
    </main>
  );
}
