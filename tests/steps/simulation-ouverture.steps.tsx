import { defineFeature, loadFeature } from "jest-cucumber";
import { screen, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderAccueilScreen } from "../helpers/accueil";
import { Contrat } from "../../types/contrat";
import { ProfilIntermittent } from "../../types/profil";

type ContratRow = {
  Employeur: string;
  "Début": string;
  Fin: string;
  Heures: string;
  Salaire: string;
};

const feature = loadFeature("tests/features/simulation-ouverture.feature");

const TEST_PROFIL_ID = "test-simulation-id";

const injecterContrats = async (rows: ContratRow[]) => {
  const contrats: Contrat[] = rows.map((row, i) => ({
    id: String(i + 1),
    employeur: row.Employeur,
    dateDebut: row["Début"],
    dateFin: row.Fin,
    heures: Number(row.Heures),
    salaireBrut: Number(row.Salaire),
  }));
  await AsyncStorage.setItem(
    `intermittence:profil:${TEST_PROFIL_ID}:contrats`,
    JSON.stringify(contrats)
  );
};

const injecterProfil = async (annexe: string) => {
  const p: ProfilIntermittent = {
    id: TEST_PROFIL_ID,
    nom: "Test",
    annexe: annexe as "8" | "10",
    dateAnniversaire: "15/09/2026",
    salaireReference: 18000,
    heuresTravaillees: 600,
    tauxCSG: "standard",
    alsaceMoselle: false,
  };
  await AsyncStorage.setItem("intermittence:profils", JSON.stringify([p]));
  await AsyncStorage.setItem("intermittence:profilActifId", JSON.stringify(TEST_PROFIL_ID));
};

defineFeature(feature, (test) => {
  test("La section simulation n'apparaît pas sous 507h", ({
    given,
    and,
    when,
    then,
  }) => {
    given("ces contrats existent", async (table: ContratRow[]) => {
      await injecterContrats(table);
    });

    and(/^un profil annexe "(.*)" est configuré$/, async (annexe: string) => {
      await injecterProfil(annexe);
    });

    when("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    then("la section simulation n'est pas visible", () => {
      expect(screen.queryByTestId("simulation-section")).toBeNull();
    });
  });

  test("La section simulation apparaît quand 507h atteint avec profil", ({
    given,
    and,
    when,
    then,
  }) => {
    given("ces contrats existent", async (table: ContratRow[]) => {
      await injecterContrats(table);
    });

    and(/^un profil annexe "(.*)" est configuré$/, async (annexe: string) => {
      await injecterProfil(annexe);
    });

    when("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    then("la section simulation est visible", async () => {
      await waitFor(() => {
        expect(screen.getByTestId("simulation-section")).toBeTruthy();
      });
    });

    and(/^le chip "(.*)" est visible$/, (texte: string) => {
      expect(screen.getByText(texte)).toBeTruthy();
    });
  });

  test("Sélectionner un contrat affiche les résultats de simulation", ({
    given,
    and,
    when,
    then,
  }) => {
    given("ces contrats existent", async (table: ContratRow[]) => {
      await injecterContrats(table);
    });

    and(/^un profil annexe "(.*)" est configuré$/, async (annexe: string) => {
      await injecterProfil(annexe);
    });

    when("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    and(/^je sélectionne le chip "(.*)"$/, async (texte: string) => {
      await waitFor(() => {
        expect(screen.getByText(texte)).toBeTruthy();
      });
      fireEvent.press(screen.getByText(texte));
    });

    then("les résultats de simulation sont affichés", async () => {
      await waitFor(() => {
        expect(screen.getByTestId("simulation-resultats")).toBeTruthy();
        expect(screen.getByTestId("simulation-aj-brute")).toBeTruthy();
        expect(screen.getByTestId("simulation-aj-nette")).toBeTruthy();
      });
    });
  });

});
