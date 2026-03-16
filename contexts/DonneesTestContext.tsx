import { createContext, useContext, useState, ReactNode } from "react";
import { useContrats } from "./ContratsContext";
import { useProfil } from "./ProfilContext";
import {
  creerProfilArtiste,
  creerProfilTechnicien,
  creerContratsArtiste,
  creerContratsTechnicien,
} from "../utils/donneesTest";

interface DonneesTestContextType {
  modeTest: boolean;
  nomProfil: string | null;
  chargerDonneesTest: (type: "artiste" | "technicien") => void;
  reinitialiser: () => void;
}

const DonneesTestContext = createContext<DonneesTestContextType | null>(null);

export function DonneesTestProvider({ children }: { children: ReactNode }) {
  const { reinitialiserContrats } = useContrats();
  const { mettreAJourProfil, reinitialiserProfil } = useProfil();
  const [modeTest, setModeTest] = useState(false);
  const [nomProfil, setNomProfil] = useState<string | null>(null);

  const chargerDonneesTest = (type: "artiste" | "technicien") => {
    if (type === "artiste") {
      mettreAJourProfil(creerProfilArtiste());
      reinitialiserContrats(creerContratsArtiste());
      setNomProfil("Artiste — Annexe 10");
    } else {
      mettreAJourProfil(creerProfilTechnicien());
      reinitialiserContrats(creerContratsTechnicien());
      setNomProfil("Technicien — Annexe 8");
    }
    setModeTest(true);
  };

  const reinitialiser = () => {
    reinitialiserProfil();
    reinitialiserContrats([]);
    setModeTest(false);
    setNomProfil(null);
  };

  return (
    <DonneesTestContext.Provider value={{ modeTest, nomProfil, chargerDonneesTest, reinitialiser }}>
      {children}
    </DonneesTestContext.Provider>
  );
}

export function useDonneesTest() {
  const context = useContext(DonneesTestContext);
  if (!context) {
    throw new Error("useDonneesTest doit être utilisé dans un DonneesTestProvider");
  }
  return context;
}
