# Serious Game · Gestion du temps

Web-app pédagogique pour la formation à la gestion du temps (fonction publique territoriale, entreprises). Construite à partir du cahier des charges « SERIOUS GAME – Gestion du temps (20–45 minutes maxi) ».

## Objectif pédagogique

Permettre aux stagiaires de :
- Prendre conscience de leur gestion du temps
- Identifier leurs fuites de temps
- Expérimenter des stratégies efficaces : **Time Batching**, **Action immédiate**, **Priorisation (matrice Eisenhower)**, **Gestion des interruptions**, **Concentration**, **Déconnexion**.

## Fonctionnalités

- ✅ **Profil utilisateur** : nom/pseudo, date de session, genre inclusif, avatar personnalisable
- ✅ **4 métiers / scénarios** : Ouvrier de voirie, Paysagiste, Chargé de mission, Assistant administratif
- ✅ **Mécaniques pédagogiques** : interruptions, notifications racoleuses, micro-tâches, time batching, savoir dire non, matrice priorisation
- ✅ **Système de score 0–100** + 3 profils finaux (Stratège organisé / Réactif débordé / Multitâche dispersé)
- ✅ **Débrief automatique** : erreurs, points forts, conseils personnalisés, badges
- ✅ **Espace formateur** : tableau de bord du groupe, classement, export **CSV / JSON**, **QR code** + lien direct
- ✅ **Mobile-first**, responsive, aucune installation requise
- ✅ **RGPD-friendly** : aucune donnée n'est envoyée à un serveur ; tout est stocké en local (`localStorage`).

## Stack

- ⚛️ React 18 + TypeScript
- ⚡ Vite 5
- 🎨 Tailwind CSS 3
- 🗃️ Zustand (state + persistance)
- 🔳 `qrcode.react`

## Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en mode développement (mobile-friendly via réseau local)
npm run dev

# 3. Build de production
npm run build

# 4. Aperçu du build
npm run preview
```

L'app sera accessible sur `http://localhost:5173` (et sur ton IP locale pour tester sur mobile via QR code).

## Déploiement

Le build est 100 % statique : il suffit de déployer le dossier `dist/` sur n'importe quel hébergeur (Netlify, Vercel, GitHub Pages, OVH, Cloudflare Pages, S3, etc.).

## Structure du projet

```
src/
├── App.tsx                    # Routeur d'écrans (state-based)
├── main.tsx                   # Entry React
├── index.css                  # Tailwind + design system
├── store.ts                   # State global (Zustand) + persistance
├── types.ts                   # Types TS (Scenario, Step, Result…)
├── data/
│   ├── scenarios.ts           # Les 4 scénarios métiers
│   └── avatars.ts             # Avatars inclusifs
├── game/
│   └── scoring.ts             # Calcul du score, profil, badges, conseils
└── components/
    ├── Layout.tsx
    ├── HomeScreen.tsx
    ├── ProfileScreen.tsx
    ├── JobSelectionScreen.tsx
    ├── IntroScreen.tsx
    ├── GameScreen.tsx          # Orchestrateur
    ├── ResultScreen.tsx        # Débrief + score
    ├── TrainerScreen.tsx       # Espace formateur (CSV/JSON/QR)
    └── game/
        ├── NarrativeStepView.tsx
        ├── ChoiceStepView.tsx
        ├── PriorisationStepView.tsx
        └── BatchingStepView.tsx
```

## Étendre les scénarios

Toutes les histoires sont déclarées dans `src/data/scenarios.ts` sous forme de tableau de `Step`. Quatre types d'étapes sont disponibles :

| Kind | Description |
|---|---|
| `narrative` | Texte d'ambiance, transition |
| `choice` | Choix binaire/multiple avec impact temps + score |
| `priorisation` | Matrice Urgent / Important (mini-exercice) |
| `batching` | Regroupement de tâches similaires |

Pour ajouter un métier : ajoute un objet `Scenario` dans le tableau `SCENARIOS`. L'app le détectera automatiquement.

## Personnalisation rapide

- **Couleurs** : `tailwind.config.js` → `colors.brand`
- **Système de score** : `src/game/scoring.ts`
- **Profils finaux et leurs labels** : `PROFILE_LABELS` dans `scoring.ts`
- **Avatars** : `src/data/avatars.ts`

## Conformité au cahier des charges

| Exigence | Couvert |
|---|---|
| 20–45 min, web app, sans installation | ✅ |
| Smartphone / tablette / PC | ✅ (responsive mobile-first) |
| QR code + lien | ✅ (espace formateur) |
| Profil avec genre inclusif + avatar | ✅ |
| 3 métiers (4 fournis) avec environnements distincts | ✅ |
| Mécaniques : interruptions, notifications, action immédiate, time batching, priorisation, dire non | ✅ |
| Matrice priorisation Urgent/Important | ✅ (mini-jeu interactif) |
| Score 0–100 + tranches | ✅ |
| 3 profils + débrief automatique | ✅ |
| Conseils personnalisés | ✅ |
| Badges (priorisation, anti-distraction, action immédiate) | ✅ |
| Interface formateur, export, classement | ✅ (CSV + JSON) |
| Chronomètre visible | ✅ |
| RGPD | ✅ (stockage local uniquement) |

## Licence

Projet pédagogique — adapter librement aux besoins de ta formation.
