import { defineFeature, loadFeature } from "jest-cucumber";
import {
  fireEvent,
  screen,
  within,
} from "@testing-library/react-native";
import { resetPickerCallbacks } from "../helpers/mocks";
import { ddmmyyyyToIso } from "../helpers/date";
import { ContratRow } from "../helpers/types";
import {
  renderScreen,
  selectDate,
  ajouterContratViaFormulaire,
} from "../helpers/form";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/modification-contrat.feature");

const trouverCarte = (employeur: string) => {
  const cartes = screen.getAllByTestId(/^contrat-/);
  const carte = cartes.find((c) => within(c).queryByText(employeur));
  if (!carte) throw new Error(`Carte introuvable pour "${employeur}"`);
  return carte;
};

const verifierContratsVisibles = (table: ContratRow[]) => {
  const cartes = screen.getAllByTestId(/^contrat-/);
  expect(cartes).toHaveLength(table.length);
  cartes.forEach((carte, i) => {
    const row = table[i];
    const scope = within(carte);
    expect(scope.getByText(row.Employeur)).toBeTruthy();
    expect(scope.getByText(`${row["Début"]} → ${row.Fin}`)).toBeTruthy();
    expect(scope.getByText(`${row.Heures}h`)).toBeTruthy();
    expect(scope.getByText(`${row.Salaire}€ brut`)).toBeTruthy();
  });
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    resetPickerCallbacks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Modifier l'employeur d'un contrat", ({ given, when, then }) => {
    given("un contrat existant :", (table: ContratRow[]) => {
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    when(
      /^je modifie le contrat avec l'employeur "(.*)"$/,
      (nouvelEmployeur: string) => {
        fireEvent.press(screen.getByText("✎"));
        fireEvent.changeText(screen.getByTestId("input-employeur"), nouvelEmployeur);
        fireEvent.press(screen.getByText("Modifier"));
      }
    );

    then("les contrats visibles sont :", (table: ContratRow[]) => {
      verifierContratsVisibles(table);
    });
  });

  test("Modifier le salaire d'un contrat", ({ given, when, then }) => {
    given("un contrat existant :", (table: ContratRow[]) => {
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    when(
      /^je modifie le contrat avec un salaire de (\d+) euros brut$/,
      (nouveauSalaire: string) => {
        fireEvent.press(screen.getByText("✎"));
        fireEvent.changeText(
          screen.getByTestId("input-salaire-brut"),
          nouveauSalaire
        );
        fireEvent.press(screen.getByText("Modifier"));
      }
    );

    then("les contrats visibles sont :", (table: ContratRow[]) => {
      verifierContratsVisibles(table);
    });
  });

  test("Un contrat modifié avec des dates passées devient passé", ({ given, when, then, and }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(ddmmyyyyToIso(date) + "T12:00:00"));
    });

    and("un contrat existant :", (table: ContratRow[]) => {
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    when(
      /^je modifie les dates du contrat "(.*)" en "(.*)" → "(.*)"$/,
      (employeur: string, newDebut: string, newFin: string) => {
        const carte = trouverCarte(employeur);
        fireEvent.press(within(carte).getByText("✎"));
        selectDate("picker-debut", ddmmyyyyToIso(newDebut));
        selectDate("picker-fin", ddmmyyyyToIso(newFin));
        fireEvent.press(screen.getByText("Modifier"));
      }
    );

    and("j'affiche les contrats passés", () => {
      fireEvent.press(screen.getByText(/Afficher les contrats passés/));
    });

    then(
      /^le contrat "(.*)" porte le badge "(.*)"$/,
      (employeur: string, badge: string) => {
        const carte = trouverCarte(employeur);
        expect(within(carte).getByText(badge)).toBeTruthy();
      }
    );
  });
});
