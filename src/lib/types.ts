/**
 * Domain types — single source of truth for the app.
 * Mirrors the DB schema in /supabase/migrations.
 */

export type MotoType =
  | "roadster"
  | "trail"
  | "sportive"
  | "touring"
  | "cafe_racer"
  | "custom";

export type Niveau = "debutant" | "intermediaire" | "confirme";

export type SexeOption = "homme" | "femme" | "prefere_ne_pas_dire";

export type SortieType =
  | "balade"
  | "road_trip"
  | "cafe"
  | "cols"
  | "matinale"
  | "twisty"
  | "tour_urbain"
  | "longue_distance";

export type DureeRide = "1h" | "2h" | "3h" | "4h" | "demi_journee" | "journee" | "2j" | "3j" | "plus";

export type AllureRide = "tranquille" | "roulant" | "sportif" | "engage";

export const ALLURE_LABEL: Record<AllureRide, string> = {
  tranquille: "🐢 Tranquille",
  roulant:    "😎 Roulant",
  sportif:    "🔥 Sportif",
  engage:     "⚡ Engagé",
};

export type RideStatut =
  | "ouvert"
  | "complet"
  | "en_cours"
  | "termine"
  | "annule";

export type ConnectionStatut = "en_attente" | "accepte" | "refuse";

export type ParticipationStatut =
  | "en_attente"
  | "accepte"
  | "refuse"
  | "present"
  | "absent";

export interface User {
  id: string;
  email: string;
  prenom: string;
  date_naissance: string;
  ville: string;
  lat: number;
  lng: number;
  sexe: SexeOption;
  photo_url: string | null;
  description: string | null;
  is_online: boolean;

  moto_type: MotoType | null;
  moto_marque: string | null;
  moto_modele: string | null;
  moto_cylindree: number | null;
  moto_annee: number | null;
  niveau: Niveau | null;

  types_sorties: SortieType[];
  gouts: string[];

  selfie_valide: boolean;
  permis_verifie: boolean;
  score_fiabilite: number;
  rides_organises: number;
  rides_rejoints: number;
  km_parcourus: number;

  created_at: string;
}

export interface Ride {
  id: string;
  createur_id: string;
  createur?: Pick<
    User,
    "id" | "prenom" | "photo_url" | "score_fiabilite" | "rides_organises"
  >;

  titre: string | null;
  point_depart: string;
  lat_depart: number;
  lng_depart: number;
  date_ride: string;
  heure_depart: string;
  duree_estimee: DureeRide;
  type_sortie: SortieType[];
  nb_places_max: number;
  arrets: string[];
  allure: AllureRide | null;
  niveau_requis: Niveau | null;
  mot_libre: string | null;
  validation_manuelle: boolean;
  statut: RideStatut;

  participants?: RideParticipant[];
  created_at: string;
}

export interface RideParticipant {
  id: string;
  ride_id: string;
  user_id: string;
  user?: Pick<User, "id" | "prenom" | "photo_url">;
  statut: ParticipationStatut;
  note_donnee: number | null;
}

export interface Connection {
  id: string;
  demandeur_id: string;
  receveur_id: string;
  statut: ConnectionStatut;
  created_at: string;
}

export interface Conversation {
  id: string;
  type: "dm" | "ride";
  ride_id: string | null;
  participant_ids: string[];
  last_message_at: string | null;
  participants?: Pick<User, "id" | "prenom" | "photo_url">[];
  unread_count?: number;
  preview?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  author_id: string;
  author?: Pick<User, "id" | "prenom" | "photo_url">;
  content: string;
  created_at: string;
  kind?: "text" | "system" | "location";
}

export interface RideReport {
  id: string;
  ride_id: string;
  km: number;
  duree_min: number;
  notes_donnees: number;
  notes_recues: number;
  rated: boolean;
}

export type NotificationKind =
  | "join_request"
  | "join_accepted"
  | "ride_reminder"
  | "new_message"
  | "connection_request"
  | "connection_accepted";

export interface Notification {
  id: string;
  kind: NotificationKind;
  user_id: string;
  related_user_id?: string;
  related_ride_id?: string;
  read: boolean;
  created_at: string;
}

/* ---------- Display helpers (label maps) ---------- */

export const MOTO_TYPE_LABEL: Record<MotoType, string> = {
  roadster: "Roadster",
  trail: "Trail",
  sportive: "Sportive",
  touring: "Touring",
  cafe_racer: "Café Racer",
  custom: "Custom",
};

export const NIVEAU_LABEL: Record<Niveau, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  confirme: "Confirmé",
};

export const SORTIE_LABEL: Record<SortieType, string> = {
  balade: "Balade",
  road_trip: "Road Trip",
  cafe: "Café / Apéro",
  cols: "Cols de montagne",
  matinale: "Sortie matinale",
  twisty: "Twisty",
  tour_urbain: "Tour urbain",
  longue_distance: "Longue distance",
};

export const DUREE_LABEL: Record<DureeRide, string> = {
  "1h": "1h",
  "2h": "2h",
  "3h": "3h",
  "4h": "4h",
  demi_journee: "½ journée",
  journee: "Journée",
  "2j": "2 jours",
  "3j": "3 jours",
  plus: "4 jours +",
};
