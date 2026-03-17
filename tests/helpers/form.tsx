import {
  render,
  fireEvent,
  screen,
} from "@testing-library/react-native";
import ContratsScreen from "../../app/(tabs)/contrats";
import { ContratsProvider } from "../../contexts/ContratsContext";
import { ProfilProvider } from "../../contexts/ProfilContext";
import { selectDatePicker } from "./mocks";
import { ddmmyyyyToIso } from "./date";
import { ContratRow } from "./types";

export const renderScreen = () =>
  render(
    <ProfilProvider>
      <ContratsProvider>
        <ContratsScreen />
      </ContratsProvider>
    </ProfilProvider>
  );

export const ouvrirFormulaire = () => {
  fireEvent.press(screen.getByTestId("btn-ouvrir-formulaire"));
};

export const selectDate = (pickerTestID: string, dateStr: string) => {
  const inputTestID = pickerTestID === "picker-debut" ? "input-date-debut" : "input-date-fin";
  selectDatePicker(inputTestID, pickerTestID, dateStr);
};

export const ajouterContratViaFormulaire = (row: ContratRow) => {
  ouvrirFormulaire();
  fireEvent.changeText(screen.getByTestId("input-employeur"), row.Employeur);
  selectDate("picker-debut", ddmmyyyyToIso(row["Début"]));
  selectDate("picker-fin", ddmmyyyyToIso(row.Fin));
  if (row.Type === "cachets") {
    fireEvent.press(screen.getByTestId("toggle-cachets"));
  }
  fireEvent.changeText(screen.getByTestId("input-heures"), row.Heures);
  fireEvent.changeText(screen.getByTestId("input-salaire-brut"), row.Salaire);
  fireEvent.press(screen.getByText("Ajouter"));
};

export const fixerDate = (ddmmyyyy: string) => {
  jest.useFakeTimers();
  const isoDate = ddmmyyyyToIso(ddmmyyyy);
  jest.setSystemTime(new Date(isoDate + "T12:00:00"));
};
