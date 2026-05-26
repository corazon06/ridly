-- =============================================================
-- Ridly — schema initial
-- Conformité spec §6 (modèle de données) + §7 (règles métier)
-- Hébergement EU (RGPD) — voir le projet Supabase eu-west-3.
-- =============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- ENUMS ---------------------------------------------------------

create type moto_type as enum
  ('roadster','trail','sportive','touring','cafe_racer','custom');

create type niveau as enum ('debutant','intermediaire','confirme');

create type sexe_option as enum ('homme','femme','prefere_ne_pas_dire');

create type sortie_type as enum
  ('balade','road_trip','cafe','cols','matinale','twisty','tour_urbain','longue_distance');

create type duree_ride as enum ('cafe','2h','demi_journee','journee');

create type ride_statut as enum ('ouvert','complet','en_cours','termine','annule');

create type connection_statut as enum ('en_attente','accepte','refuse');

create type participation_statut as enum
  ('en_attente','accepte','refuse','present','absent');

create type conversation_type as enum ('dm','ride');

-- USERS ---------------------------------------------------------
-- Lié à auth.users via id (cascade).

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  prenom text not null,
  date_naissance date not null,
  ville text not null,
  lat double precision not null,
  lng double precision not null,
  sexe sexe_option not null default 'prefere_ne_pas_dire',
  photo_url text,
  description text,
  is_online boolean not null default false,

  moto_type moto_type not null,
  moto_marque text,
  moto_modele text,
  moto_cylindree int,
  moto_annee int,
  niveau niveau not null,

  types_sorties sortie_type[] not null default '{}',

  selfie_valide boolean not null default false,
  permis_verifie boolean not null default false,
  score_fiabilite int not null default 100 check (score_fiabilite between 0 and 100),
  rides_organises int not null default 0,
  rides_rejoints int not null default 0,
  km_parcourus int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_geo_idx on public.users (lat, lng);
create index users_ville_idx on public.users (ville);

-- RIDES ---------------------------------------------------------

create table public.rides (
  id uuid primary key default uuid_generate_v4(),
  createur_id uuid not null references public.users(id) on delete cascade,

  titre text,
  point_depart text not null,
  lat_depart double precision not null,
  lng_depart double precision not null,
  date_ride date not null,
  heure_depart time not null,
  duree_estimee duree_ride not null,
  type_sortie sortie_type[] not null default '{}',
  nb_places_max int not null check (nb_places_max between 1 and 50),
  mot_libre text,
  validation_manuelle boolean not null default true,
  statut ride_statut not null default 'ouvert',

  created_at timestamptz not null default now()
);

create index rides_geo_idx on public.rides (lat_depart, lng_depart);
create index rides_date_idx on public.rides (date_ride);
create index rides_createur_idx on public.rides (createur_id);

-- PARTICIPATIONS -----------------------------------------------

create table public.ride_participants (
  id uuid primary key default uuid_generate_v4(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  statut participation_statut not null default 'en_attente',
  note_donnee int check (note_donnee between 1 and 5),
  created_at timestamptz not null default now(),
  unique (ride_id, user_id)
);

create index ride_participants_ride_idx on public.ride_participants(ride_id);
create index ride_participants_user_idx on public.ride_participants(user_id);

-- CONNECTIONS (réseau) -----------------------------------------

create table public.connections (
  id uuid primary key default uuid_generate_v4(),
  demandeur_id uuid not null references public.users(id) on delete cascade,
  receveur_id uuid not null references public.users(id) on delete cascade,
  statut connection_statut not null default 'en_attente',
  created_at timestamptz not null default now(),
  check (demandeur_id <> receveur_id),
  unique (demandeur_id, receveur_id)
);

-- CONVERSATIONS + MESSAGES -------------------------------------

create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  type conversation_type not null,
  ride_id uuid references public.rides(id) on delete cascade,
  participant_ids uuid[] not null,
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

create index conversations_participants_idx
  on public.conversations using gin (participant_ids);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  kind text not null default 'text',
  created_at timestamptz not null default now()
);

create index messages_conv_created_idx on public.messages (conversation_id, created_at desc);

-- RIDE REPORTS -------------------------------------------------

create table public.ride_reports (
  id uuid primary key default uuid_generate_v4(),
  ride_id uuid not null unique references public.rides(id) on delete cascade,
  km int,
  duree_minutes int,
  vitesse_moyenne int,
  photos text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

alter table public.users enable row level security;
alter table public.rides enable row level security;
alter table public.ride_participants enable row level security;
alter table public.connections enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.ride_reports enable row level security;

-- USERS: tout le monde voit les profils, on ne modifie que le sien.
create policy "users_read_all" on public.users for select using (true);
create policy "users_update_self" on public.users for update using (auth.uid() = id);
create policy "users_insert_self" on public.users for insert with check (auth.uid() = id);

-- RIDES: lecture publique, créateur seul peut éditer/supprimer.
create policy "rides_read_all" on public.rides for select using (true);
create policy "rides_insert_own" on public.rides for insert with check (auth.uid() = createur_id);
create policy "rides_update_own" on public.rides for update using (auth.uid() = createur_id);
create policy "rides_delete_own" on public.rides for delete using (auth.uid() = createur_id);

-- PARTICIPATIONS: visibles par tout le monde, écriture par le user concerné
-- ou par le créateur du ride (pour valider/refuser).
create policy "rp_read_all" on public.ride_participants for select using (true);
create policy "rp_insert_self" on public.ride_participants for insert
  with check (auth.uid() = user_id);
create policy "rp_update_self_or_creator" on public.ride_participants for update using (
  auth.uid() = user_id
  or auth.uid() = (select createur_id from public.rides r where r.id = ride_id)
);

-- CONNECTIONS: visible par les deux parties, écriture par le demandeur,
-- update par les deux pour accept/refuse.
create policy "conn_read_parties" on public.connections for select using (
  auth.uid() in (demandeur_id, receveur_id)
);
create policy "conn_insert_self" on public.connections for insert
  with check (auth.uid() = demandeur_id);
create policy "conn_update_parties" on public.connections for update using (
  auth.uid() in (demandeur_id, receveur_id)
);

-- CONVERSATIONS: lecture par les participants seulement.
create policy "conv_read_parties" on public.conversations for select using (
  auth.uid() = any(participant_ids)
);
create policy "conv_insert_self_in" on public.conversations for insert
  with check (auth.uid() = any(participant_ids));

-- MESSAGES: lecture si membre de la conversation, écriture par soi.
create policy "msg_read_parties" on public.messages for select using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and auth.uid() = any(c.participant_ids)
  )
);
create policy "msg_insert_self_in_conv" on public.messages for insert with check (
  auth.uid() = author_id
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and auth.uid() = any(c.participant_ids)
  )
);

-- RIDE REPORTS: lecture publique, écriture par les participants du ride.
create policy "report_read_all" on public.ride_reports for select using (true);
create policy "report_insert_participant" on public.ride_reports for insert with check (
  exists (
    select 1 from public.ride_participants rp
    where rp.ride_id = ride_id and rp.user_id = auth.uid() and rp.statut = 'present'
  )
);

-- =============================================================
-- TRIGGERS — score fiabilité, compteurs, last_message_at
-- =============================================================

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_touch
  before update on public.users
  for each row execute function public.touch_updated_at();

create or replace function public.bump_conversation_on_message()
returns trigger language plpgsql as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger msg_bump_conv
  after insert on public.messages
  for each row execute function public.bump_conversation_on_message();
