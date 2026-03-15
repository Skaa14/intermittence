import {
  render,
  fireEvent,
  screen,
  act,
} from "@testing-library/react-native";
import ContratsScreen from "../../app/(tabs)/contrats";
import { ContratsProvider } from "../../contexts/ContratsContext";
import { mockPickerCallbacksByTestID } from "./mocks";
import { ddmmyyyyToIso } from "./date";
import { ContratRow } from "./types";

export const renderScreen = () =>
  render(
    <ContratsProvider>
      <ContratsScreen />
    </ContratsProvider>
  );

export const ouvrirFormulaire = () => {
  fireEvent.press(screen.getByText("+ Nouveau contrat"));
};

export const selectDate = (pickerTestID: string, dateStr: string) => {
  const inputTestID = pickerTestID === "picker-debut" ? "input-date-debut" : "input-date-fin";
  fireEvent.press(screen.getByTestId(inputTestID));
  const date = new Date(dateStr + "T00:00:00");
  const callback = mockPickerCallbacksByTestID[pickerTestID];
  act(() => {
    callback({ type: "set" }, date);
  });
};

export const ajouterContratViaFormulaire = (row: ContratRow) => {
  ouvrirFormulaire();
  fireEvent.changeText(screen.getByTestId("input-employeur"), row.Employeur);
  selectDate("picker-debut", ddmmyyyyToIso(row["Début"]));
  selectDate("picker-fin", ddmmyyyyToIso(row.Fin));
  fireEvent.changeText(screen.getByTestId("input-heures"), row.Heures);
  fireEvent.changeText(screen.getByTestId("input-salaire-brut"), row.Salaire);
  fireEvent.press(screen.getByText("Ajouter"));
};

export const fixerDate = (ddmmyyyy: string) => {
  jest.useFakeTimers();
  const isoDate = ddmmyyyyToIso(ddmmyyyy);
  jest.setSystemTime(new Date(isoDate + "T12:00:00"));
};
