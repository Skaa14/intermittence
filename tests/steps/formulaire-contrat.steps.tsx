import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, screen, act } from "@testing-library/react-native";
import { Alert, AlertButton, Platform } from "react-native";
import { resetPickerCallbacks } from "../helpers/mocks";
import { ContratRow } from "../helpers/types";
import {
  renderScreen,
  ouvrirFormulaire,
  selectDate,
  ajouterContratViaFormulaire,
  fixerDate,
} from "../helpers/form";
import { ddmmyyyyToIso } from "../helpers/date";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/formulaire-contrat.feature");

let alertSpy: jest.SpyInstance;
let lastAlertButtons: AlertButton[];
const originalPlatformOS = Platform.OS;

defineFeature(feature, (test) => {
  beforeEach(() => {
    Platform.OS = originalPlatformOS as any;
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
    Platform.OS = originalPlatformOS as any;
    jest.useRealTimers();
    if (typeof window.confirm === "function" && "mockRestore" in window.confirm) {
      (window.confirm as jest.Mock).mockRestore();
    }
  });

  test("Ouverture du formulaire", ({ given, when, then }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("l'écran contrats est affiché", () => {
      renderScreen();
    });

    when('j\'appuie sur "Nouveau contrat"', () => {
      fireEvent.press(screen.getByTestId("btn-ouvrir-formulaire"));
    });

    then("le formulaire de saisie est visible", () => {
      expect(screen.getByTestId("input-employeur")).toBeTruthy();
      expect(screen.getByText("Date début")).toBeTruthy();
      expect(screen.getByText("Date fin")).toBeTruthy();
    });
  });

  test("Sélection des dates via le picker", ({ given, when, and, then }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    when(/^je sélectionne la date début "(.*)"$/, (dateStr: string) => {
      selectDate("picker-debut", dateStr);
    });

    and(/^je sélectionne la date fin "(.*)"$/, (dateStr: string) => {
      selectDate("picker-fin", dateStr);
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
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    and(/^je sélectionne la date fin "(.*)"$/, (dateStr: string) => {
      selectDate("picker-fin", dateStr);
    });

    when(/^je sélectionne la date début "(.*)"$/, (dateStr: string) => {
      expect(screen.queryByText("Date fin")).toBeNull();
      selectDate("picker-debut", dateStr);
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
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    and(/^je sélectionne la date début "(.*)"$/, (dateStr: string) => {
      selectDate("picker-debut", dateStr);
    });

    when(/^je sélectionne la date fin "(.*)"$/, (dateStr: string) => {
      expect(screen.queryByText("Date début")).toBeNull();
      selectDate("picker-fin", dateStr);
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
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

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

  const getStyleProp = (testID: string, prop: string) => {
    const el = screen.getByTestId(testID);
    const style = el.props.style;
    const flat = Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;
    return flat[prop];
  };

  test("Soumission avec champs manquants affiche les erreurs visuelles", ({
    given,
    when,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    when(/^j'appuie sur "(.*)" sans remplir le formulaire$/, (texte: string) => {
      fireEvent.press(screen.getByText(texte));
    });

    then("tous les champs ont une bordure rouge", () => {
      const ids = ["input-employeur", "input-date-debut", "input-date-fin", "input-heures", "input-salaire-brut"];
      for (const id of ids) {
        expect(getStyleProp(id, "borderColor")).toBe("#C0483A");
      }
    });
  });

  test("La bordure rouge disparaît quand on corrige un champ", ({
    given,
    and,
    when,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    and(/^j'appuie sur "(.*)" sans remplir le formulaire$/, (texte: string) => {
      fireEvent.press(screen.getByText(texte));
    });

    when(/^je remplis le champ "(.*)"$/, (champ: string) => {
      const testIdMap: Record<string, string> = {
        Employeur: "input-employeur",
        Heures: "input-heures",
        "Salaire brut (€)": "input-salaire-brut",
      };
      fireEvent.changeText(screen.getByTestId(testIdMap[champ]), "Test");
    });

    then(/^le champ "(.*)" n'a plus de bordure rouge$/, (champ: string) => {
      const testIdMap: Record<string, string> = {
        Employeur: "input-employeur",
        Heures: "input-heures",
        "Salaire brut (€)": "input-salaire-brut",
      };
      expect(getStyleProp(testIdMap[champ], "borderColor")).not.toBe("#ef4444");
    });
  });

  test("Ajout d'un contrat complet via le formulaire", ({
    given,
    when,
    and,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    when("je remplis le formulaire avec les données suivantes", (table: ContratRow[]) => {
      const row = table[0];
      fireEvent.changeText(screen.getByTestId("input-employeur"), row.Employeur);
      selectDate("picker-debut", ddmmyyyyToIso(row["Début"]));
      selectDate("picker-fin", ddmmyyyyToIso(row.Fin));
      fireEvent.changeText(screen.getByTestId("input-heures"), row.Heures);
      fireEvent.changeText(screen.getByTestId("input-salaire-brut"), row.Salaire);
    });

    and(/^j'appuie sur "(.*)"$/, (texte: string) => {
      fireEvent.press(screen.getByText(texte));
    });

    then(/^le contrat "(.*)" apparaît dans la liste$/, (employeur: string) => {
      expect(screen.getByText(employeur)).toBeTruthy();
    });
  });

  test("Annulation de la suppression conserve le contrat", ({
    given,
    when,
    and,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("un contrat existe dans la liste", (table: ContratRow[]) => {
      renderScreen();
      ajouterContratViaFormulaire(table[0]);
    });

    when("j'appuie sur supprimer", () => {
      fireEvent.press(screen.getByText("✕"));
    });

    and("j'annule la confirmation", () => {
      expect(alertSpy).toHaveBeenCalled();
      const cancelButton = lastAlertButtons.find((b) => b.style === "cancel");
      expect(cancelButton).toBeDefined();
      cancelButton?.onPress?.();
    });

    then(/^le contrat "(.*)" est toujours dans la liste$/, (employeur: string) => {
      expect(screen.getByText(employeur)).toBeTruthy();
    });
  });

  test("Confirmation de la suppression retire le contrat", ({
    given,
    when,
    and,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("un contrat existe dans la liste", (table: ContratRow[]) => {
      renderScreen();
      ajouterContratViaFormulaire(table[0]);
    });

    when("j'appuie sur supprimer", () => {
      fireEvent.press(screen.getByText("✕"));
    });

    and("je confirme la suppression", () => {
      expect(alertSpy).toHaveBeenCalled();
      const confirmButton = lastAlertButtons.find((b) => b.style === "destructive");
      expect(confirmButton).toBeDefined();
      act(() => {
        confirmButton?.onPress?.();
      });
    });

    then(/^le contrat "(.*)" n'est plus dans la liste$/, (employeur: string) => {
      expect(screen.queryByText(employeur)).toBeNull();
    });
  });

  test("Suppression web avec confirmation retire le contrat", ({
    given,
    when,
    and,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("un contrat existe dans la liste sur le web", (table: ContratRow[]) => {
      renderScreen();
      ajouterContratViaFormulaire(table[0]);
      Platform.OS = "web" as any;
    });

    when("j'appuie sur supprimer sur le web", () => {
      const mockConfirm = jest.fn().mockReturnValue(true);
      window.confirm = mockConfirm;
      fireEvent.press(screen.getByText("✕"));
    });

    and("je confirme via window.confirm", () => {
      expect(window.confirm).toHaveBeenCalled();
    });

    then(/^le contrat "(.*)" n'est plus dans la liste$/, (employeur: string) => {
      expect(screen.queryByText(employeur)).toBeNull();
    });
  });

  test("Suppression web avec annulation conserve le contrat", ({
    given,
    when,
    and,
    then,
  }) => {
    given(/^nous sommes le "(.*)"$/, (date: string) => {
      fixerDate(date);
    });

    given("un contrat existe dans la liste sur le web", (table: ContratRow[]) => {
      renderScreen();
      ajouterContratViaFormulaire(table[0]);
      Platform.OS = "web" as any;
    });

    when("j'appuie sur supprimer sur le web", () => {
      window.confirm = jest.fn().mockReturnValue(false);
      fireEvent.press(screen.getByText("✕"));
    });

    and("j'annule via window.confirm", () => {
      expect(window.confirm).toHaveBeenCalled();
    });

    then(/^le contrat "(.*)" est toujours dans la liste$/, (employeur: string) => {
      expect(screen.getByText(employeur)).toBeTruthy();
    });
  });
});
