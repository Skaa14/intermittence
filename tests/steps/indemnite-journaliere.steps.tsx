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

const feature = loadFeature("tests/features/indemnite-journaliere.feature");

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

  const thenAJ = (then: Function) => {
    then(/^l'AJ affichée est "(.*)"$/, (montant: string) => {
      expect(screen.getByTestId("aj-value")).toHaveTextContent(
        new RegExp(montant.replace(".", "\\."))
      );
    });
  };

  test("Calcul AJ annexe 8 cas standard", ({ given, when, then }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJ(then);
  });

  test("Calcul AJ annexe 10 cas standard", ({ given, when, then }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJ(then);
  });

  test("Plancher annexe 8", ({ given, when, then }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJ(then);
  });

  test("Plancher annexe 10", ({ given, when, then }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJ(then);
  });

  test("Exemple 6 du guide France Travail (annexe 8, 800h, 18000 euros)", ({
    given,
    when,
    then,
  }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJ(then);
  });

  test("AJ avec heures au-dessus du seuil NHT annexe 8", ({
    given,
    when,
    then,
  }) => {
    givenAccueil(given);
    whenProfil(when);
    thenAJ(then);
  });
});
