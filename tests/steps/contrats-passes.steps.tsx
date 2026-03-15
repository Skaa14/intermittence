import { defineFeature, loadFeature } from "jest-cucumber";
import {
  render,
  fireEvent,
  screen,
  act,
} from "@testing-library/react-native";
import ContratsScreen from "../../app/(tabs)/contrats";
import { ContratsProvider } from "../../contexts/ContratsContext";
import {
  mockPickerCallbacksByTestID,
  resetPickerCallbacks,
} from "../helpers/mocks";
import { ddmmyyyyToIso } from "../helpers/date";
import { ContratRow } from "../helpers/types";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/contrats-passes.feature");

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

const ajouterContratViaFormulaire = (row: ContratRow) => {
  ouvrirFormulaire();
  fireEvent.changeText(screen.getByPlaceholderText("Employeur"), row.Employeur);
  selectDate("Date début", ddmmyyyyToIso(row["Début"]));
  selectDate("Date fin", ddmmyyyyToIso(row.Fin));
  fireEvent.changeText(screen.getByPlaceholderText("Heures"), row.Heures);
  fireEvent.changeText(
    screen.getByPlaceholderText("Salaire brut (€)"),
    row.Salaire
  );
  fireEvent.press(screen.getByText("Ajouter"));
};

const fixerDate = (ddmmyyyy: string) => {
  jest.useFakeTimers();
  const isoDate = ddmmyyyyToIso(ddmmyyyy);
  jest.setSystemTime(new Date(isoDate + "T12:00:00"));
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    resetPickerCallbacks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Les contrats passés sont masqués par défaut", ({
    given,
    then,
    and,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("ces contrats existent", (table: ContratRow[]) => {
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    then(/^le contrat "(.*)" est visible$/, (employeur: string) => {
      expect(screen.getByText(employeur)).toBeTruthy();
    });

    and(/^le contrat "(.*)" n'est pas visible$/, (employeur: string) => {
      expect(screen.queryByText(employeur)).toBeNull();
    });
  });

  test("Le bouton d'affichage indique le nombre de contrats passés", ({
    given,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("ces contrats existent", (table: ContratRow[]) => {
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    then(/^le bouton affiche (\d+) contrat passé$/, (count: string) => {
      expect(screen.getByText(`Afficher les contrats passés (${count})`)).toBeTruthy();
    });
  });

  test("Afficher les contrats passés", ({ given, when, then, and }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("ces contrats existent", (table: ContratRow[]) => {
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    when("j'appuie sur le bouton d'affichage des contrats passés", () => {
      fireEvent.press(
        screen.getByText(/Afficher les contrats passés/)
      );
    });

    then(/^le contrat "(.*)" est visible$/, (employeur: string) => {
      expect(screen.getByText(employeur)).toBeTruthy();
    });

    and(/^le contrat "(.*)" porte le badge "(.*)"$/, (employeur: string, badge: string) => {
      expect(screen.getByText(employeur)).toBeTruthy();
      expect(screen.getByText(badge)).toBeTruthy();
    });
  });

  test("Masquer les contrats passés après les avoir affichés", ({
    given,
    and,
    when,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("ces contrats existent", (table: ContratRow[]) => {
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    and("les contrats passés sont affichés", () => {
      fireEvent.press(
        screen.getByText(/Afficher les contrats passés/)
      );
    });

    when("j'appuie sur le bouton de masquage des contrats passés", () => {
      fireEvent.press(
        screen.getByText(/Masquer les contrats passés/)
      );
    });

    then(/^le contrat "(.*)" n'est pas visible$/, (employeur: string) => {
      expect(screen.queryByText(employeur)).toBeNull();
    });
  });

  test("Message vide quand tous les contrats sont passés et masqués", ({
    given,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("ces contrats existent", (table: ContratRow[]) => {
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    then(/^le message "(.*)" est visible$/, (message: string) => {
      expect(screen.getByText(message)).toBeTruthy();
    });
  });

  test("Message vide quand aucun contrat n'existe", ({
    given,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("aucun contrat n'existe", () => {
      renderScreen();
    });

    then(/^le message "(.*)" est visible$/, (message: string) => {
      expect(screen.getByText(message)).toBeTruthy();
    });
  });

  test("Pas de bouton quand il n'y a aucun contrat passé", ({
    given,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("ces contrats existent", (table: ContratRow[]) => {
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    then("le bouton d'affichage des contrats passés n'existe pas", () => {
      expect(screen.queryByText(/contrats passés/)).toBeNull();
    });
  });
});
