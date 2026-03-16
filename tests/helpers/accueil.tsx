import { render, fireEvent, screen } from "@testing-library/react-native";
import AccueilScreen from "../../app/(tabs)/index";
import { ContratsProvider } from "../../contexts/ContratsContext";
import { ProfilProvider } from "../../contexts/ProfilContext";
import { selectDatePicker } from "./mocks";
import { ddmmyyyyToIso } from "./date";

export type ProfilRow = {
  Annexe: string;
  Heures: string;
  Salaire: string;
  "Date anniversaire": string;
};

export const renderAccueilScreen = () =>
  render(
    <ContratsProvider>
      <ProfilProvider>
        <AccueilScreen />
      </ProfilProvider>
    </ContratsProvider>
  );

export const ouvrirFormulaireProfil = () => {
  const btnConfigurer = screen.queryByTestId("btn-configurer-profil");
  const ajCard = screen.queryByTestId("aj-card");
  if (btnConfigurer) {
    fireEvent.press(btnConfigurer);
  } else if (ajCard) {
    fireEvent.press(ajCard);
  } else {
    throw new Error(
      "Impossible d'ouvrir le formulaire profil : ni btn-configurer-profil ni aj-card trouvés"
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
  fireEvent.press(screen.getByText("Valider"));
};
