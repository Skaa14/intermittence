import { defineFeature, loadFeature } from "jest-cucumber";
import { screen } from "@testing-library/react-native";
import { resetPickerCallbacks } from "../helpers/mocks";
import {
  renderAccueilScreen,
  configurerProfilViaFormulaire,
  prechargerProfilParDefaut,
  ProfilRow,
} from "../helpers/accueil";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/aj-nette.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    resetPickerCallbacks();
  });

  const givenAccueil = (given: Function) => {
    given("l'écran d'accueil est affiché", async () => {
      await prechargerProfilParDefaut();
      await renderAccueilScreen();
    });
  };

  const whenProfil = (when: Function) => {
    when("je configure mon profil", (table: ProfilRow[]) => {
      configurerProfilViaFormulaire(table[0]);
    });
  };

  const thenAJBrute = (then: Function) => {
    then(/^l'AJ brute affichée est "(.*)"$/, (montant: string) => {
      expect(screen.getByTestId("aj-value")).toHaveTextContent(
        new RegExp(montant.replace(".", "\\."))
      );
    });
  };

  const andAJNette = (and: Function) => {
    and(/^l'AJ nette affichée est "(.*)"$/, (montant: string) => {
      expect(screen.getByTestId("aj-nette-value")).toHaveTextContent(
        new RegExp(montant.replace(".", "\\."))
      );
    });
  };

  test("AJ brute au plancher annexe 8 (cotisation retraite seule)", ({
    given,
    when,
    then,
    and,
  }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJBrute(then);
    andAJNette(and);
  });

  test("AJ brute entre 31.96 et 60 euros (retraite complémentaire seule)", ({
    given,
    when,
    then,
    and,
  }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJBrute(then);
    andAJNette(and);
  });

  test("AJ brute au-dessus de 60 euros (toutes cotisations, CSG standard)", ({
    given,
    when,
    then,
    and,
  }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJBrute(then);
    andAJNette(and);
  });

  test("AJ nette avec CSG réduit", ({ given, when, then, and }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJBrute(then);
    andAJNette(and);
  });

  test("AJ nette avec régime Alsace-Moselle", ({
    given,
    when,
    then,
    and,
  }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJBrute(then);
    andAJNette(and);
  });
});
