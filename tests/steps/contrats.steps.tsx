import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, screen, act, within } from "@testing-library/react-native";
import { Alert, AlertButton } from "react-native";
import { ContratRow } from "../helpers/types";
import {
  renderScreen,
  ajouterContratViaFormulaire,
  fixerDate,
} from "../helpers/form";
import { resetPickerCallbacks } from "../helpers/mocks";

jest.mock("react-native-calendars", () =>
  require("../helpers/mocks").mockCalendarsFactory()
);

const feature = loadFeature("tests/features/contrats.feature");

let alertSpy: jest.SpyInstance;
let lastAlertButtons: AlertButton[];

defineFeature(feature, (test) => {
  beforeEach(() => {
    resetPickerCallbacks();
    lastAlertButtons = [];
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(
      (_title, _message, buttons) => {
        lastAlertButtons = buttons ?? [];
      }
    );
  });

  afterEach(() => {
    alertSpy.mockRestore();
    jest.useRealTimers();
  });

  test("Aucun contrat au démarrage", ({ given, then }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("l'écran contrats est affiché", async () => {
      await renderScreen();
    });

    then(/^le message "(.*)" est visible$/, (message: string) => {
      expect(screen.getByText(message)).toBeTruthy();
    });
  });

  test("Ajout d'un contrat", ({ given, when, then }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("l'écran contrats est affiché", async () => {
      await renderScreen();
    });

    when("j'ajoute ce contrat", (table: ContratRow[]) => {
      ajouterContratViaFormulaire(table[0]);
    });

    then(/^le contrat "(.*)" est visible dans la liste$/, (employeur: string) => {
      expect(screen.getByText(employeur)).toBeTruthy();
    });
  });

  test("Suppression d'un contrat", ({ given, when, then, and }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("l'écran contrats est affiché", async () => {
      await renderScreen();
    });

    and("j'ajoute ce contrat", (table: ContratRow[]) => {
      ajouterContratViaFormulaire(table[0]);
    });

    when(/^je supprime le contrat "(.*)"$/, (employeur: string) => {
      const cards = screen.getAllByTestId(/^contrat-/);
      const card = cards.find((c) => within(c).queryByText(employeur));
      expect(card).toBeDefined();
      fireEvent.press(within(card!).getByText("✕"));
      const confirmButton = lastAlertButtons.find(
        (b) => b.style === "destructive"
      );
      expect(confirmButton).toBeDefined();
      act(() => {
        confirmButton?.onPress?.();
      });
    });

    then(/^le message "(.*)" est visible$/, (message: string) => {
      expect(screen.getByText(message)).toBeTruthy();
    });
  });
});
