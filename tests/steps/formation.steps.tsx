import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, act } from "@testing-library/react-native";
import AccueilScreen from "../../app/(tabs)/index";
import DetailMoisScreen from "../../app/mois/[moisIndex]";
import { ContratsProvider, useContrats } from "../../contexts/ContratsContext";
import { ProfilProvider, useProfil } from "../../contexts/ProfilContext";
import { FormationsProvider, useFormations } from "../../contexts/FormationsContext";
import { DonneesTestProvider } from "../../contexts/DonneesTestContext";
import { ProfilIntermittent } from "../../types/profil";
import { Contrat } from "../../types/contrat";
import { Formation, OptionFormation } from "../../types/formation";
import { fixerDate } from "../helpers/form";
import { ContratRow } from "../helpers/types";

let mockIndex = "0";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useLocalSearchParams: () => ({ moisIndex: mockIndex }),
  useNavigation: () => ({ setOptions: jest.fn() }),
}));

type ProfilRow = {
  Annexe: string;
  Heures: string;
  Salaire: string;
  "Date anniversaire": string;
};

type FormationRow = {
  "Intitulé": string;
  "Début": string;
  Fin: string;
  Heures: string;
  Option: string;
};

let capturedMettreAJourProfil: ((p: ProfilIntermittent) => void) | null = null;
let capturedAjouterContrat: ((c: Omit<Contrat, "id">) => void) | null = null;
let capturedAjouterFormation: ((f: Omit<Formation, "id">) => void) | null = null;

function SetupAccueil() {
  const { mettreAJourProfil } = useProfil();
  const { ajouterContrat } = useContrats();
  const { ajouterFormation } = useFormations();
  capturedMettreAJourProfil = mettreAJourProfil;
  capturedAjouterContrat = ajouterContrat;
  capturedAjouterFormation = ajouterFormation;
  return <AccueilScreen />;
}

function SetupMois() {
  const { mettreAJourProfil } = useProfil();
  const { ajouterContrat } = useContrats();
  const { ajouterFormation } = useFormations();
  capturedMettreAJourProfil = mettreAJourProfil;
  capturedAjouterContrat = ajouterContrat;
  capturedAjouterFormation = ajouterFormation;
  return <DetailMoisScreen />;
}

const renderAccueil = () =>
  render(
    <ProfilProvider>
      <ContratsProvider>
        <FormationsProvider>
          <DonneesTestProvider>
            <SetupAccueil />
          </DonneesTestProvider>
        </FormationsProvider>
      </ContratsProvider>
    </ProfilProvider>
  );

const renderMois = () =>
  render(
    <ProfilProvider>
      <ContratsProvider>
        <FormationsProvider>
          <SetupMois />
        </FormationsProvider>
      </ContratsProvider>
    </ProfilProvider>
  );

let pendingProfil: ProfilRow | null = null;
let pendingContrats: ContratRow[] = [];
let pendingFormations: FormationRow[] = [];

const fixerDateStep = (given: (pattern: RegExp, fn: (date: string) => void) => void) => {
  given(/^nous sommes le "(.*)"$/, (date: string) => {
    fixerDate(date);
  });
};

const configurerProfilStep = (given: Function) => {
  given("le profil est configuré", (table: ProfilRow[]) => {
    pendingProfil = table[0];
  });
};

const contratsStep = (and: Function) => {
  and("ces contrats existent", (table: ContratRow[]) => {
    pendingContrats = table;
  });
};

const formationsStep = (and: Function) => {
  and("ces formations existent", (table: FormationRow[]) => {
    pendingFormations = table;
  });
};

const injecterDonnees = () => {
  act(() => {
    if (pendingProfil) {
      capturedMettreAJourProfil!({
        annexe: pendingProfil.Annexe as "8" | "10",
        heuresTravaillees: Number(pendingProfil.Heures),
        salaireReference: Number(pendingProfil.Salaire),
        dateAnniversaire: pendingProfil["Date anniversaire"],
        tauxCSG: "standard",
        alsaceMoselle: false,
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
    pendingFormations.forEach((row) => {
      capturedAjouterFormation!({
        intitule: row["Intitulé"],
        dateDebut: row["Début"],
        dateFin: row.Fin,
        heures: Number(row.Heures),
        option: row.Option as OptionFormation,
      });
    });
  });
};

const feature = loadFeature("tests/features/formation.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    pendingProfil = null;
    pendingContrats = [];
    pendingFormations = [];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderEtInjecterAccueil = () => {
    renderAccueil();
    injecterDonnees();
  };

  test("Formation option A ajoute des heures au compteur 507h", ({ given, and, then }) => {
    fixerDateStep(given);
    configurerProfilStep(given);
    contratsStep(and);
    formationsStep(and);

    then(/^le compteur affiche "(.*)"$/, (texte: string) => {
      renderEtInjecterAccueil();
      expect(screen.getByText(texte)).toBeTruthy();
    });

    and(/^le texte "(.*)" est visible$/, (texte: string) => {
      expect(screen.getByText(new RegExp(texte))).toBeTruthy();
    });
  });

  test("Formation option B ne change pas le compteur 507h", ({ given, and, then }) => {
    fixerDateStep(given);
    configurerProfilStep(given);
    contratsStep(and);
    formationsStep(and);

    then(/^le compteur affiche "(.*)"$/, (texte: string) => {
      renderEtInjecterAccueil();
      expect(screen.getByText(texte)).toBeTruthy();
    });

    and(/^le texte "(.*)" n'est pas visible$/, (texte: string) => {
      expect(screen.queryByText(new RegExp(texte))).toBeNull();
    });
  });

  test("Formation option A plafonnée à 338h", ({ given, and, then }) => {
    fixerDateStep(given);
    configurerProfilStep(given);
    contratsStep(and);
    formationsStep(and);

    then(/^le compteur affiche "(.*)"$/, (texte: string) => {
      renderEtInjecterAccueil();
      expect(screen.getByText(texte)).toBeTruthy();
    });

    and(/^le texte "(.*)" est visible$/, (texte: string) => {
      expect(screen.getByText(new RegExp(texte))).toBeTruthy();
    });
  });

  test("Formation option A réduit les jours indemnisés sur la vue mensuelle", ({ given, and, when, then }) => {
    fixerDateStep(given);
    configurerProfilStep(given);
    formationsStep(and);

    when(/^je navigue vers le détail du mois (\d+)$/, (index: string) => {
      mockIndex = index;
      renderMois();
      injecterDonnees();
    });

    then(/^les jours de formation affichent "(.*)"$/, (texte: string) => {
      expect(
        screen.getByTestId(`jours-formation-${mockIndex}`)
      ).toBeTruthy();
      expect(
        screen.getByTestId(`jours-formation-${mockIndex}`).props.children
      ).toBe(texte);
    });
  });
});
