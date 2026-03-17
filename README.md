# Intermittence — Simulateur ARE Spectacle

Application mobile (Android & iOS) permettant aux intermittents du spectacle en France de simuler leurs droits à l'ARE (Aide au Retour à l'Emploi).

## Fonctionnalités

- **Saisie des contrats** — dates, heures travaillées, chiffre d'affaires, avec persistance locale
- **Calcul de l'AJ** (Allocation Journalière) — brute et nette, avec cotisations sociales (retraite complémentaire, CSG, CRDS, régime Alsace-Moselle)
- **Suivi du seuil des 507 heures** — barre de progression sur le dashboard
- **Vue mensuelle** — simulation mois par mois de la période d'indemnisation (12 mois)
- **Détail par mois** — franchises CP et salaire, seuil de non-indemnisation, formules détaillées
- **Profil intermittent** — annexe 8 ou 10, salaire de référence, taux CSG

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | Expo SDK 54 (React Native) |
| Langage | TypeScript |
| Navigation | Expo Router (file-based routing) |
| State | React Context |
| Persistance | AsyncStorage |
| Tests | Jest + jest-expo + React Native Testing Library + jest-cucumber (Gherkin) |

## Lancer le projet

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de dev
npm start

# Lancer sur une plateforme spécifique
npm run android
npm run ios
npm run web
```

## Tests

```bash
npm test
npm run test:watch
```

## Structure du projet

```
app/                    Routes (Expo Router)
├── (tabs)/             Onglets principaux
│   ├── index.tsx       Dashboard (accueil)
│   ├── contrats.tsx    Saisie des contrats
│   └── vue-mensuelle.tsx  Simulation ARE mois par mois
└── mois/
    └── [moisIndex].tsx Détail d'un mois d'indemnisation

utils/                  Logique métier (calcul AJ, indemnisation mensuelle)
contexts/               State partagé (contrats, profil)
types/                  Interfaces TypeScript
styles/                 Fichiers de styles séparés
theme/                  Tokens (couleurs, polices)
docs/                   Documentation métier et technique
tests/                  Tests Gherkin + step definitions
```

## Règles métier

L'application implémente les règles de calcul de l'ARE pour les intermittents du spectacle selon la réglementation France Travail :

- Annexes 8 (techniciens) et 10 (artistes)
- Formule AJ : `max(AJ_A, AJ_B, AJ_plancher)` plafonnée à `AJ_plafond`
- Franchises CP et salaire
- Seuil de non-indemnisation par mois
- Cotisations sociales sur l'AJ nette

La documentation détaillée des règles se trouve dans [docs/metier/](docs/metier/).

## Licence

MIT
