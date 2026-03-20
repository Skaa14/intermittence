import { render, fireEvent, screen } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AccueilScreen from "../../app/(tabs)/index";
import { ProfilsProvider } from "../../contexts/ProfilsContext";
import { ContratsProvider } from "../../contexts/ContratsContext";
import { FormationsProvider } from "../../contexts/FormationsContext";
import { EnseignementsProvider } from "../../contexts/EnseignementsContext";
import { DonneesTestProvider } from "../../contexts/DonneesTestContext";
import { ProfilIntermittent } from "../../types/profil";
import { selectDatePicker } from "./mocks";
import { ddmmyyyyToIso } from "./date";
import { flushAsync } from "./act";

export type ProfilRow = {
  Nom: string;
  Annexe: string;
  Heures: string;
  Salaire: string;
  "Date anniversaire": string;
  CSG?: string;
  "Alsace-Moselle"?: string;
};

const PROFIL_DEFAUT: ProfilIntermittent = {
  id: "default-test-id",
  nom: "Défaut",
  annexe: "8",
  dateAnniversaire: "01/01/2026",
  salaireReference: 10000,
  heuresTravaillees: 507,
  tauxCSG: "standard",
  alsaceMoselle: false,
};

export const prechargerProfilParDefaut = async () => {
  await AsyncStorage.setItem(
    "intermittence:profils",
    JSON.stringify([PROFIL_DEFAUT])
  );
  await AsyncStorage.setItem(
    "intermittence:profilActifId",
    JSON.stringify(PROFIL_DEFAUT.id)
  );
};

export const renderAccueilScreen = async () => {
  const result = render(
    <ProfilsProvider>
      <ContratsProvider>
        <FormationsProvider>
          <EnseignementsProvider>
            <DonneesTestProvider>
              <AccueilScreen />
            </DonneesTestProvider>
          </EnseignementsProvider>
        </FormationsProvider>
      </ContratsProvider>
    </ProfilsProvider>
  );
  await flushAsync();
  return result;
};

export const ouvrirFormulaireProfil = () => {
  const btnModifier = screen.queryByTestId("btn-modifier-profil");
  if (btnModifier) {
    fireEvent.press(btnModifier);
  } else {
    throw new Error(
      "Impossible d'ouvrir le formulaire profil : btn-modifier-profil non trouvé"
    );
  }
};

export const selectDateAnniversaire = (isoDate: string) => {
  selectDatePicker("btn-date-anniversaire", "picker-anniversaire", isoDate);
};

export const configurerProfilViaFormulaire = (row: ProfilRow) => {
  ouvrirFormulaireProfil();
  fireEvent.changeText(screen.getByTestId("input-nom-profil"), row.Nom);
  const testID = `btn-annexe-${row.Annexe}`;
  if (!["8", "10"].includes(row.Annexe)) throw new Error(`Annexe inconnue dans le helper : "${row.Annexe}"`);
  fireEvent.press(screen.getByTestId(testID));
  selectDateAnniversaire(ddmmyyyyToIso(row["Date anniversaire"]));
  fireEvent.changeText(screen.getByTestId("input-salaire-reference"), row.Salaire);
  fireEvent.changeText(screen.getByTestId("input-heures-travaillees"), row.Heures);
  if (row.CSG === "reduit") {
    fireEvent.press(screen.getByTestId("btn-csg-reduit"));
  }
  if (row["Alsace-Moselle"] === "oui") {
    fireEvent.press(screen.getByTestId("btn-alsace-moselle"));
  }
  fireEvent.press(screen.getByTestId("btn-valider-profil"));
};
