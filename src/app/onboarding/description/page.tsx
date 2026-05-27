"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useActions } from "@/lib/data/api";
import { ME_ID } from "@/lib/mock/fixtures";
import { useMock } from "@/lib/mock/store";

const MAX = 250;

export default function StepDescription() {
  const router = useRouter();
  const { setOnboardingDraft, onboardingDraft, setMe, upsertUser } = useActions();
  const me = useMock((s) => s.users.find((u) => u.id === ME_ID));
  const [text, setText] = useState(onboardingDraft.description ?? "");
  function finish() {
    const draft = { ...onboardingDraft, description: text };
    setOnboardingDraft({ description: text });
    // Apply draft data onto Maxime's profile (mock: no real user creation)
    if (me) {
      upsertUser({
        ...me,
        ...(draft.prenom && { prenom: draft.prenom }),
        ...(draft.date_naissance && { date_naissance: draft.date_naissance }),
        ...(draft.ville && { ville: draft.ville }),
        ...(draft.sexe && { sexe: draft.sexe }),
        ...(draft.moto_type && { moto_type: draft.moto_type }),
        ...(draft.moto_marque !== undefined && { moto_marque: draft.moto_marque }),
        ...(draft.moto_modele !== undefined && { moto_modele: draft.moto_modele }),
        ...(draft.types_sorties && { types_sorties: draft.types_sorties }),
        ...(draft.gouts !== undefined && { gouts: draft.gouts }),
        ...(draft.description !== undefined && { description: draft.description || null }),
        ...(draft.photo_url && { photo_url: draft.photo_url }),
        ...(draft.niveau && { niveau: draft.niveau }),
      });
    }
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
