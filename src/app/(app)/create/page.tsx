"use client";
import { ChevronLeft, ChevronRight, MapPin, Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { useActions, useConnectionsLists, useMe } from "@/lib/data/api";
import {
  DUREE_LABEL,
  type DureeRide,
  SORTIE_LABEL,
  type SortieType,
  type Ride,
} from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function CreateRidePage() {
  const router = useRouter();
  const me = useMe();
  const { upsertRide } = useActions();
  const { reseau } = useConnectionsLists();

  const [pointDepart, setPointDepart] = useState("Place Bellecour, Lyon 2e");
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
  const [places, setPlaces] = useState(8);
  const [mot, setMot] = useState("");
  const [validation, setValidation] = useState(true);

  const valid = pointDepart && date && heure && duree;

  function publish() {
    if (!me || !valid) return;
    const ride: Ride = {
      id: `r_${Math.random().toString(36).slice(2, 8)}`,
      createur_id: me.id,
      titre: `${pointDepart}, ${SORTIE_LABEL[sorties[0] ?? "balade"]}`,
      point_depart: pointDepart,
      lat_depart: me.lat,
      lng_depart: me.lng,
      date_ride: date,
      heure_depart: heure,
      duree_estimee: duree,
      type_sortie: sorties,
      nb_places_max: places,
      mot_libre: mot || null,
      validation_manuelle: validation,
      statut: "ouvert",
      participants: [
        {
          id: `p_${Math.random().toString(36).slice(2, 8)}`,
          ride_id: "",
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
          <Label>Point de départ</Label>
          <Input
            icon={<MapPin size={18} className="text-accent-dark" />}
            value={pointDepart}
            onChange={(e) => setPointDepart(e.target.value)}
          />
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
          <div className="bg-white border border-line rounded-card p-4">
            <div className="flex items-center justify-center gap-6">

              {/* Heures */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => {
                    const [h, m] = heure.split(":").map(Number);
                    setHeure(`${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
                  }}
                  className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center"
                >
                  <ChevronLeft size={16} className="-rotate-90" />
                </button>
                <span className="font-display font-bold text-[40px] leading-none tracking-tight w-16 text-center">
                  {heure.split(":")[0]}
                </span>
                <button
                  onClick={() => {
                    const [h, m] = heure.split(":").map(Number);
                    setHeure(`${String((h - 1 + 24) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
                  }}
                  className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center"
                >
                  <ChevronLeft size={16} className="rotate-90" />
                </button>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Heure</span>
              </div>

              <span className="font-display font-bold text-[40px] leading-none text-ink-muted mb-6">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => {
                    const [h, m] = heure.split(":").map(Number);
                    setHeure(`${String(h).padStart(2, "0")}:${String((m + 15) % 60).padStart(2, "0")}`);
                  }}
                  className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center"
                >
                  <ChevronLeft size={16} className="-rotate-90" />
                </button>
                <span className="font-display font-bold text-[40px] leading-none tracking-tight w-16 text-center">
                  {heure.split(":")[1]}
                </span>
                <button
                  onClick={() => {
                    const [h, m] = heure.split(":").map(Number);
                    setHeure(`${String(h).padStart(2, "0")}:${String((m - 15 + 60) % 60).padStart(2, "0")}`);
                  }}
                  className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center"
                >
                  <ChevronLeft size={16} className="rotate-90" />
                </button>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Minutes</span>
              </div>
            </div>

            {/* Raccourcis horaires */}
            <div className="flex gap-2 justify-center mt-4 flex-wrap">
              {["07:00", "08:00", "09:00", "09:30", "10:00", "14:00"].map((h) => (
                <button
                  key={h}
                  onClick={() => setHeure(h)}
                  className={`px-3 h-8 rounded-chip border text-[12px] font-medium transition-colors ${
                    heure === h ? "bg-ink text-white border-ink" : "bg-bg-secondary border-transparent text-ink"
                  }`}
                >
                  {h}
                </button>
              ))}
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
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-ink border-line"
                }`}
              >
                {SORTIE_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Nombre max de participants</Label>
          <div className="flex items-center justify-between bg-white border border-line rounded-card h-14 px-3">
            <button
              onClick={() => setPlaces((p) => Math.max(1, p - 1))}
              className="h-10 w-10 rounded-full bg-bg-secondary flex items-center justify-center"
            >
              <Minus size={18} />
            </button>
            <span className="text-h2">{places} motards</span>
            <button
              onClick={() => setPlaces((p) => Math.min(15, p + 1))}
              className="h-10 w-10 rounded-full bg-bg-secondary flex items-center justify-center"
            >
              <Plus size={18} />
            </button>
          </div>
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
            ⚠ Tes <span className="font-medium">{reseau.length} amis Ridly</span> seront notifiés
          </div>
        ) : null}
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 mx-auto px-[22px] pb-24 pt-3 sticky-bottom-fade"
        style={{ maxWidth: 440 }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!valid}
          onClick={publish}
        >
          Publier le ride
        </Button>
      </div>
    </main>
  );
}
