import { defineFeature, loadFeature } from "jest-cucumber";
import { render, fireEvent, screen, within, act } from "@testing-library/react-native";
import VueMensuelleScreen from "../../app/(tabs)/vue-mensuelle";
import { ContratsProvider, useContrats } from "../../contexts/ContratsContext";
import { ProfilProvider, useProfil } from "../../contexts/ProfilContext";
import { FormationsProvider } from "../../contexts/FormationsContext";
import { EnseignementsProvider } from "../../contexts/EnseignementsContext";
import { ProfilIntermittent } from "../../types/profil";
import { Contrat } from "../../types/contrat";
import { ContratRow } from "../helpers/types";
import { fixerDate } from "../helpers/form";
import { flushAsync } from "../helpers/act";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

type ProfilRow = {
  Annexe: string;
  Heures: string;
  Salaire: string;
  "Date anniversaire": string;
};

let capturedAjouterContrat: ((c: Omit<Contrat, "id">) => void) | null = null;
let capturedMettreAJourProfil: ((p: ProfilIntermittent) => void) | null = null;

function Setup() {
  const { mettreAJourProfil } = useProfil();
  const { ajouterContrat } = useContrats();
  capturedAjouterContrat = ajouterContrat;
  capturedMettreAJourProfil = mettreAJourProfil;
  return <VueMensuelleScreen />;
}

const renderScreen = async () => {
  const result = render(
    <ProfilProvider>
      <ContratsProvider>
        <FormationsProvider>
          <EnseignementsProvider>
            <Setup />
          </EnseignementsProvider>
        </FormationsProvider>
      </ContratsProvider>
    </ProfilProvider>
  );
  await flushAsync();
  return result;
};

const fixerDateStep = (given: (pattern: RegExp, fn: (date: string) => void) => void) => {
  given(/^nous sommes le "(.*)"$/, (date: string) => {
    fixerDate(date);
  });
};

const configurerProfil = (row: ProfilRow) => {
  act(() => {
    capturedMettreAJourProfil!({
      annexe: row.Annexe as "8" | "10",
      heuresTravaillees: Number(row.Heures),
      salaireReference: Number(row.Salaire),
      dateAnniversaire: row["Date anniversaire"],
    });
  });
};

const ajouterContrats = (table: ContratRow[]) => {
  table.forEach((row) => {
    act(() => {
      capturedAjouterContrat!({
        employeur: row.Employeur,
        dateDebut: row["Début"],
        dateFin: row.Fin,
        heures: Number(row.Heures),
        salaireBrut: Number(row.Salaire),
      });
    });
  });
};

const feature = loadFeature("tests/features/vue-mensuelle.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    capturedAjouterContrat = null;
    capturedMettreAJourProfil = null;
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Profil non configuré - invitation à configurer", ({ given, then }) => {
    fixerDateStep(given);

    given("le profil n'est pas configuré", async () => {
      await renderScreen();
    });

    then("le message d'invitation à configurer le profil est visible", () => {
      expect(screen.getByTestId("message-profil-manquant")).toBeTruthy();
    });
  });

  test("12 cartes affichées avec profil configuré", ({ given, then }) => {
    fixerDateStep(given);

    given("le profil est configuré", async (table: ProfilRow[]) => {
      await renderScreen();
      configurerProfil(table[0]);
    });

    then("12 cartes de mois sont affichées", () => {
      const cartes = screen.getAllByTestId(/^carte-mois-\d+$/);
      expect(cartes).toHaveLength(12);
    });
  });

  test("Heures travaillées affichées sur la carte d'un mois avec contrat", ({
    given,
    and,
    then,
  }) => {
    fixerDateStep(given);

    given("le profil est configuré", async (table: ProfilRow[]) => {
      await renderScreen();
      configurerProfil(table[0]);
    });

    and("ces contrats existent", (table: ContratRow[]) => {
      ajouterContrats(table);
    });

    then(
      /^la carte du mois (\d+) affiche "(.*)"$/,
      (index: string, texte: string) => {
        const carte = screen.getByTestId(`carte-mois-${index}`);
        expect(within(carte).getByText(texte)).toBeTruthy();
      }
    );

    and(
      /^la carte du mois (\d+) affiche "(.*)" pour les jours de formation$/,
      (index: string, texte: string) => {
        const carte = screen.getByTestId(`carte-mois-${index}`);
        expect(within(carte).getByText(texte)).toBeTruthy();
      }
    );
  });

  test("Jours indemnisés affichés sur la carte", ({ given, then }) => {
    fixerDateStep(given);

    given("le profil est configuré", async (table: ProfilRow[]) => {
      await renderScreen();
      configurerProfil(table[0]);
    });

    then(
      /^la carte du mois (\d+) affiche les jours indemnisés$/,
      (index: string) => {
        const carte = screen.getByTestId(`carte-mois-${index}`);
        expect(within(carte).getByText("Jours indemnisés")).toBeTruthy();
        const lignes = within(carte).getAllByText(/^\d+ j$/);
        expect(lignes.length).toBeGreaterThanOrEqual(1);
      }
    );
  });

  test("Navigation vers le détail d'un mois", ({ given, when, then }) => {
    fixerDateStep(given);

    given("le profil est configuré", async (table: ProfilRow[]) => {
      await renderScreen();
      configurerProfil(table[0]);
    });

    when(/^je tape sur la carte du mois (\d+)$/, (index: string) => {
      fireEvent.press(screen.getByTestId(`carte-mois-${index}`));
    });

    then(/^je suis redirigé vers "(.*)"$/, (route: string) => {
      expect(mockPush).toHaveBeenCalledWith(route);
    });
  });
});
