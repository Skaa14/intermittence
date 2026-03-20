import { render, fireEvent, screen } from "@testing-library/react-native";
import AccueilScreen from "../../app/(tabs)/index";
import { ProfilsProvider } from "../../contexts/ProfilsContext";
import { ContratsProvider } from "../../contexts/ContratsContext";
import { FormationsProvider } from "../../contexts/FormationsContext";
import { EnseignementsProvider } from "../../contexts/EnseignementsContext";
import { DonneesTestProvider } from "../../contexts/DonneesTestContext";
import { selectDatePicker } from "./mocks";
import { ddmmyyyyToIso } from "./date";
import { flushAsync } from "./act";

export type ProfilRow = {
  Annexe: string;
  Heures: string;
  Salaire: string;
  "Date anniversaire": string;
  CSG?: string;
  "Alsace-Moselle"?: string;
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
  const btnConfigurer = screen.queryByTestId("btn-configurer-profil");
  const btnModifier = screen.queryByTestId("btn-modifier-profil");
  if (btnConfigurer) {
    fireEvent.press(btnConfigurer);
  } else if (btnModifier) {
    fireEvent.press(btnModifier);
  } else {
    throw new Error(
      "Impossible d'ouvrir le formulaire profil : ni btn-configurer-profil ni btn-modifier-profil trouvés"
    );
  }
};

export const selectDateAnniversaire = (isoDate: string) => {
  selectDatePicker("btn-date-anniversaire", "picker-anniversaire", isoDate);
};

export const configurerProfilViaFormulaire = (row: ProfilRow) => {
  ouvrirFormulaireProfil();
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
  fireEvent.press(screen.getByText("Valider"));
};
