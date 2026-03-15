import { defineFeature, loadFeature } from "jest-cucumber";
import { screen, within } from "@testing-library/react-native";
import { resetPickerCallbacks } from "../helpers/mocks";
import { ContratRow } from "../helpers/types";
import {
  renderScreen,
  selectDate,
  ajouterContratViaFormulaire,
  fixerDate,
} from "../helpers/form";
import { ddmmyyyyToIso } from "../helpers/date";
import { fireEvent } from "@testing-library/react-native";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/tri-contrats.feature");

const getEmployeursAffiches = (): string[] => {
  const cards = screen.getAllByTestId(/^contrat-/);
  return cards.map((card) => {
    const employeurElement = within(card).getByTestId(/^employeur-/);
    return employeurElement.props.children as string;
  });
};

const verifierOrdre = (ordreStr: string) => {
  const ordreAttendu = ordreStr.split('", "');
  const ordreAffiche = getEmployeursAffiches();
  expect(ordreAffiche).toEqual(ordreAttendu);
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    resetPickerCallbacks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Les contrats sont affichés du plus ancien au plus récent", ({
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

    then(
      /^les contrats sont affichés dans l'ordre "(.*)"$/,
      (ordreStr: string) => {
        verifierOrdre(ordreStr);
      }
    );
  });

  test("Le tri est maintenu après modification de date", ({
    given,
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

    when(
      /^je modifie les dates de "(.*)" en début "(.*)" et fin "(.*)"$/,
      (employeur: string, nouveauDebut: string, nouvelleFin: string) => {
        const cards = screen.getAllByTestId(/^contrat-/);
        const card = cards.find((c) =>
          within(c).queryByText(employeur)
        );
        expect(card).toBeDefined();
        fireEvent.press(within(card!).getByText("✎"));
        selectDate("picker-debut", ddmmyyyyToIso(nouveauDebut));
        selectDate("picker-fin", ddmmyyyyToIso(nouvelleFin));
        fireEvent.press(screen.getByText("Modifier"));
      }
    );

    then(
      /^les contrats sont affichés dans l'ordre "(.*)"$/,
      (ordreStr: string) => {
        verifierOrdre(ordreStr);
      }
    );
  });
});
