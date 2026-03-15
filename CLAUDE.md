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
└── (tabs)/             ← Groupe d'onglets
    ├── _layout.tsx     ← Config des onglets (barre du bas)
    ├── index.tsx       ← Onglet Accueil (dashboard)
    ├── contrats.tsx    ← Onglet Contrats (saisie)
    └── simulation.tsx  ← Onglet Simulation (calcul ARE)
types/contrat.ts        ← Interface TypeScript du contrat
contexts/ContratsContext.tsx ← State partagé entre les écrans
docs/                   ← Fiches pédagogiques sur les concepts RN/Expo
tests/                  ← Tests
├── features/           ← Fichiers Gherkin (.feature)
└── steps/              ← Step definitions Jest/Cucumber (.steps.tsx)
jest.config.js          ← Configuration Jest
app.json                ← Configuration Expo
assets/                 ← Images et ressources
```

## Règles de développement
- **Pas de commentaires explicatifs dans le code** — les explications de concepts vont dans des fiches Markdown dans `docs/`
- Garder le code simple et lisible
- Mettre à jour ce fichier à chaque étape
- L'utilisateur connaît TypeScript, ne pas expliquer les bases TS
- **Toujours lancer les tests** (`npm test`) après une modification qui peut les impacter
- **Toujours écrire des tests** pour chaque feature ou fix (Gherkin + step definitions dans `tests/`)
