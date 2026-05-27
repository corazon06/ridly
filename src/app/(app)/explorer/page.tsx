"use client";
import { Bell, Filter, Search, Users, Bike, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/ui/Tag";
import { Sheet } from "@/components/ui/Sheet";
import { RangeSlider, Slider } from "@/components/ui/RangeSlider";
import { Button } from "@/components/ui/Button";
import { RiderCard } from "@/components/rider/RiderCard";
import { Avatar } from "@/components/ui/Avatar";
import {
  useMe,
  useNearbyRiders,
  useSuggestions,
  useUnreadNotificationsCount,
} from "@/lib/data/api";
import {
  DUREE_LABEL,
  MOTO_TYPE_LABEL,
  type MotoType,
  NIVEAU_LABEL,
  type Niveau,
  SORTIE_LABEL,
  type SortieType,
} from "@/lib/types";
import { useMock } from "@/lib/mock/store";
import { RideCard } from "@/components/ride/RideCard";

const FILTERS = ["A proximité", "Trail", "Intermédiaire", "Balade", "Café / Apéro", "Twisty"];

type ExplorerMode = "riders" | "rides";

export default function ExplorerPage() {
  const me = useMe();
  const [mode, setMode] = useState<ExplorerMode>("riders");
  const all = useNearbyRiders();
  const suggestions = useSuggestions();
  const unread = useUnreadNotificationsCount();
  // Horloge live — mise à jour toutes les 10 s
  const [clock, setClock] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setClock(d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    }, 10_000);
    return () => clearInterval(id);
  }, []);

  const [active, setActive] = useState("A proximité");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(60);
  const [motos, setMotos] = useState<MotoType[]>([]);
  const [sorties, setSorties] = useState<SortieType[]>([]);

  const toggleMoto = (m: MotoType) =>
    setMotos((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  const toggleSortie = (s: SortieType) =>
    setSorties((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const resetFilters = () => {
    setMaxDistance(50);
    setMinAge(18);
    setMaxAge(60);
    setMotos([]);
    setSorties([]);
  };

  const filtered = useMemo(() => {
    return all.filter((r) => {
      if (motos.length > 0 && (!r.moto_type || !motos.includes(r.moto_type))) return false;
      if (sorties.length > 0 && !r.types_sorties.some((s) => sorties.includes(s))) return false;
      if (active === "Trail" && r.moto_type !== "trail") return false;
      if (active === "Intermédiaire" && r.niveau !== "intermediaire") return false;
      if (active === "Balade" && !r.types_sorties.includes("balade")) return false;
      if (active === "Café / Apéro" && !r.types_sorties.includes("cafe")) return false;
      if (active === "Twisty" && !r.types_sorties.includes("twisty")) return false;
      return true;
    });
  }, [all, active, motos, sorties]);

  const onlineCount = filtered.filter((r) => r.is_online).length;

  // — Rides mode —
  const allRides = useMock((s) => s.rides).filter((r) => r.statut === "ouvert");
  const users = useMock((s) => s.users);
  const [ridesFiltersOpen, setRidesFiltersOpen] = useState(false);
  const [rideDistance, setRideDistance] = useState(50);
  const [rideDateFilter, setRideDateFilter] = useState<"today" | "week" | "month" | null>(null);
  const [rideSorties, setRideSorties] = useState<SortieType[]>([]);
  const [rideNiveau, setRideNiveau] = useState<Niveau | null>(null);
  const [ridePlaces, setRidePlaces] = useState<"all" | "1+" | "3+">("all");
  const [rideVerifie, setRideVerifie] = useState(false);
  const [rideMinAge, setRideMinAge] = useState(18);
  const [rideMaxAge, setRideMaxAge] = useState(60);

  const toggleRideSortie = (s: SortieType) =>
    setRideSorties((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const resetRidesFilters = () => {
    setRideDistance(50);
    setRideMinAge(18);
    setRideMaxAge(60);
    setRideDateFilter(null);
    setRideSorties([]);
    setRideNiveau(null);
    setRidePlaces("all");
    setRideVerifie(false);
  };

  const filteredRides = useMemo(() => {
    const now = new Date();
    return allRides.filter((r) => {
      if (rideSorties.length > 0 && !r.type_sortie.some((s) => rideSorties.includes(s as SortieType))) return false;
      if (rideNiveau) {
        const createur = users.find((u) => u.id === r.createur_id);
        if (createur && createur.niveau !== rideNiveau) return false;
      }
      if (ridePlaces === "1+") {
        const taken = (r.participants ?? []).filter((p) => p.statut === "accepte").length;
        if (r.nb_places_max - taken < 1) return false;
      }
      if (ridePlaces === "3+") {
        const taken = (r.participants ?? []).filter((p) => p.statut === "accepte").length;
        if (r.nb_places_max - taken < 3) return false;
      }
      if (rideVerifie) {
        const createur = users.find((u) => u.id === r.createur_id);
        if (!createur?.permis_verifie) return false;
      }
      if (rideDateFilter === "today") {
        const today = now.toISOString().slice(0, 10);
        if (r.date_ride !== today) return false;
      }
      if (rideDateFilter === "week") {
        const d = new Date(r.date_ride);
        const diff = (d.getTime() - now.getTime()) / 86400000;
        if (diff < 0 || diff > 7) return false;
      }
      if (rideDateFilter === "month") {
        const d = new Date(r.date_ride);
        if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return false;
      }
      return true;
    });
  }, [allRides, rideSorties, rideNiveau, ridePlaces, rideVerifie, rideDateFilter, users]);

  return (
    <main className="min-h-[100dvh]">
      {/* Switch sticky */}
      <div className="sticky top-0 z-30 bg-bg-primary safe-top px-6 pt-1 pb-2 border-b border-line">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <Link href="/profile">
              <Avatar src={me?.photo_url} name={me?.prenom} size="sm" online={me?.is_online} />
            </Link>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted font-bold">
                {clock} · 19°
              </p>
              <p className="font-display font-bold text-[14px] -mt-0.5">
                Salut, {me?.prenom ?? "Motard"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink">
              <Search size={16} strokeWidth={1.8} />
            </button>
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
            >
              <Bell size={16} strokeWidth={1.8} />
              {unread > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-accent text-bg-primary font-display font-bold text-[9px] flex items-center justify-center ring-2 ring-bg-primary">
                  {unread}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {/* Toggle Riders / Rides */}
        <div className="p-1 bg-bg-secondary rounded-[16px] flex gap-1">
          <button
            onClick={() => setMode("riders")}
            className={`flex-1 h-14 rounded-[12px] font-display font-bold text-[13px] transition-colors flex flex-col items-center justify-center gap-1 ${
              mode === "riders" ? "bg-white text-ink shadow-card" : "text-ink-muted"
            }`}
          >
            <Users size={18} strokeWidth={1.8} />
            Motards
          </button>
          <button
            onClick={() => setMode("rides")}
            className={`flex-1 h-14 rounded-[12px] font-display font-bold text-[13px] transition-colors flex flex-col items-center justify-center gap-1 ${
              mode === "rides" ? "bg-white text-ink shadow-card" : "text-ink-muted"
            }`}
          >
            <Bike size={18} strokeWidth={1.8} />
            Balades
          </button>
        </div>
      </div>

      {/* ——— MODE RIDERS ——— */}
      {mode === "riders" && (
        <div className="px-6 pt-3">
          <h1 className="text-h1 mt-2 leading-tight">
            {filtered.length === 0 ? "Aucun motard" : `${filtered.length} motard(e)s`}{" "}
            <span className="text-accent">près de toi</span> ce matin
          </h1>
          <p className="text-[12.5px] text-ink-muted mt-1.5">
            {onlineCount} en ligne maintenant
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Filtres rapides</p>
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted hover:text-ink transition-colors"
              >
                <Filter size={12} strokeWidth={2} /> Avancés
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
              {FILTERS.map((f) => (
                <Chip key={f} active={active === f} onClick={() => setActive(f)}>
                  {f}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === "riders" && suggestions.length > 0 ? (
        <section className="mt-6">
          <div className="flex items-center justify-between px-6 mb-2">
            <h2 className="text-label">Suggestions pour toi</h2>
            <span className="text-eyebrow text-ink-muted uppercase">via amis</span>
          </div>
          <div className="flex gap-3 overflow-x-auto px-6 pb-2 -mx-2">
            {suggestions.map((s) => (
              <RiderCard
                key={s.id}
                rider={s}
                amisCommuns={s.amisCommuns}
                origin={me ? { lat: me.lat, lng: me.lng } : undefined}
                compact
              />
            ))}
          </div>
        </section>
      ) : null}

      {mode === "riders" && (
        <section className="mt-6 px-6 pb-32">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-label">À proximité</h2>
            <span className="text-eyebrow text-ink-muted uppercase">{filtered.length} motard(e)s</span>
          </div>
          <div className="flex flex-col gap-[5px]">
            {filtered.map((r) => (
              <RiderCard
                key={r.id}
                rider={r}
                origin={me ? { lat: me.lat, lng: me.lng } : undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filtre riders */}
      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filtres avancés">
        <div className="space-y-6">
          <Slider label="Distance" unit=" km" min={1} max={100} value={maxDistance} onChange={setMaxDistance} />
          <RangeSlider
            label="Âge"
            unit=" ans"
            min={18}
            max={70}
            valueMin={minAge}
            valueMax={maxAge}
            onChangeMin={setMinAge}
            onChangeMax={setMaxAge}
          />
          <div>
            <p className="text-label mb-2">Type de moto</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(MOTO_TYPE_LABEL) as MotoType[]).map((m) => (
                <Chip key={m} active={motos.includes(m)} onClick={() => toggleMoto(m)}>{MOTO_TYPE_LABEL[m]}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-label mb-2">Type de sortie</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SORTIE_LABEL) as SortieType[]).map((s) => (
                <Chip key={s} active={sorties.includes(s)} onClick={() => toggleSortie(s)}>{SORTIE_LABEL[s]}</Chip>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" fullWidth onClick={resetFilters}>Réinitialiser</Button>
            <Button variant="primary" size="lg" fullWidth onClick={() => setFiltersOpen(false)}>Voir les résultats</Button>
          </div>
        </div>
      </Sheet>

      {/* ——— MODE RIDES ——— */}
      {mode === "rides" && (
        <div className="px-6 pt-3 pb-32">
            <h1 className="text-h1 mt-2 leading-tight">
              {filteredRides.length === 0 ? "Aucune balade" : `${filteredRides.length} balades`}{" "}
              <span className="text-accent">près de toi</span>
            </h1>
            <p className="text-[12.5px] text-ink-muted mt-1.5">
              {(() => {
                const n = allRides.filter((r) => {
                  const d = new Date(r.date_ride);
                  const now = new Date();
                  const day = d.getDay();
                  const diff = Math.round((d.getTime() - now.getTime()) / 86400000);
                  return (day === 6 || day === 0) && diff >= 0 && diff <= 7;
                }).length;
                const s = n > 1 ? "s" : "";
                return `${n} balade${s} organisée${s} ce weekend`;
              })()}
            </p>
            {/* Filtres rapides Balades */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Filtres rapides</p>
                <button
                  onClick={() => setRidesFiltersOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted hover:text-ink transition-colors"
                >
                  <Filter size={12} strokeWidth={2} /> Avancés
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto -mx-6 px-6 pb-2 no-scrollbar">
                <Chip active={rideDateFilter === "today"} onClick={() => setRideDateFilter(rideDateFilter === "today" ? null : "today")}>Aujourd'hui</Chip>
                <Chip active={rideDateFilter === "week"} onClick={() => setRideDateFilter(rideDateFilter === "week" ? null : "week")}>Cette semaine</Chip>
                <Chip active={rideDateFilter === "month"} onClick={() => setRideDateFilter(rideDateFilter === "month" ? null : "month")}>Ce mois</Chip>
                {(Object.keys(SORTIE_LABEL) as SortieType[]).map((s) => (
                  <Chip key={s} active={rideSorties.includes(s)} onClick={() => toggleRideSortie(s)}>{SORTIE_LABEL[s]}</Chip>
                ))}
                {(Object.keys(NIVEAU_LABEL) as Niveau[]).map((n) => (
                  <Chip key={n} active={rideNiveau === n} onClick={() => setRideNiveau(rideNiveau === n ? null : n)}>{NIVEAU_LABEL[n]}</Chip>
                ))}
              </div>
            </div>

          {filteredRides.length === 0 ? (
            <p className="py-16 text-center text-caption text-ink-muted">Aucune balade ne correspond à tes filtres.</p>
          ) : (
            <div className="flex flex-col gap-[5px] mt-4">
              {filteredRides.map((r) => (
                <RideCard
                  key={r.id}
                  ride={r}
                  users={users}
                  badge={me?.id === r.createur_id ? { label: "Tu organises", tone: "accent" } : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filtre rides */}
      <Sheet open={ridesFiltersOpen} onClose={() => setRidesFiltersOpen(false)} title="Filtres balades">
        <div className="space-y-6">
          <Slider label="Distance" unit=" km" min={1} max={100} value={rideDistance} onChange={setRideDistance} />
          <RangeSlider
            label="Âge du créateur"
            unit=" ans"
            min={18}
            max={70}
            valueMin={rideMinAge}
            valueMax={rideMaxAge}
            onChangeMin={setRideMinAge}
            onChangeMax={setRideMaxAge}
          />
          <div>
            <p className="text-label mb-2">Date</p>
            <div className="flex gap-2 flex-wrap">
              {([["today", "Aujourd'hui"], ["week", "Cette semaine"], ["month", "Ce mois"]] as const).map(([val, label]) => (
                <Chip key={val} active={rideDateFilter === val} onClick={() => setRideDateFilter(rideDateFilter === val ? null : val)}>{label}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-label mb-2">Type de sortie</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SORTIE_LABEL) as SortieType[]).map((s) => (
                <Chip key={s} active={rideSorties.includes(s)} onClick={() => toggleRideSortie(s)}>{SORTIE_LABEL[s]}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-label mb-2">Niveau requis</p>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(NIVEAU_LABEL) as Niveau[]).map((n) => (
                <Chip key={n} active={rideNiveau === n} onClick={() => setRideNiveau(rideNiveau === n ? null : n)}>{NIVEAU_LABEL[n]}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-label mb-2">Places disponibles</p>
            <div className="flex gap-2">
              {(["all", "1+", "3+"] as const).map((v) => (
                <Chip key={v} active={ridePlaces === v} onClick={() => setRidePlaces(v)}>{v === "all" ? "Toutes" : v}</Chip>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between bg-white border border-line rounded-card p-4">
            <span className="text-label">Organisateur vérifié</span>
            <button
              onClick={() => setRideVerifie((v) => !v)}
              className={`h-7 w-12 rounded-full p-1 transition-colors ${rideVerifie ? "bg-accent" : "bg-line"}`}
            >
              <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${rideVerifie ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" fullWidth onClick={resetRidesFilters}>Réinitialiser</Button>
            <Button variant="primary" size="lg" fullWidth onClick={() => setRidesFiltersOpen(false)}>Voir les résultats</Button>
          </div>
        </div>
      </Sheet>
    </main>
  );
}
