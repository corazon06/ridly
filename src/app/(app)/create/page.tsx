"use client";
import { ChevronLeft, ChevronRight, MapPin, Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { useActions, useConnectionsLists, useMe } from "@/lib/data/api";
import {
  DUREE_LABEL,
  type DureeRide,
  SORTIE_LABEL,
  type SortieType,
  ALLURE_LABEL,
  type AllureRide,
  NIVEAU_LABEL,
  type Niveau,
  type Ride,
} from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function CreateRidePage() {
  const router = useRouter();
  const me = useMe();
  const { upsertRide } = useActions();
  const { reseau } = useConnectionsLists();

  const [pointDepart, setPointDepart] = useState(me?.ville ?? "");
  const [pointArrivee, setPointArrivee] = useState("");
  const [arrets, setArrets] = useState<string[]>([]);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().slice(0, 10);
  });
  const [heure, setHeure] = useState("09:30");
  const [duree, setDuree] = useState<DureeRide>("2h");

  const DUREE_GROUPS: { label: string; values: DureeRide[] }[] = [
    { label: "Heures", values: ["1h", "2h", "3h", "4h"] },
    { label: "Journée", values: ["demi_journee", "journee"] },
    { label: "Plusieurs jours", values: ["2j", "3j", "plus"] },
  ];
  const [sorties, setSorties] = useState<SortieType[]>(["balade", "cafe"]);
  const [places, setPlaces] = useState(8); // min 2, max 15
  const [allure, setAllure] = useState<AllureRide | null>(null);
  const [niveauRequis, setNiveauRequis] = useState<Niveau | "libre">("libre");
  const [mot, setMot] = useState("");
  const [validation, setValidation] = useState(true);

  const valid = pointDepart && date && heure && duree && sorties.length > 0;

  function publish() {
    if (!me || !valid) return;
    const rideId = `r_${Math.random().toString(36).slice(2, 8)}`;
    const ride: Ride = {
      id: rideId,
      createur_id: me.id,
      titre: `${pointDepart}, ${SORTIE_LABEL[sorties[0] ?? "balade"]}`,
      point_depart: pointDepart,
      point_arrivee: pointArrivee || null,
      lat_depart: me.lat,
      lng_depart: me.lng,
      date_ride: date,
      heure_depart: heure,
      duree_estimee: duree,
      type_sortie: sorties,
      nb_places_max: places,
      arrets,
      allure,
      niveau_requis: niveauRequis === "libre" ? null : niveauRequis,
      mot_libre: mot || null,
      validation_manuelle: validation,
      statut: "ouvert",
      participants: [
        {
          id: `p_${Math.random().toString(36).slice(2, 8)}`,
          ride_id: rideId,
          user_id: me.id,
          statut: "accepte",
          note_donnee: null,
        },
      ],
      created_at: new Date().toISOString(),
    };
    upsertRide(ride);
    router.replace(`/rides/${ride.id}`);
  }

  function toggleSortie(s: SortieType) {
    setSorties((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  }

  // Calendar state
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [calOpen, setCalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // 7 quick-pick days
  const quickDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  function prevMonth() {
    setCalMonth((m) => {
      const d = new Date(m);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  }
  function nextMonth() {
    setCalMonth((m) => {
      const d = new Date(m);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  }

  // Build grid: fill leading blanks so Mon = col 0
  const firstDay = new Date(calMonth);
  const lastDay = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0);
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const calCells: (Date | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => {
      const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), i + 1);
      return d;
    }),
  ];

  const dateIsInQuick = date
    ? quickDays.some((d) => d.toISOString().slice(0, 10) === date)
    : false;

  return (
    <main className="min-h-[100dvh] pb-32">
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center justify-between">
        <h1 className="text-h1">Créer un ride</h1>
        <button
          onClick={() => router.back()}
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="px-6 mt-4 space-y-5">
        <div>
          <div className="flex gap-3">
            {/* Ligne itinéraire */}
            <div className="flex flex-col items-center pt-[38px]">
              <div className="h-2.5 w-2.5 rounded-full bg-accent-dark shrink-0" />
              <div className="w-[2px] bg-line my-1" style={{ flex: 1, minHeight: 12 + arrets.length * 62 }} />
              {arrets.map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-ink-muted shrink-0" />
                  <div className="w-[2px] bg-line my-1" style={{ height: 54 }} />
                </div>
              ))}
              <div className="h-2.5 w-2.5 rounded-full border-[2px] border-ink-muted bg-white shrink-0" />
            </div>

            {/* Champs */}
            <div className="flex-1 space-y-2">
              <div>
                <Label>Point de départ</Label>
                <Input
                  value={pointDepart}
                  onChange={(e) => setPointDepart(e.target.value)}
                  placeholder="Place Bellecour, Lyon 2e"
                />
              </div>

              {/* Bouton ajouter un arrêt */}
              <button
                type="button"
                onClick={() => setArrets((p) => [...p, ""])}
                className="w-full h-9 rounded-card bg-accent text-white text-[12px] font-semibold flex items-center justify-center gap-1.5"
              >
                <Plus size={13} strokeWidth={2.5} /> Ajouter un arrêt
              </button>

              {/* Arrêts dynamiques */}
              {arrets.map((a, i) => (
                <div key={i} className="flex gap-1.5 items-center">
                  <Input
                    value={a}
                    onChange={(e) => setArrets((p) => p.map((x, idx) => idx === i ? e.target.value : x))}
                    placeholder={`Arrêt ${i + 1}`}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setArrets((p) => p.filter((_, idx) => idx !== i))}
                    className="h-[46px] w-[46px] rounded-card bg-accent text-bg-primary flex items-center justify-center shrink-0"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              <div>
                <Label>Point d'arrivée <span className="text-ink-muted font-normal">(optionnel)</span></Label>
                <Input
                  value={pointArrivee}
                  onChange={(e) => setPointArrivee(e.target.value)}
                  placeholder="Laisser vide si boucle"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label>Date</Label>

          {/* 7 quick-pick chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 no-scrollbar">
            {quickDays.map((d) => {
              const iso = d.toISOString().slice(0, 10);
              const isSelected = iso === date;
              const isToday = d.getTime() === today.getTime();
              return (
                <button
                  key={iso}
                  onClick={() => { setDate(iso); setCalOpen(false); }}
                  className={`shrink-0 w-[52px] h-16 rounded-card flex flex-col items-center justify-center border transition-colors ${
                    isSelected ? "bg-ink text-white border-ink" : "bg-white border-line"
                  }`}
                >
                  <span className={`font-mono text-[9px] uppercase tracking-wider ${isSelected ? "text-white/70" : "text-ink-muted"}`}>
                    {isToday ? "Auj." : format(d, "EEE", { locale: fr })}
                  </span>
                  <span className="text-label font-bold mt-0.5">{format(d, "d")}</span>
                  <span className={`font-mono text-[9px] ${isSelected ? "text-white/60" : "text-ink-muted"}`}>
                    {format(d, "MMM", { locale: fr })}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bouton calendrier */}
          <button
            onClick={() => setCalOpen((v) => !v)}
            className={`mt-2 w-full h-10 rounded-card border flex items-center justify-center gap-2 text-[13px] font-medium transition-colors ${
              calOpen || (!dateIsInQuick && date)
                ? "bg-ink text-white border-ink"
                : "bg-white border-line text-ink"
            }`}
          >
            <ChevronLeft size={14} className={`transition-transform duration-300 ${calOpen ? "-rotate-90" : "rotate-90"}`} />
            {calOpen ? "Fermer le calendrier" : "Choisir une autre date"}
          </button>

          {/* Calendrier dépliable */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: calOpen ? 400 : 0, opacity: calOpen ? 1 : 0 }}
          >
            <div className="bg-white border border-line rounded-card p-3 mt-2">
              <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="h-8 w-8 rounded-full bg-bg-secondary flex items-center justify-center">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-label capitalize">
                  {format(calMonth, "MMMM yyyy", { locale: fr })}
                </span>
                <button onClick={nextMonth} className="h-8 w-8 rounded-full bg-bg-secondary flex items-center justify-center">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                  <div key={i} className="text-center font-mono text-[10px] uppercase text-ink-muted py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {calCells.map((d, i) => {
                  if (!d) return <div key={`blank-${i}`} />;
                  const iso = d.toISOString().slice(0, 10);
                  const isSelected = iso === date;
                  const isPast = d < today;
                  const isToday = d.getTime() === today.getTime();
                  return (
                    <button
                      key={iso}
                      disabled={isPast}
                      onClick={() => { setDate(iso); setCalOpen(false); }}
                      className={`h-9 w-full rounded-[10px] text-[13px] font-medium transition-colors
                        ${isSelected ? "bg-ink text-white font-bold" : ""}
                        ${isToday && !isSelected ? "border border-accent text-accent" : ""}
                        ${!isSelected && !isToday && !isPast ? "text-ink" : ""}
                        ${isPast ? "text-ink-muted opacity-35 cursor-not-allowed" : ""}
                      `}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {date && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-accent">
              {format(new Date(date), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          )}
        </div>

        <div>
          <Label>Heure de départ</Label>
          <div className="bg-white border border-line rounded-card px-4 py-2">
            <div className="flex items-center justify-center gap-2">
              <ScrollPicker
                values={Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))}
                selected={heure.split(":")[0]}
                onSelect={(v) => setHeure(`${v}:${heure.split(":")[1]}`)}
                label="Heure"
              />
              <span className="font-display font-bold text-[18px] leading-none text-ink-muted pb-3">:</span>
              <ScrollPicker
                values={["00", "15", "30", "45"]}
                selected={heure.split(":")[1]}
                onSelect={(v) => setHeure(`${heure.split(":")[0]}:${v}`)}
                label="Min"
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Durée estimée</Label>
          <div className="space-y-3">
            {DUREE_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted mb-1.5">
                  {group.label}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {group.values.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuree(d)}
                      className={`h-10 px-4 rounded-chip border text-[13px] font-medium transition-colors ${
                        duree === d
                          ? "bg-ink text-white border-ink"
                          : "bg-white border-line text-ink"
                      }`}
                    >
                      {DUREE_LABEL[d]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>
            Type de sortie <span className="text-ink-muted font-normal">(plusieurs choix)</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SORTIE_LABEL) as SortieType[]).map((s) => (
              <button
                key={s}
                onClick={() => toggleSortie(s)}
                className={`px-4 h-9 rounded-chip text-caption font-medium border ${
                  sorties.includes(s)
                    ? s === "longue_distance" ? "bg-[#1A2E4A] text-[#A8C4E0] border-[#1A2E4A]" : "bg-ink text-white border-ink"
                    : s === "longue_distance" ? "bg-[#EEF3F8] text-[#1A2E4A] border-[#BFCFDF]" : "bg-white text-ink border-line"
                }`}
              >
                {SORTIE_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Allure <span className="text-ink-muted font-normal">(optionnel)</span></Label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ALLURE_LABEL) as AllureRide[]).map((a) => (
              <button
                key={a}
                onClick={() => setAllure(allure === a ? null : a)}
                className={`h-11 px-3 rounded-card border-[1.5px] text-[13px] font-semibold text-left transition-colors ${
                  allure === a
                    ? "bg-ink text-bg-primary border-ink"
                    : "bg-white text-ink border-line"
                }`}
              >
                {ALLURE_LABEL[a]}
              </button>
            ))}
          </div>
          <div className="mt-3 bg-ink text-bg-primary rounded-card p-4 flex gap-3">
            <span className="text-[20px] leading-none mt-0.5">🛡️</span>
            <p className="text-[12px] leading-relaxed opacity-80">
              Sois honnête sur l'allure — c'est pas une question d'ego, c'est une question de sécurité. Un(e) motard(e) qui se retrouve dépassé(e) par le rythme du groupe, c'est un risque pour tout le monde. Le bon groupe, c'est celui où tout le monde rentre chez soi.
            </p>
          </div>
        </div>

        <div>
          <Label>Niveau requis</Label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: "libre",        label: "🤝 Libre",        sub: "Ouvert à tou(te)s" },
              { id: "debutant",     label: "✨ " + NIVEAU_LABEL.debutant,     sub: "Permis récent OK" },
              { id: "intermediaire",label: "🔥 " + NIVEAU_LABEL.intermediaire,sub: "Un peu d'expérience" },
              { id: "confirme",     label: "⚡ " + NIVEAU_LABEL.confirme,     sub: "Riders aguerris" },
            ] as { id: Niveau | "libre"; label: string; sub: string }[]).map((n) => (
              <button
                key={n.id}
                onClick={() => setNiveauRequis(n.id)}
                className={`px-3 py-2.5 rounded-card border-[1.5px] text-left transition-colors ${
                  niveauRequis === n.id
                    ? "bg-ink text-bg-primary border-ink"
                    : "bg-white text-ink border-line"
                }`}
              >
                <div className="text-[13px] font-bold leading-tight">{n.label}</div>
                <div className={`text-[11px] mt-0.5 ${niveauRequis === n.id ? "text-bg-primary/60" : "text-ink-muted"}`}>{n.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Nombre max de participant(e)s</Label>
          <div className="flex items-center justify-between bg-white border border-line rounded-card h-14 px-3">
            <button
              onClick={() => setPlaces((p) => Math.max(2, p - 1))}
              className="h-10 w-10 rounded-full bg-bg-secondary flex items-center justify-center"
            >
              <Minus size={18} />
            </button>
            <span className="text-h2">{places} motard(e)s</span>
            <button
              onClick={() => setPlaces((p) => Math.min(15, p + 1))}
              className="h-10 w-10 rounded-full bg-bg-secondary flex items-center justify-center"
            >
              <Plus size={18} />
            </button>
          </div>

          {places === 15 && (
            <div className="mt-3 bg-ink text-bg-primary rounded-card p-4 flex gap-3">
              <span className="text-[22px] leading-none mt-0.5">🤙</span>
              <div>
                <p className="font-display font-bold text-[13px] mb-1">C'est le max, et c'est voulu !</p>
                <p className="text-[12px] leading-relaxed opacity-80">
                  Au-delà de 15 motard(e)s, un groupe devient difficile à gérer sur la route — distances de freinage, insertions, gestion des carrefours… La sécurité de tout le monde en dépend. Si vous êtes plus nombreux, pensez à vous scinder en deux groupes avec un point de rendez-vous. Ride safe 🛡️
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label>
            Mot pour donner envie <span className="text-ink-muted font-normal">(optionnel)</span>
          </Label>
          <Textarea
            rows={3}
            value={mot}
            onChange={(e) => setMot(e.target.value)}
            placeholder="Tranquille, pas de course. On part posé, on s'arrête au sommet pour un café…"
          />
        </div>

        <div className="flex items-center justify-between bg-white border border-line rounded-card p-4">
          <div>
            <p className="text-label">Validation manuelle</p>
            <p className="text-caption text-ink-muted">
              Tu acceptes ou non chaque demande
            </p>
          </div>
          <button
            onClick={() => setValidation((v) => !v)}
            className={`h-7 w-12 rounded-full p-1 transition-colors ${
              validation ? "bg-accent" : "bg-line"
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                validation ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {reseau.length > 0 ? (
          <div className="rounded-card bg-accent-soft p-4 text-caption">
            ⚠ Tes <span className="font-medium">{reseau.length} motard(e)s Ridly</span> seront notifié(e)s
          </div>
        ) : null}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!valid}
          onClick={publish}
          className="mb-8"
        >
          Publier le ride
        </Button>
      </div>
    </main>
  );
}

const ITEM_H = 32;

function ScrollPicker({
  values,
  selected,
  onSelect,
  label,
}: {
  values: string[];
  selected: string;
  onSelect: (v: string) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    if (isScrolling.current) return;
    const idx = values.indexOf(selected);
    if (idx < 0 || !ref.current) return;
    ref.current.scrollTop = idx * ITEM_H;
  }, [selected, values]);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    isScrolling.current = true;
    const idx = Math.round(ref.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(values.length - 1, idx));
    if (values[clamped] !== selected) onSelect(values[clamped]);
    setTimeout(() => { isScrolling.current = false; }, 100);
  }, [values, selected, onSelect]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 overflow-hidden" style={{ height: ITEM_H * 3 }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-white to-transparent z-10" />
        <div
          className="pointer-events-none absolute inset-x-0 z-10 rounded-[8px] bg-ink/[0.06]"
          style={{ top: ITEM_H, height: ITEM_H }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-white to-transparent z-10" />
        <div
          ref={ref}
          onScroll={handleScroll}
          className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
        >
          <div style={{ height: ITEM_H }} />
          {values.map((v) => (
            <div
              key={v}
              className="snap-center flex items-center justify-center cursor-pointer"
              style={{ height: ITEM_H }}
              onClick={() => onSelect(v)}
            >
              <span
                className={`font-display font-bold text-[18px] leading-none tracking-tight transition-all duration-150 ${
                  v === selected ? "text-ink" : "text-ink-muted opacity-30"
                }`}
              >
                {v}
              </span>
            </div>
          ))}
          <div style={{ height: ITEM_H }} />
        </div>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{label}</span>
    </div>
  );
}
