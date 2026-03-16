import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, act, within } from "@testing-library/react-native";
import DetailMoisScreen from "../../app/(tabs)/mois/[index]";
import { ContratsProvider, useContrats } from "../../contexts/ContratsContext";
import { ProfilProvider, useProfil } from "../../contexts/ProfilContext";
import { ProfilIntermittent } from "../../types/profil";
import { Contrat } from "../../types/contrat";
import { ContratRow } from "../helpers/types";
import { fixerDate } from "../helpers/form";

let mockIndex = "0";

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ index: mockIndex }),
  useRouter: () => ({ navigate: jest.fn() }),
  useNavigation: () => ({ setOptions: jest.fn() }),
}));

type ProfilRow = {
  Annexe: string;
  Heures: string;
  Salaire: string;
  "Date anniversaire": string;
};

let capturedAjouterContrat: ((c: Omit<Contrat, "id">) => void) | null = null;
let capturedMettreAJourProfil: ((p: ProfilIntermittent) => void) | null = null;
let pendingProfil: ProfilRow | null = null;
let pendingContrats: ContratRow[] = [];

function Setup() {
  const { mettreAJourProfil } = useProfil();
  const { ajouterContrat } = useContrats();
  capturedAjouterContrat = ajouterContrat;
  capturedMettreAJourProfil = mettreAJourProfil;
  return <DetailMoisScreen />;
}

const renderScreen = () =>
  render(
    <ProfilProvider>
      <ContratsProvider>
        <Setup />
      </ContratsProvider>
    </ProfilProvider>
  );

const fixerDateStep = (
  given: (pattern: RegExp, fn: (date: string) => void) => void
) => {
  given(/^nous sommes le "(.*)"$/, (date: string) => {
    fixerDate(date);
  });
};

const franchiseCPStep = (
  and: (pattern: RegExp, fn: (valeur: string) => void) => void
) => {
  and(/^la franchise congés payés affichée est "(\d+)"$/, (valeur: string) => {
    expect(
      screen.getByTestId(`franchise-cp-${mockIndex}`).props.children
    ).toBe(`-${valeur} j`);
  });
};

const franchiseSalaireStep = (
  and: (pattern: RegExp, fn: (valeur: string) => void) => void
) => {
  and(/^la franchise salaire affichée est "(\d+)"$/, (valeur: string) => {
    expect(
      screen.getByTestId(`franchise-salaire-${mockIndex}`).props.children
    ).toBe(`-${valeur} j`);
  });
};

const setupMoisScreen = (index: string) => {
  mockIndex = index;
  renderScreen();
  act(() => {
    if (pendingProfil) {
      capturedMettreAJourProfil!({
        annexe: pendingProfil.Annexe as "8" | "10",
        heuresTravaillees: Number(pendingProfil.Heures),
        salaireReference: Number(pendingProfil.Salaire),
        dateAnniversaire: pendingProfil["Date anniversaire"],
      });
    }
    pendingContrats.forEach((row) => {
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

const feature = loadFeature("tests/features/mois.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    mockIndex = "0";
    capturedAjouterContrat = null;
    capturedMettreAJourProfil = null;
    pendingProfil = null;
    pendingContrats = [];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Décomposition du calcul sans contrat", ({ given, and, then }) => {
    fixerDateStep(given);

    given("le profil est configuré", (table: ProfilRow[]) => {
      pendingProfil = table[0];
    });

    and(/^je suis sur le détail du mois d'index (\d+)$/, (index: string) => {
      setupMoisScreen(index);
    });

    then(/^les jours calendaires affichés sont "(\d+)"$/, (valeur: string) => {
      expect(
        screen.getByTestId(`jours-calendaires-${mockIndex}`).props.children
      ).toBe(`${valeur} j`);
    });

    and(/^les jours travaillés affichés sont "(\d+)"$/, (valeur: string) => {
      expect(
        screen.getByTestId(`jours-travailles-${mockIndex}`).props.children
      ).toBe(`-${valeur} j`);
    });

    and(/^le délai d'attente affiché est "(\d+)"$/, (valeur: string) => {
      expect(
        screen.getByTestId(`delai-attente-${mockIndex}`).props.children
      ).toBe(`-${valeur} j`);
    });

    franchiseCPStep(and);

    and(/^les jours indemnisés affichés sont "(\d+)"$/, (valeur: string) => {
      expect(
        screen.getByTestId(`jours-indemnises-${mockIndex}`).props.children
      ).toBe(`${valeur} j`);
    });
  });

  test("Contrat du mois affiché dans le détail", ({ given, and, then }) => {
    fixerDateStep(given);

    given("le profil est configuré", (table: ProfilRow[]) => {
      pendingProfil = table[0];
    });

    and("ces contrats existent", (table: ContratRow[]) => {
      pendingContrats = table;
    });

    and(/^je suis sur le détail du mois d'index (\d+)$/, (index: string) => {
      setupMoisScreen(index);
    });

    then(
      /^le contrat de "(.*)" affiche le salaire "(.*)"$/,
      (employeur: string, salaire: string) => {
        const section = screen.getByTestId(`section-contrats-${mockIndex}`);
        expect(within(section).getByText(employeur)).toBeTruthy();
        expect(within(section).getByText(salaire)).toBeTruthy();
      }
    );

    and(
      /^le contrat de "(.*)" affiche "(.*)"$/,
      (employeur: string, valeur: string) => {
        const section = screen.getByTestId(`section-contrats-${mockIndex}`);
        expect(within(section).getByText(employeur)).toBeTruthy();
        expect(within(section).getByText(valeur)).toBeTruthy();
      }
    );
  });

  test("Affichage sans profil configuré", ({ given, and, then }) => {
    fixerDateStep(given);

    given("le profil n'est pas configuré", () => {});

    and(/^je suis sur le détail du mois d'index (\d+)$/, (index: string) => {
      setupMoisScreen(index);
    });

    then(/^le message "(.*)" est affiché$/, (message: string) => {
      expect(screen.getByText(message)).toBeTruthy();
    });
  });

  test("Totaux du mois affichés dans le détail", ({ given, and, then }) => {
    fixerDateStep(given);

    given("le profil est configuré", (table: ProfilRow[]) => {
      pendingProfil = table[0];
    });

    and(/^je suis sur le détail du mois d'index (\d+)$/, (index: string) => {
      setupMoisScreen(index);
    });

    then(/^l'ARE versée affichée est "(.*)"$/, (valeur: string) => {
      expect(screen.getByTestId(`are-versee-${mockIndex}`).props.children).toBe(
        valeur
      );
    });

    and(/^le salaire brut affiché est "(.*)"$/, (valeur: string) => {
      expect(
        screen.getByTestId(`salaire-brut-${mockIndex}`).props.children
      ).toBe(valeur);
    });

    and(/^le total reçu affiché est "(.*)"$/, (valeur: string) => {
      expect(
        screen.getByTestId(`total-recu-${mockIndex}`).props.children
      ).toBe(valeur);
    });
  });

  test(
    "Exemple officiel 6 — AJ technicien annexe 8 avec 800h et 18000 euros",
    ({ given, and, then }) => {
      fixerDateStep(given);

      given("le profil est configuré", (table: ProfilRow[]) => {
        pendingProfil = table[0];
      });

      and(/^je suis sur le détail du mois d'index (\d+)$/, (index: string) => {
        setupMoisScreen(index);
      });

      then(/^l'ARE versée affichée est "(.*)"$/, (valeur: string) => {
        expect(
          screen.getByTestId(`are-versee-${mockIndex}`).props.children
        ).toBe(valeur);
      });

      franchiseCPStep(and);
    }
  );

  test(
    "Exemple officiel 10 — Franchise CP musicien annexe 10 avec 176 jours travaillés",
    ({ given, and, then }) => {
      fixerDateStep(given);

      given("le profil est configuré", (table: ProfilRow[]) => {
        pendingProfil = table[0];
      });

      and(/^je suis sur le détail du mois d'index (\d+)$/, (index: string) => {
        setupMoisScreen(index);
      });

      franchiseCPStep(then);
    }
  );

  test(
    "Franchise salaire affichée quand le salaire de référence est élevé",
    ({ given, and, then }) => {
      fixerDateStep(given);

      given("le profil est configuré", (table: ProfilRow[]) => {
        pendingProfil = table[0];
      });

      and(/^je suis sur le détail du mois d'index (\d+)$/, (index: string) => {
        setupMoisScreen(index);
      });

      franchiseSalaireStep(then);
    }
  );

  test(
    "Franchises nulles quand les heures travaillées sont zéro",
    ({ given, and, then }) => {
      fixerDateStep(given);

      given("le profil est configuré", (table: ProfilRow[]) => {
        pendingProfil = table[0];
      });

      and(/^je suis sur le détail du mois d'index (\d+)$/, (index: string) => {
        setupMoisScreen(index);
      });

      then(/^les jours indemnisés affichés sont "(\d+)"$/, (valeur: string) => {
        expect(
          screen.getByTestId(`jours-indemnises-${mockIndex}`).props.children
        ).toBe(`${valeur} j`);
      });
    }
  );
});
