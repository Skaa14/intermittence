import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, screen } from "@testing-library/react-native";
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

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const feature = loadFeature("tests/features/detail-calcul-aj-navigation.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    resetPickerCallbacks();
    mockPush.mockClear();
  });

  const givenAccueil = (given: Function) => {
    given("l'écran d'accueil est affiché", async () => {
      await prechargerProfilParDefaut();
      await renderAccueilScreen();
    });
  };

  const whenProfil = (step: Function) => {
    step("je configure mon profil", (table: ProfilRow[]) => {
      configurerProfilViaFormulaire(table[0]);
    });
  };

  test("Le bouton de détail apparaît quand un profil est configuré", ({ given, when, then }) => {
    givenAccueil(given);
    whenProfil(when);

    then(/^le bouton "(.*)" est visible$/, (texte: string) => {
      expect(screen.getByTestId("btn-detail-calcul")).toBeTruthy();
      expect(screen.getByText(texte)).toBeTruthy();
    });
  });

  test("Le bouton de détail navigue vers la page de détail", ({ given, and, when, then }) => {
    givenAccueil(given);
    whenProfil(and);

    when("j'appuie sur le bouton de détail du calcul", () => {
      fireEvent.press(screen.getByTestId("btn-detail-calcul"));
    });

    then(/^la navigation vers "(.*)" est déclenchée$/, (route: string) => {
      expect(mockPush).toHaveBeenCalledWith(route);
    });
  });

});
