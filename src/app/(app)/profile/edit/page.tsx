"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Check,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { useActions, useMe } from "@/lib/data/api";
import {
  MOTO_TYPE_LABEL,
  NIVEAU_LABEL,
  SORTIE_LABEL,
  MotoType,
  Niveau,
  SortieType,
  SexeOption,
} from "@/lib/types";

const MOTO_TYPES: MotoType[] = ["roadster", "trail", "sportive", "touring", "cafe_racer", "custom"];
const NIVEAUX: Niveau[] = ["debutant", "intermediaire", "confirme"];
const SORTIES: SortieType[] = ["balade", "road_trip", "cafe", "cols", "matinale", "twisty", "tour_urbain", "longue_distance"];
const SEXES: { value: SexeOption; label: string }[] = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "prefere_ne_pas_dire", label: "Non précisé" },
];

export default function ProfileEditPage() {
  const router = useRouter();
  const me = useMe();
  const { upsertUser } = useActions();

  const [prenom, setPrenom] = useState(me?.prenom ?? "");
  const [dateNaissance, setDateNaissance] = useState(me?.date_naissance ?? "");
  const [ville, setVille] = useState(me?.ville ?? "");
  const [sexe, setSexe] = useState<SexeOption>(me?.sexe ?? "prefere_ne_pas_dire");
  const [motoType, setMotoType] = useState<MotoType>(me?.moto_type ?? "roadster");
  const [niveau, setNiveau] = useState<Niveau>(me?.niveau ?? "intermediaire");
  const [motoMarque, setMotoMarque] = useState(me?.moto_marque ?? "");
  const [motoModele, setMotoModele] = useState(me?.moto_modele ?? "");
  const [motoAnnee, setMotoAnnee] = useState(me?.moto_annee ? String(me.moto_annee) : "");
  const [sorties, setSorties] = useState<SortieType[]>(me?.types_sorties ?? []);
  const [description, setDescription] = useState(me?.description ?? "");
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(me?.photo_url ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  if (!me) return null;

  function toggleSortie(s: SortieType) {
    setSorties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function handleSave() {
    upsertUser({
      ...me!,
      prenom,
      date_naissance: dateNaissance,
      ville,
      sexe,
      moto_type: motoType,
      niveau,
      moto_marque: motoMarque || null,
      moto_modele: motoModele || null,
      moto_annee: motoAnnee ? Number(motoAnnee) : null,
      types_sorties: sorties,
      description: description || null,
      photo_url: photoPreview,
    });
    setSaved(true);
    setTimeout(() => router.push("/profile"), 800);
  }

  return (
    <main className="min-h-[100dvh] pb-36">
      {/* Header */}
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
        <h1 className="text-label">Modifier mon profil</h1>
        <div className="w-9" />
      </div>

      <div className="px-6 space-y-7 mt-2">

        {/* ── Section 1 — Photo ── */}
        <section>
          <SectionTitle num="1" title="Photo de profil" />
          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="relative">
              <Avatar src={photoPreview} name={me.prenom} size="xl" />
              <button
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-ink flex items-center justify-center text-bg-primary shadow-md"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={14} strokeWidth={2} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <p className="text-caption text-ink-muted text-center">
              Tap pour changer la photo
            </p>
          </div>
        </section>

        {/* ── Section 2 — Infos personnelles ── */}
        <section>
          <SectionTitle num="2" title="Informations personnelles" />
          <div className="mt-4 space-y-3">
            <Field label="Prénom">
              <input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full px-4 py-3 rounded-card border border-line bg-white text-ink text-[14px] focus:outline-none focus:border-accent"
                placeholder="Ton prénom"
              />
            </Field>

            <Field label="Date de naissance">
              <input
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="w-full px-4 py-3 rounded-card border border-line bg-white text-ink text-[14px] focus:outline-none focus:border-accent box-border"
              />
            </Field>

            <Field label="Ville">
              <input
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                className="w-full px-4 py-3 rounded-card border border-line bg-white text-ink text-[14px] focus:outline-none focus:border-accent"
                placeholder="Ta ville"
              />
            </Field>

            <Field label="Genre">
              <div className="flex gap-2">
                {SEXES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSexe(s.value)}
                    className={`flex-1 py-2.5 rounded-card text-[13px] font-display font-bold border transition-colors ${
                      sexe === s.value
                        ? "bg-ink text-bg-primary border-ink"
                        : "bg-white text-ink border-line"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </section>

        {/* ── Section 3 — Ma moto ── */}
        <section>
          <SectionTitle num="3" title="Ma moto" />
          <div className="mt-4 space-y-4">
            <Field label="Type de moto">
              <div className="grid grid-cols-3 gap-2">
                {MOTO_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setMotoType(t)}
                    className={`py-2.5 px-2 rounded-card text-[12px] font-display font-bold border transition-colors text-center ${
                      motoType === t
                        ? "bg-ink text-bg-primary border-ink"
                        : "bg-white text-ink border-line"
                    }`}
                  >
                    {MOTO_TYPE_LABEL[t]}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Niveau">
              <div className="flex gap-2">
                {NIVEAUX.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNiveau(n)}
                    className={`flex-1 py-2.5 rounded-card text-[13px] font-display font-bold border transition-colors ${
                      niveau === n
                        ? "bg-accent text-bg-primary border-accent"
                        : "bg-white text-ink border-line"
                    }`}
                  >
                    {NIVEAU_LABEL[n]}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Marque">
                <input
                  value={motoMarque}
                  onChange={(e) => setMotoMarque(e.target.value)}
                  className="w-full px-4 py-3 rounded-card border border-line bg-white text-ink text-[14px] focus:outline-none focus:border-accent"
                  placeholder="Ex : Honda"
                />
              </Field>
              <Field label="Modèle">
                <input
                  value={motoModele}
                  onChange={(e) => setMotoModele(e.target.value)}
                  className="w-full px-4 py-3 rounded-card border border-line bg-white text-ink text-[14px] focus:outline-none focus:border-accent"
                  placeholder="Ex : CB650R"
                />
              </Field>
            </div>

            <Field label="Année (optionnel)">
              <input
                type="number"
                value={motoAnnee}
                onChange={(e) => setMotoAnnee(e.target.value)}
                className="w-full px-4 py-3 rounded-card border border-line bg-white text-ink text-[14px] focus:outline-none focus:border-accent"
                placeholder="Ex : 2022"
                min={1950}
                max={2030}
              />
            </Field>
          </div>
        </section>

        {/* ── Section 4 — Préférences de ride ── */}
        <section>
          <SectionTitle num="4" title="Mes préférences de ride" />
          <div className="mt-4">
            <p className="text-caption text-ink-muted mb-3">Types de sorties préférées</p>
            <div className="flex flex-wrap gap-2">
              {SORTIES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSortie(s)}
                  className={`px-3 py-1.5 rounded-chip text-[12px] font-display font-bold border transition-colors ${
                    sorties.includes(s)
                      ? "bg-ink text-bg-primary border-ink"
                      : "bg-white text-ink border-line"
                  }`}
                >
                  {SORTIE_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5 — Description ── */}
        <section>
          <SectionTitle num="5" title="Description" />
          <div className="mt-4 relative">
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 250) setDescription(e.target.value);
              }}
              rows={4}
              className="w-full px-4 py-3 rounded-card border border-line bg-white text-ink text-[14px] focus:outline-none focus:border-accent resize-none"
              placeholder="Parle un peu de toi, de ta façon de rouler…"
            />
            <span className="absolute bottom-3 right-3 text-[11px] text-ink-muted font-mono">
              {description.length}/250
            </span>
          </div>
        </section>

      </div>

      {/* ── Actions fixées en bas ── */}
      <div
        className="fixed bottom-0 left-0 right-0 mx-auto px-[22px] pb-24 pt-3 sticky-bottom-fade"
        style={{ maxWidth: 440 }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? (
            <span className="flex items-center gap-2">
              <Check size={16} /> Enregistré !
            </span>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
        <button
          onClick={() => router.back()}
          className="w-full text-center text-caption text-ink-muted mt-3"
        >
          Annuler
        </button>
      </div>
    </main>
  );
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-6 w-6 rounded-full bg-ink text-bg-primary flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
        {num}
      </span>
      <h2 className="text-label">{title}</h2>
      <div className="flex-1 h-px bg-line" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-caption text-ink-muted mb-1.5">{label}</p>
      {children}
    </div>
  );
}
