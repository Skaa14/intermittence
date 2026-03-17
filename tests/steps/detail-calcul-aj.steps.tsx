import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DetailCalculAJScreen from "../../app/detail-calcul-aj";
import { ProfilProvider } from "../../contexts/ProfilContext";
import { Annexe, ProfilIntermittent, TauxCSG } from "../../types/profil";

const feature = loadFeature("tests/features/detail-calcul-aj.feature");

const sauvegarderProfil = async (profil: ProfilIntermittent) => {
  await AsyncStorage.setItem("intermittence:profil", JSON.stringify(profil));
};

const renderDetailScreen = () =>
  render(
    <ProfilProvider>
      <DetailCalculAJScreen />
    </ProfilProvider>
  );

const attendreChargement = async () => {
  await waitFor(() => {
    expect(screen.getByTestId("detail-aj-scroll")).toBeTruthy();
  });
};

const creerProfil = (
  annexe: Annexe,
  heures: string,
  salaire: string,
  tauxCSG: TauxCSG = "standard",
  alsaceMoselle = false
): ProfilIntermittent => ({
  annexe,
  heuresTravaillees: Number(heures),
  salaireReference: Number(salaire),
  dateAnniversaire: "15/09/2026",
  tauxCSG,
  alsaceMoselle,
});

const escapeRegex = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

defineFeature(feature, (test) => {
  test("Affichage sans profil configuré", ({ given, then }) => {
    given("la page de détail est affichée sans profil", () => {
      renderDetailScreen();
    });

    then(/^le message "(.*)" est affiché$/, (message: string) => {
      expect(screen.getByText(message)).toBeTruthy();
    });
  });

  test("Affichage des composantes brutes annexe 8", ({ given, when, then, and }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then(/^le titre de section contient "(.*)"$/, (texte: string) => {
      expect(screen.getByTestId("detail-aj-titre-brute")).toHaveTextContent(
        new RegExp(escapeRegex(texte))
      );
    });

    and(/^la composante A affiche la formule "(.*)"$/, (formule: string) => {
      expect(screen.getByTestId("detail-aj-composante-a")).toHaveTextContent(
        new RegExp(escapeRegex(formule))
      );
    });

    and(/^la composante B affiche la formule "(.*)"$/, (formule: string) => {
      expect(screen.getByTestId("detail-aj-composante-b")).toHaveTextContent(
        new RegExp(escapeRegex(formule))
      );
    });

    and(/^la composante C affiche la formule "(.*)"$/, (formule: string) => {
      expect(screen.getByTestId("detail-aj-composante-c")).toHaveTextContent(
        new RegExp(escapeRegex(formule))
      );
    });

    and(/^l'AJ brute affichée en résumé est "(.*)"$/, (montant: string) => {
      expect(screen.getByTestId("detail-aj-brut")).toHaveTextContent(
        new RegExp(escapeRegex(montant))
      );
    });

    and(/^l'AJ nette affichée en résumé est "(.*)"$/, (montant: string) => {
      expect(screen.getByTestId("detail-aj-net")).toHaveTextContent(
        new RegExp(escapeRegex(montant))
      );
    });
  });

  test("Affichage des composantes brutes annexe 10", ({ given, when, then, and }) => {
    given(/^un profil annexe 10 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("10", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then(/^le titre de section contient "(.*)"$/, (texte: string) => {
      expect(screen.getByTestId("detail-aj-titre-brute")).toHaveTextContent(
        new RegExp(escapeRegex(texte))
      );
    });

    and(/^la composante A affiche la formule "(.*)"$/, (formule: string) => {
      expect(screen.getByTestId("detail-aj-composante-a")).toHaveTextContent(
        new RegExp(escapeRegex(formule))
      );
    });

    and(/^la composante C affiche la formule "(.*)"$/, (formule: string) => {
      expect(screen.getByTestId("detail-aj-composante-c")).toHaveTextContent(
        new RegExp(escapeRegex(formule))
      );
    });
  });

  test("Plancher affiché quand AJ brute trop basse", ({ given, when, then, and }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then("le plafonnement est affiché", () => {
      expect(screen.getByTestId("detail-aj-plafonnement")).toBeTruthy();
    });

    and(/^l'AJ brute affichée en résumé est "(.*)"$/, (montant: string) => {
      expect(screen.getByTestId("detail-aj-brut")).toHaveTextContent(
        new RegExp(escapeRegex(montant))
      );
    });
  });

  test("Plafond affiché quand AJ brute trop haute", ({ given, when, then, and }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then("le plafonnement est affiché", () => {
      expect(screen.getByTestId("detail-aj-plafonnement")).toBeTruthy();
    });

    and(/^l'AJ brute affichée en résumé est "(.*)"$/, (montant: string) => {
      expect(screen.getByTestId("detail-aj-brut")).toHaveTextContent(
        new RegExp(escapeRegex(montant))
      );
    });
  });

  test("Affichage des cotisations avec CSG standard", ({ given, when, then, and }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then(/^la cotisation "(.*)" est affichée$/, (label: string) => {
      expect(screen.getByText(label)).toBeTruthy();
    });

    and(/^la cotisation "(.*)" est affichée$/, (label: string) => {
      expect(screen.getByText(label)).toBeTruthy();
    });

    and(/^la cotisation "(.*)" est affichée$/, (label: string) => {
      expect(screen.getByText(label)).toBeTruthy();
    });

    and("le total des cotisations est affiché", () => {
      expect(screen.getByTestId("detail-aj-total-cotisations")).toBeTruthy();
    });
  });

  test("Affichage des cotisations avec CSG réduit", ({ given, when, then, and }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros et CSG réduit$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire, "reduit"));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then(/^la cotisation "(.*)" est affichée$/, (label: string) => {
      expect(screen.getByText(label)).toBeTruthy();
    });

    and(/^la cotisation "(.*)" est affichée$/, (label: string) => {
      expect(screen.getByText(label)).toBeTruthy();
    });
  });

  test("Affichage de la cotisation Alsace-Moselle", ({ given, when, then }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros et Alsace-Moselle$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire, "standard", true));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then(/^la cotisation "(.*)" est affichée$/, (label: string) => {
      expect(screen.getByText(label)).toBeTruthy();
    });
  });

  test("Exonération CSG/CRDS quand AJ brute sous le seuil", ({ given, when, then, and }) => {
    given(/^un profil annexe 10 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("10", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then("le message d'exonération CSG/CRDS est affiché", () => {
      expect(screen.getByTestId("detail-aj-exoneration")).toBeTruthy();
      expect(screen.getByTestId("detail-aj-exoneration")).toHaveTextContent(
        /pas de CSG\/CRDS/
      );
    });

    and(/^la cotisation "(.*)" est affichée$/, (label: string) => {
      expect(screen.getByText(label)).toBeTruthy();
    });
  });

  test("Affichage du SJM", ({ given, when, then }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then(/^le SJM affiche la formule "(.*)"$/, (formule: string) => {
      expect(screen.getByTestId("detail-aj-sjm")).toHaveTextContent(
        new RegExp(escapeRegex(formule))
      );
    });
  });

  test("Les paramètres sont masqués par défaut", ({ given, when, then }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    then("les paramètres de la composante A ne sont pas visibles", () => {
      expect(screen.queryByTestId("detail-aj-composante-a-parametres")).toBeNull();
    });
  });

  test("Affichage des paramètres au tap sur l'icône œil", ({ given, when, then, and }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    and("je tape sur l'icône paramètres de la composante A", () => {
      fireEvent.press(screen.getByTestId("detail-aj-composante-a-info"));
    });

    then("les paramètres de la composante A sont visibles", () => {
      expect(screen.getByTestId("detail-aj-composante-a-parametres")).toBeTruthy();
    });

    and(/^le paramètre "(.*)" avec la description "(.*)" est affiché$/, (nom: string, description: string) => {
      const bloc = screen.getByTestId("detail-aj-composante-a-parametres");
      expect(bloc).toHaveTextContent(new RegExp(escapeRegex(nom)));
      expect(bloc).toHaveTextContent(new RegExp(escapeRegex(description)));
    });
  });

  test("Masquage des paramètres au second tap", ({ given, when, then, and }) => {
    given(/^un profil annexe 8 avec (\d+)h et (\d+) euros$/, async (heures: string, salaire: string) => {
      await sauvegarderProfil(creerProfil("8", heures, salaire));
    });

    when("la page de détail est affichée", async () => {
      renderDetailScreen();
      await attendreChargement();
    });

    and("je tape sur l'icône paramètres de la composante A", () => {
      fireEvent.press(screen.getByTestId("detail-aj-composante-a-info"));
    });

    and("je tape sur l'icône paramètres de la composante A", () => {
      fireEvent.press(screen.getByTestId("detail-aj-composante-a-info"));
    });

    then("les paramètres de la composante A ne sont pas visibles", () => {
      expect(screen.queryByTestId("detail-aj-composante-a-parametres")).toBeNull();
    });
  });
});
