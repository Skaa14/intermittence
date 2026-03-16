import { defineFeature, loadFeature } from "jest-cucumber";
import { screen, fireEvent } from "@testing-library/react-native";
import { renderAccueilScreen } from "../helpers/accueil";

const feature = loadFeature("tests/features/donnees-test.feature");

defineFeature(feature, (test) => {
  test("Les boutons de démo sont visibles", ({ given, then }) => {
    given("l'écran d'accueil est affiché", () => {
      renderAccueilScreen();
    });

    then("les boutons de données de test sont visibles", () => {
      expect(screen.getByTestId("btn-demo-artiste")).toBeTruthy();
      expect(screen.getByTestId("btn-demo-technicien")).toBeTruthy();
    });
  });

  test("Chargement du profil artiste", ({ given, when, then }) => {
    given("l'écran d'accueil est affiché", () => {
      renderAccueilScreen();
    });

    when(/^je charge les données de test "(.*)"$/, (type: string) => {
      fireEvent.press(screen.getByTestId(`btn-demo-${type}`));
    });

    then("l'indemnité journalière estimée est affichée", () => {
      expect(screen.getByTestId("aj-value")).toBeTruthy();
    });
  });

  test("Chargement du profil technicien", ({ given, when, then }) => {
    given("l'écran d'accueil est affiché", () => {
      renderAccueilScreen();
    });

    when(/^je charge les données de test "(.*)"$/, (type: string) => {
      fireEvent.press(screen.getByTestId(`btn-demo-${type}`));
    });

    then("l'indemnité journalière estimée est affichée", () => {
      expect(screen.getByTestId("aj-value")).toBeTruthy();
    });
  });
});
