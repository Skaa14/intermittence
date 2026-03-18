# Patterns de test

## Stack

- **Jest** via `jest-expo` preset
- **React Native Testing Library** (`@testing-library/react-native`)
- **jest-cucumber** pour le BDD (Gherkin → step definitions)
- Config : `jest.config.js` (testMatch sur `tests/steps/**/*.steps.tsx` et `tests/unit/**/*.test.ts`)
- Commande : `npm test`

## Structure des fichiers

```
tests/
├── features/           ← Fichiers Gherkin (.feature)
│   └── mon-ecran.feature
├── steps/              ← Step definitions (.steps.tsx)
│   └── mon-ecran.steps.tsx
└── unit/               ← Tests unitaires logique métier (.test.ts)
    └── maFonction.test.ts
```

Chaque `.feature` a un `.steps.tsx` correspondant avec le même nom de base.

## Deux types de tests

- **Tests UI** (Gherkin) : pour les écrans et interactions utilisateur → `tests/features/` + `tests/steps/`
- **Tests unitaires** : pour la logique métier pure dans `utils/` (calculs ARE, filtrage contrats, franchises) → `tests/unit/`

## Pattern Gherkin (.feature)

- Une `Feature:` par fichier, en français
- Scénarios en français, descriptifs
- Utiliser des regex dans les steps quand on veut capturer des valeurs dynamiques (ex: `"Théâtre"`, `2500`)
- Les steps réutilisables entre scénarios d'un même fichier doivent avoir le même libellé exact

```gherkin
Feature: Description de la feature

  Scenario: Cas nominal
    Given un état initial
    When une action
    Then un résultat attendu

  Scenario: Cas d'erreur
    Given un état initial
    When une action invalide
    Then un message d'erreur
```

## Pattern Step Definitions (.steps.tsx)

### Imports standards

```tsx
import { defineFeature, loadFeature } from "jest-cucumber";
import { render, fireEvent, screen, act } from "@testing-library/react-native";
import MonScreen from "../../app/(tabs)/mon-screen";
import { ContratsProvider } from "../../contexts/ContratsContext";
```

### Structure de base

```tsx
const feature = loadFeature("tests/features/mon-ecran.feature");

const renderScreen = () =>
  render(
    <ContratsProvider>
      <MonScreen />
    </ContratsProvider>
  );

defineFeature(feature, (test) => {
  test("Nom du scénario", ({ given, when, then, and }) => {
    given("état initial", () => { ... });
    when("action", () => { ... });
    then("résultat", () => { ... });
  });
});
```

### Tests d'écrans/composants

- Toujours tester via le rendu UI : `render` + `fireEvent` + `screen`
- Toujours wrapper avec `ContratsProvider`
- Queries : `getByText`, `getByPlaceholderText`, `queryByText` (pour absence)
- Pas de tests renderHook — on teste le comportement tel que l'utilisateur le voit

### Regex dans les steps

Quand un step Gherkin contient des valeurs dynamiques entre guillemets ou des nombres :

```tsx
when(
  /^j'ajoute un contrat pour "(.*)" de (\d+) euros brut$/,
  (employeur: string, salaire: string) => { ... }
);
```

### Data Tables dans les steps

Gherkin permet de passer un tableau de données à un step. `jest-cucumber` le parse en tableau d'objets (clés = headers).

```gherkin
Given ces contrats existent
  | Employeur      | Début      | Fin        | Heures | Salaire |
  | Ancien Théâtre | 01/01/2026 | 31/01/2026 | 40     | 1500    |
  | Studio Actuel  | 01/06/2026 | 30/06/2026 | 40     | 1500    |
```

```tsx
type ContratRow = {
  Employeur: string;
  "Début": string;
  Fin: string;
  Heures: string;
  Salaire: string;
};

given("ces contrats existent", (table: ContratRow[]) => {
  renderScreen();
  table.forEach((row) => ajouterContratViaFormulaire(row));
});
```

La table est toujours le **dernier argument** de la step function, après les captures regex.

### Fixer la date courante avec un Background

Quand les scénarios dépendent de la date du jour, déclarer la date dans un `Background` Gherkin. C'est le pattern canonique du projet — ne pas mettre la date en dur dans le tsx.

**Feature** :
```gherkin
Feature: Ma feature

  Background:
    Given nous sommes le "15/06/2026"

  Scenario: Premier scénario
    Given un état initial
    Then un résultat attendu

  Scenario: Deuxième scénario
    Given un autre état
    Then un autre résultat
```

**jest-cucumber 4.x fusionne** les steps du Background dans chaque scénario au parsing — il n'y a pas de callback `background`. Chaque `test` doit donc commencer par gérer ce step.

Pour éviter la répétition, extraire un helper `fixerDateStep` :

```tsx
const fixerDateStep = (given: (pattern: RegExp, fn: (date: string) => void) => void) => {
  given(/^nous sommes le "(.*)"$/, (date: string) => {
    fixerDate(date); // helper de tests/helpers/form.tsx
  });
};

defineFeature(feature, (test) => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("Premier scénario", ({ given, then }) => {
    fixerDateStep(given); // ← obligatoire : gère le step du Background

    given("un état initial", () => { ... });
    then("un résultat attendu", () => { ... });
  });

  test("Deuxième scénario", ({ given, then }) => {
    fixerDateStep(given); // ← idem

    given("un autre état", () => { ... });
    then("un autre résultat", () => { ... });
  });
});
```

`fixerDate(ddmmyyyy)` (dans `tests/helpers/form.tsx`) appelle `jest.useFakeTimers()` et `jest.setSystemTime()`. Toujours restaurer avec `jest.useRealTimers()` dans `afterEach`.

## Pattern Tests unitaires (.test.ts)

Pour la logique métier pure (fonctions dans `utils/`), utiliser des tests unitaires classiques Jest dans `tests/unit/`.

### Structure de base

```ts
import { maFonction } from "../../utils/maFonction";

describe("maFonction", () => {
  it("cas nominal", () => {
    const resultat = maFonction(args);
    expect(resultat.valeur).toBe(attendu);
  });
});
```

### Bonnes pratiques

- Vérifier la concordance numérique avec les fonctions de calcul de référence (`calculerAJ`, `calculerAJNette`)
- Vérifier la structure des objets retournés (labels, formules, parametres)
- Vérifier que tous les `parametres` sont définis (pas de `undefined`) — protège contre les auto-références
- Tester les cas limites : plancher, plafond, seuils de cotisation, tranches 2
