# Mocks de test

Catalogue des mocks existants dans le projet. Réutilise-les tel quel au lieu de les réinventer.

Les mocks partagés sont dans `tests/helpers/mocks.tsx`.

## DateTimePicker

Le mock est défini dans `tests/helpers/mocks.tsx`. Pour l'utiliser dans un fichier de steps :

```tsx
import {
  mockPickerCallbacksByTestID,
  resetPickerCallbacks,
} from "../helpers/mocks";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);
```

**Important** : `jest.mock()` est hoisted au-dessus des imports par Jest. On ne peut pas référencer des variables importées dans la factory, sauf si elles commencent par `mock`. C'est pourquoi on utilise `require()` dans la factory au lieu de l'import direct.

Réinitialiser dans `beforeEach` :
```tsx
resetPickerCallbacks();
```

Simuler une sélection :
```tsx
const callback = mockPickerCallbacksByTestID["picker-debut"];
act(() => { callback({ type: "set" }, new Date("2026-03-01T00:00:00")); });
```

## expo-router (useRouter)

Pour tester la navigation, mocker `expo-router` avec une variable commençant par `mock` (règle Jest anti-TDZ) :

```tsx
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));
```

Réinitialiser dans `beforeEach` :
```tsx
mockPush.mockClear();
```

Vérifier la navigation :
```tsx
expect(mockPush).toHaveBeenCalledWith("/mois/0");
```

## Alert.alert

Pour tester les dialogues de confirmation, spy sur `Alert.alert` :

```tsx
let alertSpy: jest.SpyInstance;
let lastAlertButtons: any[];

beforeEach(() => {
  lastAlertButtons = [];
  alertSpy = jest.spyOn(Alert, "alert").mockImplementation(
    (_title, _message, buttons) => {
      lastAlertButtons = buttons ?? [];
    }
  );
});

afterEach(() => {
  alertSpy.mockRestore();
});
```

Pour simuler un tap sur un bouton de l'alerte :
```tsx
expect(alertSpy).toHaveBeenCalled();
const button = lastAlertButtons.find((b: any) => b.style === "destructive");
expect(button).toBeDefined();
act(() => { button?.onPress?.(); });
```

## AsyncStorage

Le mock est configuré globalement dans `jest.config.js` via `moduleNameMapper` :

```js
"^@react-native-async-storage/async-storage$":
  "@react-native-async-storage/async-storage/jest/async-storage-mock",
```

Le storage est vidé automatiquement avant chaque test via `tests/setup.ts` (`setupFilesAfterEnv`).

Pour tester la persistance (simuler un redémarrage) :

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. Render et interagir avec l'app
vue = renderAccueil();
fireEvent.press(screen.getByTestId("btn-demo-technicien"));

// 2. Unmount (simule fermeture)
vue.unmount();

// 3. Re-render (simule réouverture) — les données sont restaurées depuis le mock
vue = renderAccueil();
await waitFor(() => {
  expect(screen.getByTestId("aj-value")).toBeTruthy();
});
```

**Important** : utiliser `vue.unmount()` (pas `cleanup()`) pour éviter les erreurs "Can't access .root on unmounted test renderer".
