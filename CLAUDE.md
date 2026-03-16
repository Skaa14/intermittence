# Intermittence - Simulateur ARE Spectacle

## Objectif du projet
Application mobile (Android + iOS) permettant aux intermittents du spectacle en France de :
- Saisir leurs contrats (dates, chiffre d'affaire)
- Simuler le montant de leur ARE (Aide au Retour à l'Emploi)
- Prévoir à l'avance leurs droits

## Objectif pédagogique
Ce projet sert aussi de formation à React Native / Expo pour l'utilisateur.
**À chaque étape** : expliquer clairement ce qu'on fait et pourquoi, pour que l'utilisateur apprenne et retienne.

## Stack technique
- **Framework** : Expo SDK 54 (React Native)
- **Langage** : TypeScript
- **Navigation** : Expo Router (file-based routing avec onglets)
- **State management** : React Context (ContratsContext)
- **Tests** : Jest + jest-expo + React Native Testing Library + jest-cucumber (Gherkin)
- **État du projet** : Formulaire de contrats + dashboard fonctionnels

## Git
- Remote : git@github-perso:lucas-dormoy1/intermittence.git
- Identité : lucas-dormoy1 <luludorm@gmail.com>
- Branche principale : main
- **Conventional commits** (feat:, fix:, refactor:, docs:, chore:, etc.)

## Architecture
```
app/                    ← Dossier des routes (Expo Router)
├── _layout.tsx         ← Layout racine (Stack global)
├── _layout.styles.ts   ← Styles du layout racine
└── (tabs)/             ← Groupe d'onglets
    ├── _layout.tsx     ← Config des onglets (barre du bas)
    ├── index.tsx           ← Onglet Accueil (dashboard)
    ├── index.styles.ts     ← Styles de l'accueil
    ├── contrats.tsx        ← Onglet Contrats (saisie)
    ├── contrats.styles.ts  ← Styles des contrats
    ├── vue-mensuelle.tsx   ← Onglet Vue mensuelle (simulation ARE mois par mois)
    └── vue-mensuelle.styles.ts ← Styles de la vue mensuelle
└── mois/
    ├── [index].tsx         ← Détail swipeable d'un mois d'indemnisation
    └── [index].styles.ts   ← Styles du détail d'un mois
theme/
├── colors.ts           ← Tokens de couleurs partagés (source de vérité)
├── fonts.ts            ← Tokens de polices partagés (source de vérité)
└── webStyles.ts        ← Styles web partagés (React.CSSProperties)
types/contrat.ts            ← Interface TypeScript du contrat
types/profil.ts             ← Interface TypeScript du profil intermittent
contexts/ContratsContext.tsx ← State partagé entre les écrans
contexts/ProfilContext.tsx   ← Profil intermittent (annexe, salaire référence, heures)
utils/calculerAJ.ts         ← Calcul de l'indemnité journalière
utils/calculerIndemnisationMensuelle.ts ← Calcul des 12 mois de la période d'indemnisation
docs/                   ← Documentation du projet
├── tech/               ← Fiches pédagogiques React Native / Expo
└── metier/             ← Fiches règles métier ARE intermittents + guide officiel PDF
tests/                  ← Tests
├── features/           ← Fichiers Gherkin (.feature)
└── steps/              ← Step definitions Jest/Cucumber (.steps.tsx)
jest.config.js          ← Configuration Jest
app.json                ← Configuration Expo
assets/                 ← Images et ressources
```

## Lecture de fichiers PDF
- Utiliser le **Read tool sans paramètre `pages`** : `Read("chemin/fichier.pdf")` (sans spécifier de pages)
- Ne PAS utiliser `pages:` ni Bash/Python — `pdftoppm` n'est pas installé sur cette machine
- Cette méthode fonctionne et retourne le contenu complet du PDF page par page

## Règles de développement
- **Pas de commentaires explicatifs dans le code** — les explications de concepts vont dans des fiches Markdown dans `docs/`
- Garder le code simple et lisible
- Mettre à jour ce fichier à chaque étape
- L'utilisateur connaît TypeScript, ne pas expliquer les bases TS
- **Toujours lancer les tests** (`npm test`) après une modification qui peut les impacter
- **Toujours écrire des tests** pour chaque feature ou fix (Gherkin + step definitions dans `tests/`)
- **Avant d'écrire des tests** : charger le skill `/test` pour connaître les conventions, patterns et mocks du projet

## Conventions de style
- **Zéro couleur hex en dur** dans les fichiers `.tsx` ou `.styles.ts` — toujours passer par `theme/colors.ts`
- **Styles séparés** : chaque écran a son fichier `[nom].styles.ts` colocalisé, qui exporte `styles` (et éventuellement des constantes associées)
- **Styles web** (`React.CSSProperties`) : utiliser `webDateInputBase` depuis `theme/webStyles.ts` comme base, étendre avec les propriétés spécifiques
- Les fichiers `.tsx` n'importent que `{ styles }` depuis leur `.styles.ts` — pas de `StyleSheet` ni de couleurs directement dans le JSX
