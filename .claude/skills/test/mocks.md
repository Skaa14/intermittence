# Mocks de test

Catalogue des mocks existants dans le projet. Réutilise-les tel quel au lieu de les réinventer.

## DateTimePicker

Le mock capture les callbacks `onChange` via `testID` pour pouvoir simuler la sélection de dates :

```tsx
type MockPickerCallback = (event: any, date?: Date) => void;
const mockPickerCallbacksByTestID: Record<string, MockPickerCallback> = {};

jest.mock("@react-native-community/datetimepicker", () => {
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) => {
      if (props.testID) {
        mockPickerCallbacksByTestID[props.testID] = props.onChange;
      }
      return (
        <View testID={props.testID ?? "datetime-picker"}>
          <Text testID="picker-value">{props.value?.toISOString()}</Text>
        </View>
      );
    },
  };
});
```

Réinitialiser dans `beforeEach` :
```tsx
Object.keys(mockPickerCallbacksByTestID).forEach(
  (key) => delete mockPickerCallbacksByTestID[key]
);
```

Simuler une sélection :
```tsx
const callback = mockPickerCallbacksByTestID["picker-debut"];
act(() => { callback({ type: "set" }, new Date("2026-03-01T00:00:00")); });
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
