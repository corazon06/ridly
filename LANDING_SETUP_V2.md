# Ridly — Landing Page V2 · Optimisation UX/UI

*Fait le 26/05/2026*

---

## Modifications apportées depuis V1

### Logo
- Remplacement du "R" dans le carré noir par le vrai logo `LOGO RIDLY (1).png`
- `mix-blend-mode: multiply` pour fusionner le fond du logo avec la page
- Même traitement appliqué dans le Footer

### Textes
- "Lyon en premier" remplacé par **"En avant première sur Lyon"** partout (Hero, CounterBadge, WaitlistForm, page.tsx, Footer)
- Footer : "Tu roules plus seul." → **"Tu ne roules plus seul."**

---

## Optimisation conversion (CRO V3)

### Hero
- Phrase descriptive remplacée : *"Ridly, c'est l'app qui te trouve des motards compatibles près de toi — en 30 secondes."*
- Bouton CTA passé en terracotta `#B85633`
- Texte sous le bouton : *"Gratuit · 30 secondes · Aucun spam"*
- Compteur repositionné juste sous le CTA, format compact (15px)
- Illustration moto supprimée
- Scroll animé au clic sur le CTA : easing **cubic en S** (lent → rapide → lent, 900ms)

### Pain Cards
- Emojis supprimés → titres en gras
- Nouveaux titres : *"Tu textes le groupe. Silence."* / *"47 messages dans le groupe FB. 0 ride."* / *"Pas de motard(e)s autour de toi ?"*
- Texte descriptif ajouté sous chaque titre (13px, gris)
- Bordure gauche terracotta 3px
- Ombre portée au survol (`hover:shadow`)

### Solution
- Emojis remplacés par icônes SVG inline (pin, users, route)
- Bloc noir ajouté : *"Créer ou rejoindre un ride : moins de 60 secondes."*
- Badge rouge "Bientôt disponible · Lyon" remis

### Social Proof
- Nouvelles citations : Thomas (Trail, Lyon) et Léa (Roadster, Villeurbanne)
- Badge terrain terracotta ajouté au-dessus des citations
- Chiffres (86%, 81%, 40%) animés : comptent de 0 → valeur cible, easing **rapide → lent** (2,2s)
- **Carrousel de 8 avis** avec défilement 2 par 2, flèches ← → centrées verticalement, animation slide fluide + indicateurs en bas

### Formulaire
- Micro-réassurances ajoutées en haut : *"✓ Aucune CB requise · ✓ 30 secondes · ✓ Lyon en avant-première"*
- Villes pré-définies (Lyon, Villeurbanne, Caluire, Vénissieux, Bron, Saint-Priest, Décines, Autre)
- CTA formulaire : *"Rejoindre la liste · Lyon en premier →"*, terracotta, hauteur 52px
- RGPD reformulé en bénéfice : *"Je veux être prévenu(e) en avant-première..."*
- Texte sous bouton : *"Tu seras notifié(e) dès que Ridly est disponible à Lyon."*
- État de confirmation amélioré : rang réel + bouton Instagram + bouton partager

### Footer
- Bande terracotta ajoutée au-dessus : *"Lyon. 2026. Tu ne roules plus seul."*

### Nouveau composant
- `StickyMobileCTA.tsx` : barre fixe mobile terracotta, apparaît après 300px de scroll, disparaît au niveau du formulaire

### CSS / Layout
- `scroll-behavior: auto` (le scroll JS custom prend le relais)
- Focus inputs/selects : outline terracotta `#B85633`

---

## Fichiers modifiés

| Fichier | Changement |
|--------|-----------|
| `Hero.tsx` | Scroll animé, CTA terracotta, phrase, compteur repositionné |
| `CounterBadge.tsx` | Format compact, texte mis à jour |
| `PainCards.tsx` | Nouveaux titres/textes, bordure, hover shadow |
| `Solution.tsx` | Icônes SVG, bloc noir, badge remis |
| `SocialProof.tsx` | Animations chiffres, nouvelles citations, badge, carrousel 8 avis |
| `WaitlistForm.tsx` | Réassurances, villes, CTA, RGPD, confirmation |
| `Footer.tsx` | Bande terracotta, logo mis à jour, texte mis à jour |
| `StickyMobileCTA.tsx` | Nouveau composant |
| `page.tsx` | Import StickyMobileCTA, suppression ancien sticky |
| `layout.tsx` | scroll-behavior auto, focus outline |

---

*Ridly Landing V2 — 26/05/2026*
