"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Camera,
  Check,
  Image as ImageIcon,
  ShieldCheck,
  X,
} from "lucide-react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/ui/Button";
import { useActions } from "@/lib/data/api";

export default function StepPhoto() {
  const router = useRouter();
  const { setOnboardingDraft, onboardingDraft } = useActions();
  const [src, setSrc] = useState<string | null>(onboardingDraft?.photo_url ?? null);

  function handleFile(f: File | null) {
    if (!f) return;
    setSrc(URL.createObjectURL(f));
  }

  function next() {
    setOnboardingDraft({
      photo_url: src ?? "https://i.pravatar.cc/300?u=onboard",
    });
    router.push("/onboarding/infos");
  }

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      <StepHeader
        step={1}
        eyebrow="ta photo"
        title="On a besoin de voir ta tête"
        subtitle="Pour la confiance entre motard(e)s. Aucune photo retouchée acceptée."
      />

      <div className="px-6 pt-2 pb-48 flex-1 no-scrollbar overflow-y-auto">
        <div className="relative mx-auto h-[220px] w-[220px] rounded-full bg-bg-secondary border-[2.5px] border-dashed border-accent flex items-center justify-center mt-5 overflow-hidden">
          <div
            className="absolute inset-[-10px] rounded-full -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(178,82,52,0.08) 0%, transparent 70%)",
            }}
          />
          {src ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setSrc(null)}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center text-ink shadow-card"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <div className="h-[74px] w-[74px] rounded-full bg-bg-primary flex items-center justify-center shadow-card">
              <Camera size={32} strokeWidth={1.7} className="text-accent" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-6">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <div className="h-[46px] rounded-card-sm bg-ink text-bg-primary font-display font-bold text-[13px] flex items-center justify-center gap-2 shadow-cta">
              <Camera size={14} strokeWidth={1.9} /> Selfie
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <div className="h-[46px] rounded-card-sm glass-pill text-ink font-display font-bold text-[13px] flex items-center justify-center gap-2">
              <ImageIcon size={14} strokeWidth={1.9} /> Galerie
            </div>
          </label>
        </div>

        <div className="mt-6 rounded-card-sm bg-bg-secondary p-3.5 flex gap-2.5 items-start">
          <span className="h-8 w-8 rounded-[9px] bg-accent text-bg-primary flex items-center justify-center shrink-0">
            <ShieldCheck size={14} strokeWidth={2} />
          </span>
          <p className="text-[12.5px] leading-snug text-ink-soft">
            <span className="font-bold text-ink">Vérification manuelle sous 24 h.</span>{" "}
            Une vraie personne regarde, pas un algo. Tes données restent en France.
          </p>
        </div>

        <ul className="mt-3.5 px-1 text-[11.5px] leading-relaxed text-ink-muted space-y-0.5">
          <li className="flex items-center gap-1.5">
            <Check size={11} strokeWidth={3} className="text-success" /> Visage clair, bien éclairé
          </li>
          <li className="flex items-center gap-1.5">
            <Check size={11} strokeWidth={3} className="text-success" /> Toi seul·e sur la photo
          </li>
          <li className="flex items-center gap-1.5">
            <X size={11} strokeWidth={3} className="text-accent" /> Pas de filtres, pas de retouche
          </li>
        </ul>
      </div>

      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade space-y-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!src}
          onClick={next}
        >
          Continuer <ArrowRight size={16} strokeWidth={2.2} />
        </Button>
        <button
          onClick={() => router.push("/onboarding/infos")}
          className="w-full text-center text-[13px] font-semibold text-ink-muted underline"
        >
          Passer cette étape
        </button>
      </div>
    </main>
  );
}
