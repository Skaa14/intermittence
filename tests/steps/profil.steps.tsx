import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, screen } from "@testing-library/react-native";
import { useProfils } from "../../contexts/ProfilsContext";
import { resetPickerCallbacks } from "../helpers/mocks";
import {
  renderAccueilScreen,
  configurerProfilViaFormulaire,
  ouvrirFormulaireProfil,
  ProfilRow,
} from "../helpers/accueil";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/profil.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    resetPickerCallbacks();
  });

  test("Pas de profil au démarrage", ({ given, then }) => {
    given("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    then("le bouton de configuration du profil est visible", () => {
      expect(screen.getByTestId("btn-configurer-profil")).toBeTruthy();
    });
  });

  test("Configuration du profil", ({ given, when, then }) => {
    given("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    when("je configure mon profil", (table: ProfilRow[]) => {
      configurerProfilViaFormulaire(table[0]);
    });

    then("l'indemnité journalière estimée est affichée", () => {
      expect(screen.getByTestId("aj-value")).toBeTruthy();
    });
  });

  test("Le nom du profil est affiché dans la carte AJ", ({ given, when, then }) => {
    given("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    when("je configure mon profil", (table: ProfilRow[]) => {
      configurerProfilViaFormulaire(table[0]);
    });

    then(/^la carte AJ contient "(.*)"$/, (texte: string) => {
      const escaped = texte.replace(/[()]/g, "\\$&");
      expect(screen.getByText(new RegExp(escaped))).toBeTruthy();
    });
  });

  test("Modification du profil existant", ({ given, when, then, and }) => {
    given("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    and("je configure mon profil", (table: ProfilRow[]) => {
      configurerProfilViaFormulaire(table[0]);
    });

    when("je reconfigure mon profil", (table: ProfilRow[]) => {
      configurerProfilViaFormulaire(table[0]);
    });

    then(/^l'annexe affichée est "(.*)"$/, (annexe: string) => {
      expect(screen.getByText(new RegExp(`Annexe ${annexe}`))).toBeTruthy();
    });
  });

  test("Le bouton Valider est désactivé si le nom est vide", ({ given, when, then }) => {
    given("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    when("j'ouvre le formulaire profil", () => {
      ouvrirFormulaireProfil();
    });

    then("le bouton Valider est désactivé", () => {
      const btn = screen.getByTestId("btn-valider-profil");
      expect(btn.props.accessibilityState?.disabled).toBe(true);
    });
  });

  test("Erreur hors du Provider", ({ then }) => {
    then("useProfils lance une erreur si utilisé hors du Provider", () => {
      expect(() => {
        renderHook(() => useProfils());
      }).toThrow("useProfils doit être utilisé dans un ProfilsProvider");
    });
  });
});
