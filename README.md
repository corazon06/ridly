# Ridly — MVP

App mobile-first communautaire pour mettre en relation des motards à Lyon, conformément à la spec d'avril 2026.

## Stack

- **Next.js 15 (App Router)** + **TypeScript** — frontend & API routes
- **Tailwind CSS** — design tokens centralisés (`src/app/globals.css` + `tailwind.config.ts`)
- **Supabase** — auth, Postgres, Realtime, Storage (région EU pour RGPD)
- **Mapbox / Leaflet** — cartes (à brancher)
- **PWA** — manifest installable

## Démarrage rapide

```bash
npm install
cp .env.example .env.local      # facultatif au premier run
npm run dev                     # http://localhost:3000
```

> **Mode mock par défaut.** Si les variables Supabase ne sont pas remplies, l'app fonctionne entièrement en local avec des données fictives persistées dans `localStorage`. Idéal pour démo / feedback avant provisioning du backend.

### Login démo

1. Ouvre `/`
2. "J'ai déjà un compte" → "Se connecter" (les champs sont pré-remplis)
3. Tu arrives sur Explorer en tant que **Maxime** (compte démo).

Sinon le flow complet d'inscription (5 étapes) est aussi connecté.

## Architecture

```
src/
├── app/                      # Routes Next.js
│   ├── page.tsx              # Welcome
│   ├── signup/, login/       # Auth
│   ├── onboarding/           # Onboarding 5 étapes
│   └── (app)/                # Routes protégées (BottomNav)
│       ├── explorer/
│       ├── rides/
│       ├── create/
│       ├── messages/
│       └── profile/
├── components/
│   ├── ui/                   # Primitives (Button, Card, Avatar…)
│   ├── shell/                # BottomNav, app chrome
│   ├── rider/                # RiderCard
│   ├── ride/                 # RideCard
│   └── onboarding/
├── lib/
│   ├── data/api.ts           # 👈 Couche unique pour TOUTES les requêtes
│   ├── supabase/             # Clients (browser, server, middleware)
│   ├── mock/                 # Store mock + fixtures
│   ├── types.ts              # Types domaine (single source of truth)
│   └── utils.ts
└── styles : tokens dans globals.css + tailwind.config.ts
supabase/migrations/0001_init.sql  # schéma + RLS + triggers
```

## Modifier l'app rapidement

| Tu veux changer… | Édite ce fichier |
|---|---|
| Couleurs, typo, rayons | `src/app/globals.css` (`:root`) + `tailwind.config.ts` |
| Un texte / écran | la page concernée dans `src/app/...` |
| Les types / champs DB | `src/lib/types.ts` + `supabase/migrations/0001_init.sql` |
| La logique d'une requête | `src/lib/data/api.ts` (fonction unique pour les deux backends) |
| Les données démo | `src/lib/mock/fixtures.ts` |
| Un composant UI réutilisé partout | `src/components/ui/<Composant>.tsx` |

Le principe : un composant ne sait jamais d'où viennent ses données. Il appelle un hook de `src/lib/data/api.ts`. Cette couche bascule entre le store mock et Supabase via la variable `IS_MOCK` (calculée depuis l'env). Tu peux donc itérer sur l'UI sans toucher au backend, et brancher Supabase plus tard sans modifier les pages.

## Brancher Supabase (production)

1. Crée un projet sur [supabase.com](https://supabase.com) — choisir région **eu-west-3 (Paris)** pour la conformité RGPD.
2. Copie l'URL + l'`anon key` dans `.env.local`.
3. Lance la migration :
   ```bash
   # via Supabase CLI
   supabase link --project-ref <ref>
   supabase db push
   ```
   Ou en interface : Project → SQL Editor → coller le contenu de `supabase/migrations/0001_init.sql`.
4. Active **Auth → Email** + **Auth → Magic links**.
5. Active **Realtime** sur `messages` et `ride_participants` (pour la messagerie + acceptation live).
6. Crée un bucket Storage `avatars` + `licenses` (les licences en privé).
7. Redémarre le dev server — `IS_MOCK` passe à `false` automatiquement.

> Les hooks de `src/lib/data/api.ts` côté Supabase ne sont pas encore implémentés (TODO marqué `// TODO: wire to Supabase`). Le mode mock couvre 100% des écrans pour le moment ; le branchement Supabase se fait module par module.

## Sécurité — RLS

Toutes les tables ont leur RLS activée. Voir `supabase/migrations/0001_init.sql` :
- `users` : lecture publique, écriture sur soi-même.
- `rides` : lecture publique, écriture par le créateur.
- `ride_participants` : update par soi ou par le créateur du ride.
- `connections` : visibles par les deux parties seulement.
- `conversations` / `messages` : accès strict aux participants.

## PWA

Le manifest est en place (`public/manifest.json`). À ajouter pour une vraie installation :
- `public/icon-192.png` + `icon-512.png`
- Un service worker (Workbox / `next-pwa`) pour l'offline.

## Phase 2 — passage à Flutter

Les composants sont écrits avec une logique métier découplée du rendu (data layer dans `lib/data/api.ts`, types dans `lib/types.ts`). Pour migrer vers Flutter :
1. Réutiliser le schéma Supabase tel quel.
2. Recoder les écrans avec Flutter, en réutilisant la même API.
3. Garder le backend identique.

## Roadmap MVP

- [x] Onboarding 5 étapes
- [x] Explorer + filtres + fiche rider
- [x] Rides (à venir / en attente / passés) + détail
- [x] Création de ride
- [x] Messagerie 1-1 + groupe ride
- [x] Profil + réseau + réglages
- [ ] Branchement Supabase (signup / login réels)
- [ ] Cartes Mapbox
- [ ] Push notifications (FCM)
- [ ] Validation manuelle selfie (admin)
- [ ] Ride reports auto-générés + partage Instagram

## Licence

Propriétaire — Ridly SAS, 2026.
