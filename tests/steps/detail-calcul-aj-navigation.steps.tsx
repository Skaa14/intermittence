import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, screen } from "@testing-library/react-native";
import {
  renderAccueilScreen,
  prechargerProfil,
  ProfilRow,
} from "../helpers/accueil";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const feature = loadFeature("tests/features/detail-calcul-aj-navigation.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test("Le bouton de détail apparaît quand un profil est configuré", ({ given, when, then }) => {
    given("un profil est configuré", async (table: ProfilRow[]) => {
      await prechargerProfil(table[0]);
    });

    when("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    then(/^le bouton "(.*)" est visible$/, (texte: string) => {
      expect(screen.getByTestId("btn-detail-calcul")).toBeTruthy();
      expect(screen.getByText(texte)).toBeTruthy();
    });
  });

  test("Le bouton de détail navigue vers la page de détail", ({ given, when, and, then }) => {
    given("un profil est configuré", async (table: ProfilRow[]) => {
      await prechargerProfil(table[0]);
    });

    when("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    and("j'appuie sur le bouton de détail du calcul", () => {
      fireEvent.press(screen.getByTestId("btn-detail-calcul"));
    });

    then(/^la navigation vers "(.*)" est déclenchée$/, (route: string) => {
      expect(mockPush).toHaveBeenCalledWith(route);
    });
  });
});
