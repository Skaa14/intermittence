import { defineFeature, loadFeature } from "jest-cucumber";
import { screen } from "@testing-library/react-native";
import {
  renderAccueilScreen,
  prechargerProfil,
  ProfilRow,
} from "../helpers/accueil";

const feature = loadFeature("tests/features/indemnite-journaliere.feature");

defineFeature(feature, (test) => {
  const givenProfil = (given: Function) => {
    given("un profil est configuré", async (table: ProfilRow[]) => {
      await prechargerProfil(table[0]);
    });
  };

  const whenAccueil = (when: Function) => {
    when("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
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
    givenProfil(given);
    whenAccueil(when);
    thenAJ(then);
  });

  test("Calcul AJ annexe 10 cas standard", ({ given, when, then }) => {
    givenProfil(given);
    whenAccueil(when);
    thenAJ(then);
  });

  test("Plancher annexe 8", ({ given, when, then }) => {
    givenProfil(given);
    whenAccueil(when);
    thenAJ(then);
  });

  test("Plancher annexe 10", ({ given, when, then }) => {
    givenProfil(given);
    whenAccueil(when);
    thenAJ(then);
  });

  test("Exemple 6 du guide France Travail (annexe 8, 800h, 18000 euros)", ({ given, when, then }) => {
    givenProfil(given);
    whenAccueil(when);
    thenAJ(then);
  });

  test("AJ avec heures au-dessus du seuil NHT annexe 8", ({ given, when, then }) => {
    givenProfil(given);
    whenAccueil(when);
    thenAJ(then);
  });
});
