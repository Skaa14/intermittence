# Patterns de test

## Stack

- **Jest** via `jest-expo` preset
- **React Native Testing Library** (`@testing-library/react-native`)
- **jest-cucumber** pour le BDD (Gherkin → step definitions)
- Config : `jest.config.js` (testMatch sur `tests/steps/**/*.steps.tsx`)
- Commande : `npm test`

## Structure des fichiers

```
tests/
├── features/           ← Fichiers Gherkin (.feature)
│   └── mon-ecran.feature
└── steps/              ← Step definitions (.steps.tsx)
    └── mon-ecran.steps.tsx
```

Chaque `.feature` a un `.steps.tsx` correspondant avec le même nom de base.

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

### Deux types de tests

1. **Tests de hooks/contexte** (logique pure, sans rendu) :
   - Utiliser `renderHook` + `act` de RNTL
   - Wrapper avec le Provider
   ```tsx
   const wrapper = ({ children }: { children: React.ReactNode }) => (
     <ContratsProvider>{children}</ContratsProvider>
   );
   const hook = renderHook(() => useContrats(), { wrapper });
   act(() => { hook.result.current.ajouterContrat({...}); });
   ```

2. **Tests d'écrans/composants** (rendu + interactions) :
   - Utiliser `render` + `fireEvent` + `screen`
   - Toujours wrapper avec `ContratsProvider`
   - Queries : `getByText`, `getByPlaceholderText`, `queryByText` (pour absence)

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

### Fake timers pour les dates

Quand un test dépend de la date du jour, fixer le temps avec `jest.useFakeTimers()` pour éviter que le test casse dans le futur :

```tsx
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-06-15T12:00:00"));
});

afterEach(() => {
  jest.useRealTimers();
});
```
