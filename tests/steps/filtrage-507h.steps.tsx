import { defineFeature, loadFeature } from "jest-cucumber";
import { screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderAccueilScreen } from "../helpers/accueil";
import { Contrat } from "../../types/contrat";

type ContratRow = {
  Employeur: string;
  "Début": string;
  Fin: string;
  Heures: string;
  Salaire: string;
};

const feature = loadFeature("tests/features/filtrage-507h.feature");

const TEST_PROFIL_ID = "test-filtrage-id";

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
  await AsyncStorage.setItem(
    "intermittence:profils",
    JSON.stringify([{ id: TEST_PROFIL_ID, nom: "Test", annexe: "8", dateAnniversaire: "15/09/2026", salaireReference: 18000, heuresTravaillees: 600, tauxCSG: "standard", alsaceMoselle: false }])
  );
  await AsyncStorage.setItem(
    "intermittence:profilActifId",
    JSON.stringify(TEST_PROFIL_ID)
  );
};

defineFeature(feature, (test) => {
  test("Seuls les contrats dans la fenêtre de 12 mois comptent", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ces contrats existent", async (table: ContratRow[]) => {
      await injecterContrats(table);
    });

    when("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    then(
      /^la barre de progression affiche "(.*)"$/,
      async (texte: string) => {
        await waitFor(() => {
          expect(screen.getByText(texte)).toBeTruthy();
        });
      }
    );

    and("la période de référence est affichée", () => {
      expect(screen.getByTestId("periode-reference")).toBeTruthy();
    });
  });

  test("Tous les contrats dans la fenêtre sont comptés", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ces contrats existent", async (table: ContratRow[]) => {
      await injecterContrats(table);
    });

    when("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    then(
      /^la barre de progression affiche "(.*)"$/,
      async (texte: string) => {
        await waitFor(() => {
          expect(screen.getByText(texte)).toBeTruthy();
        });
      }
    );

    and(
      /^le message "(.*)" est visible$/,
      (texte: string) => {
        expect(screen.getByText(new RegExp(texte))).toBeTruthy();
      }
    );
  });

  test("Aucun contrat enregistré", ({ given, when, then, and }) => {
    given("aucun contrat n'est enregistré", () => {});

    when("l'écran d'accueil est affiché", async () => {
      await renderAccueilScreen();
    });

    then(
      /^la barre de progression affiche "(.*)"$/,
      async (texte: string) => {
        await waitFor(() => {
          expect(screen.getByText(texte)).toBeTruthy();
        });
      }
    );

    and("la période de référence n'est pas affichée", () => {
      expect(screen.queryByTestId("periode-reference")).toBeNull();
    });
  });
});
