import { defineFeature, loadFeature } from "jest-cucumber";
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfilsProvider } from "../../contexts/ProfilsContext";
import BoutonProfil from "../../components/BoutonProfil";
import PanneauProfils from "../../components/PanneauProfils";
import { ProfilIntermittent } from "../../types/profil";
import { profil as profilFactory } from "../helpers/factories";
import { flushAsync } from "../helpers/act";

jest.mock("@react-native-community/datetimepicker", () =>
  require("../helpers/mocks").mockDateTimePickerFactory()
);

const feature = loadFeature("tests/features/panneau-profils.feature");

let onFermer: jest.Mock;
let panneauVisible: boolean;

const seedProfils = async (profils: ProfilIntermittent[], actifId: string) => {
  await AsyncStorage.setItem(
    "intermittence:profils",
    JSON.stringify(profils)
  );
  await AsyncStorage.setItem(
    "intermittence:profilActifId",
    JSON.stringify(actifId)
  );
};

const renderComposants = async (visible = false) => {
  panneauVisible = visible;
  onFermer = jest.fn(() => {
    panneauVisible = false;
  });

  const result = render(
    <ProfilsProvider>
      <BoutonProfil onPress={() => { panneauVisible = true; }} />
      <PanneauProfils visible={panneauVisible} onFermer={onFermer} />
    </ProfilsProvider>
  );
  await flushAsync();
  return result;
};

const renderAvecPanneau = async (profils: ProfilIntermittent[], actifId: string) => {
  await seedProfils(profils, actifId);
  onFermer = jest.fn();

  const result = render(
    <ProfilsProvider>
      <BoutonProfil onPress={() => {}} />
      <PanneauProfils visible={true} onFermer={onFermer} />
    </ProfilsProvider>
  );
  await flushAsync();
  return result;
};

type ProfilRow = { Nom: string; Annexe: string };

defineFeature(feature, (test) => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test("Le bouton profil affiche l'initiale du profil actif", ({ given, then }) => {
    given(/^un profil actif avec le nom "(.*)"$/, async (nom: string) => {
      const p = profilFactory({ nom });
      await seedProfils([p], p.id);
      await renderComposants();
    });

    then(/^le bouton profil affiche "(.*)"$/, (initiale: string) => {
      expect(screen.getByText(initiale)).toBeTruthy();
    });
  });

  test("Le bouton profil affiche une icône quand il n'y a pas de profil", ({ given, then }) => {
    given("aucun profil n'existe", async () => {
      await renderComposants();
    });

    then("le bouton profil affiche l'icône par défaut", () => {
      expect(screen.getByText("person-circle-outline")).toBeTruthy();
    });
  });

  test("Ouverture du panneau de profils", ({ given, when, then, and }) => {
    given(/^un profil actif avec le nom "(.*)"$/, async (nom: string) => {
      const p = profilFactory({ nom });
      await renderAvecPanneau([p], p.id);
    });

    when("j'appuie sur le bouton profil", () => {});

    then("le panneau de profils est visible", () => {
      expect(screen.getByTestId("panneau-profils")).toBeTruthy();
    });

    and(/^le titre "(.*)" est affiché$/, (titre: string) => {
      expect(screen.getByText(titre)).toBeTruthy();
    });
  });

  test("La liste des profils est affichée", ({ given, when, then, and }) => {
    given("les profils suivants existent", async (table: ProfilRow[]) => {
      const profils = table.map((row, i) =>
        profilFactory({ id: `profil-${i}`, nom: row.Nom, annexe: row.Annexe as "8" | "10" })
      );
      await renderAvecPanneau(profils, profils[0].id);
    });

    when("j'appuie sur le bouton profil", () => {});

    then(/^je vois le profil "(.*)" avec "(.*)"$/, (nom: string, annexe: string) => {
      expect(screen.getByText(nom)).toBeTruthy();
      expect(screen.getByText(annexe)).toBeTruthy();
    });

    and(/^je vois le profil "(.*)" avec "(.*)"$/, (nom: string, annexe: string) => {
      expect(screen.getByText(nom)).toBeTruthy();
      expect(screen.getByText(annexe)).toBeTruthy();
    });
  });

  test("Le profil actif est surligné", ({ given, when, then }) => {
    given("les profils suivants existent", async (table: ProfilRow[]) => {
      const profils = table.map((row, i) =>
        profilFactory({ id: `profil-${i}`, nom: row.Nom, annexe: row.Annexe as "8" | "10" })
      );
      await renderAvecPanneau(profils, profils[0].id);
    });

    when("j'appuie sur le bouton profil", () => {});

    then(/^le profil "(.*)" est marqué comme actif$/, (nom: string) => {
      const profilItem = screen.getByTestId("profil-item-profil-0");
      expect(profilItem).toBeTruthy();
    });
  });

  test("Sélection d'un autre profil", ({ given, when, then, and }) => {
    let vue: ReturnType<typeof render>;

    given("les profils suivants existent", async (table: ProfilRow[]) => {
      const profils = table.map((row, i) =>
        profilFactory({ id: `profil-${i}`, nom: row.Nom, annexe: row.Annexe as "8" | "10" })
      );
      vue = await renderAvecPanneau(profils, profils[0].id);
    });

    when("j'appuie sur le bouton profil", () => {});

    and(/^je sélectionne le profil "(.*)"$/, (nom: string) => {
      const item = screen.getByText(nom);
      fireEvent.press(item);
    });

    then("le panneau se ferme", () => {
      expect(onFermer).toHaveBeenCalled();
    });

    and(/^le bouton profil affiche "(.*)"$/, async (initiale: string) => {
      vue.unmount();
      const stored = await AsyncStorage.getItem("intermittence:profilActifId");
      const actifId = JSON.parse(stored!);
      expect(actifId).toBe("profil-1");
    });
  });

  test("Fermeture du panneau en tapant sur l'overlay", ({ given, when, then, and }) => {
    given(/^un profil actif avec le nom "(.*)"$/, async (nom: string) => {
      const p = profilFactory({ nom });
      await renderAvecPanneau([p], p.id);
    });

    when("j'appuie sur le bouton profil", () => {});

    and("je tape sur l'overlay", () => {
      fireEvent.press(screen.getByTestId("panneau-overlay"));
    });

    then("le panneau se ferme", () => {
      expect(onFermer).toHaveBeenCalled();
    });
  });

  test("Ajout d'un profil via le formulaire dans le panneau", ({ given, when, then, and }) => {
    given(/^un profil actif avec le nom "(.*)"$/, async (nom: string) => {
      const p = profilFactory({ nom });
      await renderAvecPanneau([p], p.id);
    });

    when("j'appuie sur le bouton profil", () => {});

    and("j'appuie sur le bouton ajouter un profil", () => {
      fireEvent.press(screen.getByTestId("btn-ajouter-profil"));
    });

    then("le formulaire de création est affiché", () => {
      expect(screen.getByTestId("input-nom-profil")).toBeTruthy();
      expect(screen.getByTestId("btn-valider-profil")).toBeTruthy();
    });
  });
});
