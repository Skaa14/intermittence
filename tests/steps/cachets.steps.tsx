import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, screen, within } from "@testing-library/react-native";
import { ContratRow } from "../helpers/types";
import {
  renderScreen,
  ouvrirFormulaire,
  ajouterContratViaFormulaire,
  fixerDate,
} from "../helpers/form";
import { resetPickerCallbacks } from "../helpers/mocks";
import { colors } from "../../theme/colors";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

let mockAnnexe = "10";

jest.mock("../../contexts/ProfilContext", () => ({
  ...jest.requireActual("../../contexts/ProfilContext"),
  useProfil: () => ({
    profil: {
      annexe: mockAnnexe,
      dateAnniversaire: "01/01/2026",
      salaireReference: 20000,
      heuresTravaillees: 600,
      tauxCSG: "standard",
      alsaceMoselle: false,
    },
    chargementTermine: true,
    mettreAJourProfil: jest.fn(),
    reinitialiserProfil: jest.fn(),
  }),
}));

const feature = loadFeature("tests/features/cachets.feature");

const fixerDateStep = (given: (pattern: RegExp, fn: (date: string) => void) => void) => {
  given(/^nous sommes le "(.*)"$/, (date: string) => {
    fixerDate(date);
  });
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    resetPickerCallbacks();
    mockAnnexe = "10";
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Le toggle heures/cachets est visible pour annexe 10", ({ given, then }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {
      mockAnnexe = "10";
    });

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    then("le toggle heures/cachets est visible", () => {
      expect(screen.getByTestId("toggle-type-heures")).toBeTruthy();
    });
  });

  test("Le toggle heures/cachets est masqué pour annexe 8", ({ given, and, then }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {});

    given("le profil est en annexe 8", () => {
      mockAnnexe = "8";
    });

    and("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    then("le toggle heures/cachets est masqué", () => {
      expect(screen.queryByTestId("toggle-type-heures")).toBeNull();
    });
  });

  test("Le mode cachets initialise la valeur à 1", ({ given, when, then }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {});

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    when(/^je sélectionne le mode "(.*)"$/, (mode: string) => {
      fireEvent.press(screen.getByTestId(`toggle-${mode}`));
    });

    then(/^le champ heures contient "(.*)"$/, (valeur: string) => {
      expect(screen.getByTestId("input-heures").props.value).toBe(valeur);
    });
  });

  test("Le placeholder revient à heures quand on resélectionne heures", ({ given, and, when, then }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {});

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    and(/^je sélectionne le mode "(.*)"$/, (mode: string) => {
      fireEvent.press(screen.getByTestId(`toggle-${mode}`));
    });

    when(/^je sélectionne le mode "(.*)"$/, (mode: string) => {
      fireEvent.press(screen.getByTestId(`toggle-${mode}`));
    });

    then(/^le placeholder du champ est "(.*)"$/, (placeholder: string) => {
      expect(screen.getByPlaceholderText(placeholder)).toBeTruthy();
    });
  });

  test("Ajout d'un contrat en cachets pluriel", ({ given, when, then }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {});

    given("l'écran contrats est affiché", () => {
      renderScreen();
    });

    when("j'ajoute un contrat en cachets", (table: ContratRow[]) => {
      ajouterContratViaFormulaire(table[0]);
    });

    then(/^le contrat "(.*)" affiche "(.*)"$/, (employeur: string, attendu: string) => {
      const cards = screen.getAllByTestId(/^contrat-/);
      const card = cards.find((c) => within(c).queryByText(employeur));
      expect(card).toBeDefined();
      expect(within(card!).getByText(attendu)).toBeTruthy();
    });
  });

  test("Ajout d'un contrat avec un seul cachet singulier", ({ given, when, then }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {});

    given("l'écran contrats est affiché", () => {
      renderScreen();
    });

    when("j'ajoute un contrat en cachets", (table: ContratRow[]) => {
      ajouterContratViaFormulaire(table[0]);
    });

    then(/^le contrat "(.*)" affiche "(.*)"$/, (employeur: string, attendu: string) => {
      const cards = screen.getAllByTestId(/^contrat-/);
      const card = cards.find((c) => within(c).queryByText(employeur));
      expect(card).toBeDefined();
      expect(within(card!).getByText(attendu)).toBeTruthy();
    });
  });

  test("Ajout d'un contrat en heures affiche en heures", ({ given, when, then }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {});

    given("l'écran contrats est affiché", () => {
      renderScreen();
    });

    when("j'ajoute un contrat en heures", (table: ContratRow[]) => {
      ajouterContratViaFormulaire(table[0]);
    });

    then(/^le contrat "(.*)" affiche "(.*)"$/, (employeur: string, attendu: string) => {
      const cards = screen.getAllByTestId(/^contrat-/);
      const card = cards.find((c) => within(c).queryByText(employeur));
      expect(card).toBeDefined();
      expect(within(card!).getByText(attendu)).toBeTruthy();
    });
  });

  test("Les boutons -/+ modifient le nombre de cachets", ({ given, and, when, then }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {});

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    and(/^je sélectionne le mode "(.*)"$/, (mode: string) => {
      fireEvent.press(screen.getByTestId(`toggle-${mode}`));
    });

    when(/^j'appuie sur "(.*)"$/, (bouton: string) => {
      const testID = bouton === "+" ? "btn-plus-cachets" : "btn-moins-cachets";
      fireEvent.press(screen.getByTestId(testID));
    });

    then(/^le champ heures contient "(.*)"$/, (valeur: string) => {
      expect(screen.getByTestId("input-heures").props.value).toBe(valeur);
    });

    when(/^j'appuie sur "(.*)"$/, (bouton: string) => {
      const testID = bouton === "+" ? "btn-plus-cachets" : "btn-moins-cachets";
      fireEvent.press(screen.getByTestId(testID));
    });

    then(/^le champ heures contient "(.*)"$/, (valeur: string) => {
      expect(screen.getByTestId("input-heures").props.value).toBe(valeur);
    });
  });

  test("Le bouton - ne descend pas en dessous de 1", ({ given, and, when, then }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {});

    given("le formulaire de saisie est ouvert", () => {
      renderScreen();
      ouvrirFormulaire();
    });

    and(/^je sélectionne le mode "(.*)"$/, (mode: string) => {
      fireEvent.press(screen.getByTestId(`toggle-${mode}`));
    });

    when(/^j'appuie sur "(.*)"$/, () => {
      fireEvent.press(screen.getByTestId("btn-moins-cachets"));
    });

    then(/^le champ heures contient "(.*)"$/, (valeur: string) => {
      expect(screen.getByTestId("input-heures").props.value).toBe(valeur);
    });
  });

  test("Édition d'un contrat en cachets pré-remplit le mode cachets", ({ given, when, then, and }) => {
    fixerDateStep(given);

    given("le profil est en annexe 10", () => {});

    given("un contrat en cachets existe", (table: ContratRow[]) => {
      renderScreen();
      ajouterContratViaFormulaire(table[0]);
    });

    when(/^je lance l'édition du contrat "(.*)"$/, (employeur: string) => {
      const cards = screen.getAllByTestId(/^contrat-/);
      const card = cards.find((c) => within(c).queryByText(employeur));
      expect(card).toBeDefined();
      fireEvent.press(within(card!).getByText("✎"));
    });

    then(/^le mode "(.*)" est actif$/, (mode: string) => {
      const toggle = screen.getByTestId(`toggle-${mode}`);
      const style = toggle.props.style;
      const flat = Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;
      expect(flat.backgroundColor).toBe(colors.primaryBg);
    });

    and(/^le champ heures contient "(.*)"$/, (valeur: string) => {
      expect(screen.getByTestId("input-heures").props.value).toBe(valeur);
    });
  });
});
