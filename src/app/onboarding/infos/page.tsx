"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, MapPin, User as UserIcon } from "lucide-react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Tag";
import { useActions } from "@/lib/data/api";
import type { SexeOption } from "@/lib/types";

const VILLES = [
  { name: "Lyon", region: "Rhône — 69000", lat: 45.764, lng: 4.836 },
  { name: "Lyon-Saint-Exupéry", region: "Rhône — 69125", lat: 45.726, lng: 5.09 },
  { name: "Villeurbanne", region: "Rhône — 69100", lat: 45.766, lng: 4.879 },
  { name: "Caluire", region: "Rhône — 69300", lat: 45.794, lng: 4.846 },
];

const MONTHS = [
  "Janv.",
  "Févr.",
  "Mars",
  "Avr.",
  "Mai",
  "Juin",
  "Juil.",
  "Août",
  "Sept.",
  "Oct.",
  "Nov.",
  "Déc.",
];

export default function StepInfos() {
  const router = useRouter();
  const { setOnboardingDraft, onboardingDraft } = useActions();

  const [prenom, setPrenom] = useState(onboardingDraft.prenom ?? "");
  const [day, setDay] = useState("");
  const [monthIdx, setMonthIdx] = useState("");
  const [year, setYear] = useState("");
  const [ville, setVille] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [sexe, setSexe] = useState<SexeOption | null>(onboardingDraft.sexe ?? null);

  const valid =
    prenom.trim().length > 1 && day && monthIdx && year && ville && sexe;

  function next() {
    if (!valid) return;
    const m = String(Number(monthIdx) + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    setOnboardingDraft({
      prenom,
      date_naissance: `${year}-${m}-${d}`,
      ville: ville!.name,
      lat: ville!.lat,
      lng: ville!.lng,
      sexe: sexe!,
    });
    router.push("/onboarding/moto");
  }

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      <StepHeader
        step={2}
        eyebrow="toi"
        title="Parle-nous de toi"
        subtitle="Ces infos aident à matcher avec les bons riders."
      />

      <div className="px-6 pt-3 pb-48 flex-1 no-scrollbar overflow-y-auto">
        {/* Prénom */}
        <div className="mb-4">
          <Label>Prénom</Label>
          <Input
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Maxime"
            forceFocused={prenom.length > 0}
            icon={
              <UserIcon
                size={16}
                strokeWidth={1.8}
                className={prenom.length > 0 ? "text-accent" : ""}
              />
            }
          />
        </div>

        {/* Date de naissance */}
        <div className="mb-4">
          <Label>
            Date de naissance{" "}
            <span className="font-medium text-[11px] text-ink-muted">(18+ requis)</span>
          </Label>
          <div className="grid grid-cols-[1fr_1fr_1.2fr] gap-1.5">
            <Input
              placeholder="14"
              inputMode="numeric"
              maxLength={2}
              value={day}
              onChange={(e) => setDay(e.target.value.replace(/\D/g, ""))}
              className="px-3"
            />
            <div className="relative">
              <select
                value={monthIdx}
                onChange={(e) => setMonthIdx(e.target.value)}
                className={`appearance-none w-full h-[46px] pl-3 pr-8 rounded-card-sm border-[1.5px] bg-white text-[14px] font-medium outline-none cursor-pointer transition-shadow ${
                  monthIdx
                    ? "border-ink text-ink shadow-[0_0_0_3px_rgba(42,38,36,0.06)]"
                    : "border-line text-ink-muted focus:border-ink focus:shadow-[0_0_0_3px_rgba(42,38,36,0.06)]"
                }`}
              >
                <option value="">Mois</option>
                {MONTHS.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                strokeWidth={2}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
              />
            </div>
            <Input
              placeholder="1995"
              inputMode="numeric"
              maxLength={4}
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
              className="px-3"
            />
          </div>
        </div>

        {/* Ville */}
        <div className="mb-4">
          <Label>Ville</Label>
          <Input
            value={ville?.name ?? ""}
            placeholder="Lyon"
            readOnly
            icon={<MapPin size={16} strokeWidth={1.9} className="text-accent" />}
            trailing={
              <span className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-accent bg-accent-soft px-2 py-1 rounded-md">
                GPS
              </span>
            }
          />
          <div className="mt-1.5 bg-white border border-line rounded-[12px] overflow-hidden">
            {VILLES.map((v, i) => (
              <button
                key={v.name}
                onClick={() => setVille(v)}
                className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium ${
                  i < VILLES.length - 1 ? "border-b border-line" : ""
                } ${ville?.name === v.name ? "bg-bg-secondary" : ""}`}
              >
                <span className="h-[22px] w-[22px] rounded-md bg-bg-secondary flex items-center justify-center text-accent shrink-0">
                  <MapPin size={11} strokeWidth={2} />
                </span>
                <span>
                  <b className="font-bold text-ink">{v.name}</b>
                  <span className="text-ink-soft">, {v.region}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sexe */}
        <div>
          <Label>
            Sexe{" "}
            <span className="font-medium text-[11px] text-ink-muted">(privé par défaut)</span>
          </Label>
          <div className="flex flex-wrap gap-1.5">
            <Chip active={sexe === "homme"} onClick={() => setSexe("homme")}>
              Homme
            </Chip>
            <Chip active={sexe === "femme"} onClick={() => setSexe("femme")}>
              Femme
            </Chip>
            <Chip
              active={sexe === "prefere_ne_pas_dire"}
              onClick={() => setSexe("prefere_ne_pas_dire")}
            >
              Préfère ne pas dire
            </Chip>
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!valid}
          onClick={next}
        >
          Continuer <ArrowRight size={16} strokeWidth={2.2} />
        </Button>
      </div>
    </main>
  );
}
