import { defineFeature, loadFeature } from "jest-cucumber";
import {
  render,
  fireEvent,
  screen,
  within,
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
import { formatDate } from "../../utils/date";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/modification-contrat.feature");

const renderScreen = () =>
  render(
    <ContratsProvider>
      <ContratsScreen />
    </ContratsProvider>
  );

const selectDate = (buttonLabel: string, testID: string, dateStr: string) => {
  fireEvent.press(screen.getByText(buttonLabel));
  const date = new Date(dateStr + "T00:00:00");
  const callback = mockPickerCallbacksByTestID[testID];
  act(() => {
    callback({ type: "set" }, date);
  });
};

const ajouterContratViaFormulaire = (row: ContratRow) => {
  fireEvent.press(screen.getByText("+ Nouveau contrat"));
  fireEvent.changeText(screen.getByPlaceholderText("Employeur"), row.Employeur);
  selectDate("Date début", "picker-debut", ddmmyyyyToIso(row["Début"]));
  selectDate("Date fin", "picker-fin", ddmmyyyyToIso(row.Fin));
  fireEvent.changeText(screen.getByPlaceholderText("Heures"), row.Heures);
  fireEvent.changeText(
    screen.getByPlaceholderText("Salaire brut (€)"),
    row.Salaire
  );
  fireEvent.press(screen.getByText("Ajouter"));
};

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
        fireEvent.changeText(screen.getByPlaceholderText("Employeur"), nouvelEmployeur);
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
          screen.getByPlaceholderText("Salaire brut (€)"),
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
    let contratOriginal: ContratRow;

    given(/^nous sommes le "(.*)"$/, (date: string) => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(ddmmyyyyToIso(date) + "T12:00:00"));
    });

    and("un contrat existant :", (table: ContratRow[]) => {
      contratOriginal = table[0];
      renderScreen();
      table.forEach((row) => ajouterContratViaFormulaire(row));
    });

    when(
      /^je modifie les dates du contrat "(.*)" en "(.*)" → "(.*)"$/,
      (employeur: string, newDebut: string, newFin: string) => {
        const carte = trouverCarte(employeur);
        fireEvent.press(within(carte).getByText("✎"));
        const ancienDebut = formatDate(new Date(ddmmyyyyToIso(contratOriginal["Début"]) + "T00:00:00"));
        const ancienFin = formatDate(new Date(ddmmyyyyToIso(contratOriginal.Fin) + "T00:00:00"));
        selectDate(ancienDebut, "picker-debut", ddmmyyyyToIso(newDebut));
        selectDate(ancienFin, "picker-fin", ddmmyyyyToIso(newFin));
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
