import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, fireEvent, waitFor, RenderResult } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AccueilScreen from "../../app/(tabs)/index";
import { ContratsProvider } from "../../contexts/ContratsContext";
import { ProfilProvider } from "../../contexts/ProfilContext";
import { DonneesTestProvider } from "../../contexts/DonneesTestContext";
import { ProfilRow, configurerProfilViaFormulaire } from "../helpers/accueil";
import { resetPickerCallbacks } from "../helpers/mocks";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/persistance.feature");

const renderAccueil = () =>
  render(
    <ContratsProvider>
      <ProfilProvider>
        <DonneesTestProvider>
          <AccueilScreen />
        </DonneesTestProvider>
      </ProfilProvider>
    </ContratsProvider>
  );

defineFeature(feature, (test) => {
  let vue: RenderResult;

  beforeEach(async () => {
    await AsyncStorage.clear();
    resetPickerCallbacks();
  });

  test("Les contrats et le profil sont restaurés au redémarrage", ({
    given,
    when,
    then,
    and,
  }) => {
    given(
      /^je charge les données de test "(.*)" sur l'écran d'accueil$/,
      (type: string) => {
        vue = renderAccueil();
        fireEvent.press(screen.getByTestId(`btn-demo-${type}`));
      }
    );

    when("l'application redémarre", async () => {
      vue.unmount();
      vue = renderAccueil();
      await waitFor(() => {
        expect(screen.getByTestId("aj-value")).toBeTruthy();
      });
    });

    then("l'indemnité journalière estimée est affichée", () => {
      expect(screen.getByTestId("aj-value")).toBeTruthy();
    });

    and("le dashboard affiche des contrats", () => {
      const count = screen.getByTestId("contrats-count");
      expect(Number(count.props.children)).toBeGreaterThan(0);
    });
  });

  test("Le profil configuré manuellement est restauré au redémarrage", ({
    given,
    when,
    then,
  }) => {
    given(
      "je configure un profil sur l'écran d'accueil",
      (table: ProfilRow[]) => {
        vue = renderAccueil();
        configurerProfilViaFormulaire(table[0]);
      }
    );

    when("l'application redémarre", async () => {
      vue.unmount();
      vue = renderAccueil();
      await waitFor(() => {
        expect(screen.getByTestId("aj-value")).toBeTruthy();
      });
    });

    then("l'indemnité journalière estimée est affichée", () => {
      expect(screen.getByTestId("aj-value")).toBeTruthy();
    });
  });

  test("La réinitialisation supprime les données persistées", ({
    given,
    when,
    then,
    and,
  }) => {
    given(
      /^je charge les données de test "(.*)" sur l'écran d'accueil$/,
      (type: string) => {
        vue = renderAccueil();
        fireEvent.press(screen.getByTestId(`btn-demo-${type}`));
      }
    );

    when("le storage est vidé et l'application redémarre", async () => {
      vue.unmount();
      await AsyncStorage.clear();
      vue = renderAccueil();
      await waitFor(() => {
        expect(screen.getByTestId("btn-configurer-profil")).toBeTruthy();
      });
    });

    then("le bouton de configuration du profil est visible", () => {
      expect(screen.getByTestId("btn-configurer-profil")).toBeTruthy();
    });

    and(
      /^le dashboard affiche "(.*)" contrats$/,
      (nombre: string) => {
        const count = screen.getByTestId("contrats-count");
        expect(count.props.children).toBe(Number(nombre));
      }
    );
  });
});
