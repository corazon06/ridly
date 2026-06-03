"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Camera, Image as ImageIcon, X } from "lucide-react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/ui/Button";
import { useActions } from "@/lib/data/api";

export default function StepPhotoMoto() {
  const router = useRouter();
  const { setOnboardingDraft, onboardingDraft } = useActions();
  const [src, setSrc] = useState<string | null>(
    onboardingDraft.moto_photo_url ?? null
  );

  function handleFile(f: File | null) {
    if (!f) return;
    setSrc(URL.createObjectURL(f));
  }

  function next() {
    setOnboardingDraft({ moto_photo_url: src ?? null });
    router.push("/onboarding/sorties");
  }

  const marque = onboardingDraft.moto_marque;
  const modele = onboardingDraft.moto_modele;
  const motoLabel = marque && modele ? `${marque} ${modele}` : marque || "ta moto";

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      <StepHeader
        step={4}
        eyebrow="photo de ta moto"
        title={`Une photo de ${motoLabel}`}
        subtitle="Elle sera affichée sur ton profil. Montre-la sous son meilleur angle !"
      />

      <div className="px-6 pt-2 pb-48 flex-1 no-scrollbar overflow-y-auto">
        <div className="relative mx-auto h-[220px] w-[220px] rounded-[28px] bg-bg-secondary border-[2.5px] border-dashed border-accent flex items-center justify-center mt-5 overflow-hidden">
          <div
            className="absolute inset-[-10px] rounded-[28px] -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(178,82,52,0.08) 0%, transparent 70%)",
            }}
          />
          {src ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSrc(null)}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center text-ink shadow-card"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink-muted">
              <Camera size={36} strokeWidth={1.5} className="text-accent" />
              <p className="text-[12px] font-display font-bold">Photo de la moto</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-6">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <div className="h-[46px] rounded-card-sm bg-ink text-bg-primary font-display font-bold text-[13px] flex items-center justify-center gap-2 shadow-cta">
              <Camera size={14} strokeWidth={1.9} /> Prendre une photo
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
          onClick={() => router.push("/onboarding/sorties")}
          className="w-full text-center text-[13px] font-semibold text-ink-muted underline"
        >
          Passer cette étape
        </button>
      </div>
    </main>
  );
}
