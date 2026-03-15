import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, screen } from "@testing-library/react-native";
import { resetPickerCallbacks } from "../helpers/mocks";
import { ContratRow } from "../helpers/types";
import {
  renderScreen,
  ajouterContratViaFormulaire,
  fixerDate,
} from "../helpers/form";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/contrats-passes.feature");

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
