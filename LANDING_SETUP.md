# Ridly — Installation de la Landing Page

*Fait le 26/05/2026*

---

## Ce qui a été fait

### 1. Copie des fichiers dans le projet Ridly

Les fichiers ont été extraits du zip `landing page dl-20260526T181650Z-3-001.zip` et copiés dans le projet :

**Pages et composants :**
- `src/app/landing/page.tsx` — page principale avec 6 sections
- `src/app/landing/layout.tsx` — layout plein écran
- `src/app/landing/_components/Hero.tsx` — titre + bouton + compteur
- `src/app/landing/_components/PainCards.tsx` — 3 cartes problème
- `src/app/landing/_components/Solution.tsx` — Trouve / Rejoins / Roule
- `src/app/landing/_components/SocialProof.tsx` — stats + citations, fond sombre
- `src/app/landing/_components/WaitlistForm.tsx` — formulaire prénom / email / ville / moto
- `src/app/landing/_components/CounterBadge.tsx` — compteur animé d'inscrits
- `src/app/landing/_components/MotoToggle.tsx` — sélecteur type de moto
- `src/app/landing/_components/Footer.tsx` — logo + Instagram + mentions

**API (backend) :**
- `src/app/api/waitlist/route.ts` — sauvegarde une inscription dans Firebase
- `src/app/api/waitlist/count/route.ts` — retourne le nombre d'inscrits

**Firebase :**
- `src/lib/firebase/admin.ts` — connexion à Firebase via les variables d'environnement

**Illustrations :**
- `public/moto-1.svg` à `moto-4.svg`

---

### 2. Page admin créée

- `src/app/admin/waitlist/page.tsx` — tableau de tous les inscrits
- `src/app/admin/waitlist/_components/AdminTable.tsx` — filtre par ville + export CSV

Accessible sur : `http://localhost:3000/admin/waitlist?secret=ridly2026`

---

### 3. Dépendance ajoutée

Dans `package.json` :
```
"firebase-admin": "^12.7.0"
```

---

### 4. Firebase configuré

- Projet Firebase : `ridly-c3539`
- Firestore activé en région `europe-west1`
- Clé de service générée et ajoutée dans `.env.local`

---

### 5. Fichier `.env.local` créé

```
FIREBASE_PROJECT_ID=ridly-c3539
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@ridly-c3539.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="..."
ADMIN_SECRET=ridly2026
```

---

## Architecture actuelle

| Partie | Base de données |
|--------|----------------|
| Landing page (liste d'attente) | Firebase Firestore |
| Application Ridly | Supabase |

---

## Ce qui reste à faire

- [ ] Déployer sur Vercel pour mettre la landing en ligne
- [ ] Définir les user stories post-connexion (écrans après inscription au lancement)
- [ ] Décider de la stratégie de connexion au lancement (magic link recommandé)
- [ ] Migrer les inscrits Firebase → Supabase au moment du lancement de l'app
