import { defineFeature, loadFeature } from "jest-cucumber";
import {
  render,
  fireEvent,
  screen,
  act,
} from "@testing-library/react-native";
import ContratsScreen from "../../app/(tabs)/contrats";
import { ContratsProvider } from "../../contexts/ContratsContext";

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

const feature = loadFeature("tests/features/formulaire-contrat.feature");

const renderScreen = () =>
  render(
    <ContratsProvider>
      <ContratsScreen />
    </ContratsProvider>
  );

const ouvrirFormulaire = () => {
  fireEvent.press(screen.getByText("+ Nouveau contrat"));
};

const selectDate = (buttonLabel: string, dateStr: string) => {
  fireEvent.press(screen.getByText(buttonLabel));
  const date = new Date(dateStr + "T00:00:00");
  const testID = buttonLabel === "Date début" ? "picker-debut" : "picker-fin";
  const callback = mockPickerCallbacksByTestID[testID];
  act(() => {
    callback({ type: "set" }, date);
  });
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    Object.keys(mockPickerCallbacksByTestID).forEach(
      (key) => delete mockPickerCallbacksByTestID[key]
    );
  });

  test("Ouverture du formulaire", ({ given, when, then }) => {
    given("l'écran contrats est affiché", () => {
      renderScreen();
    });

    when(/^j'appuie sur "(.*)"$/, (texte: string) => {
      fireEvent.press(screen.getByText(`+ ${texte}`));
    });

    then("le formulaire de saisie est visible", () => {
      expect(screen.getByPlaceholderText("Employeur")).toBeTruthy();
      expect(screen.getByText("Date début")).toBeTruthy();
      expect(screen.getByText("Date fin")).toBeTruthy();
    });
  });

  test("Sélection des dates via le picker", ({ given, when, and, then }) => {
    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    when(/^je sélectionne la date début "(.*)"$/, (dateStr: string) => {
      selectDate("Date début", dateStr);
    });

    and(/^je sélectionne la date fin "(.*)"$/, (dateStr: string) => {
      selectDate("Date fin", dateStr);
    });

    then(/^la date début affichée est "(.*)"$/, (formatted: string) => {
      expect(screen.getByText(formatted)).toBeTruthy();
    });

    and(/^la date fin affichée est "(.*)"$/, (formatted: string) => {
      expect(screen.getByText(formatted)).toBeTruthy();
    });
  });

  test("Date début après date fin réinitialise date fin", ({
    given,
    and,
    when,
    then,
  }) => {
    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    and(/^je sélectionne la date fin "(.*)"$/, (dateStr: string) => {
      selectDate("Date fin", dateStr);
    });

    when(/^je sélectionne la date début "(.*)"$/, (dateStr: string) => {
      expect(screen.queryByText("Date fin")).toBeNull();
      selectDate("Date début", dateStr);
    });

    then("la date fin est réinitialisée", () => {
      expect(screen.getByText("Date fin")).toBeTruthy();
    });
  });

  test("Date fin avant date début réinitialise date début", ({
    given,
    and,
    when,
    then,
  }) => {
    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    and(/^je sélectionne la date début "(.*)"$/, (dateStr: string) => {
      selectDate("Date début", dateStr);
    });

    when(/^je sélectionne la date fin "(.*)"$/, (dateStr: string) => {
      expect(screen.queryByText("Date début")).toBeNull();
      selectDate("Date fin", dateStr);
    });

    then("la date début est réinitialisée", () => {
      expect(screen.getByText("Date début")).toBeTruthy();
    });
  });

  test("Soumission avec champs manquants ne crée pas de contrat", ({
    given,
    when,
    then,
  }) => {
    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    when(/^j'appuie sur "(.*)" sans remplir le formulaire$/, (texte: string) => {
      fireEvent.press(screen.getByText(texte));
    });

    then("aucun contrat n'est ajouté", () => {
      expect(screen.getByText("Aucun contrat. Ajoute ton premier contrat !")).toBeTruthy();
    });
  });

  test("Ajout d'un contrat complet via le formulaire", ({
    given,
    when,
    and,
    then,
  }) => {
    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    when("je remplis le formulaire avec des données valides", () => {
      fireEvent.changeText(
        screen.getByPlaceholderText("Employeur"),
        "Opéra de Paris"
      );
      selectDate("Date début", "2026-03-01");
      selectDate("Date fin", "2026-03-15");
      fireEvent.changeText(screen.getByPlaceholderText("Heures"), "80");
      fireEvent.changeText(
        screen.getByPlaceholderText("Salaire brut (€)"),
        "2500"
      );
    });

    and(/^j'appuie sur "(.*)"$/, (texte: string) => {
      fireEvent.press(screen.getByText(texte));
    });

    then("le contrat apparaît dans la liste", () => {
      expect(screen.getByText("Opéra de Paris")).toBeTruthy();
    });
  });
});
