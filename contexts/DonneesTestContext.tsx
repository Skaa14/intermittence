import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useContrats } from "./ContratsContext";
import { useProfil } from "./ProfilContext";
import { useFormations } from "./FormationsContext";
import { useEnseignements } from "./EnseignementsContext";
import { charger, sauvegarder, supprimer } from "../utils/storage";
import {
  creerProfilArtiste,
  creerProfilTechnicien,
  creerContratsArtiste,
  creerContratsTechnicien,
  creerFormationsArtiste,
  creerFormationsTechnicien,
  creerEnseignementsArtiste,
  creerEnseignementsTechnicien,
} from "../utils/donneesTest";

interface DonneesTestContextType {
  modeTest: boolean;
  nomProfil: string | null;
  chargementTermine: boolean;
  chargerDonneesTest: (type: "artiste" | "technicien") => void;
  reinitialiser: () => void;
}

const DonneesTestContext = createContext<DonneesTestContextType | null>(null);

export function DonneesTestProvider({ children }: { children: ReactNode }) {
  const { reinitialiserContrats } = useContrats();
  const { mettreAJourProfil, reinitialiserProfil } = useProfil();
  const { reinitialiserFormations } = useFormations();
  const { reinitialiserEnseignements } = useEnseignements();
  const [modeTest, setModeTest] = useState(false);
  const [nomProfil, setNomProfil] = useState<string | null>(null);
  const [chargementTermine, setChargementTermine] = useState(false);

  useEffect(() => {
    Promise.all([
      charger<boolean>("modeTest"),
      charger<string>("nomProfil"),
    ]).then(([savedModeTest, savedNomProfil]) => {
      if (savedModeTest) setModeTest(true);
      if (savedNomProfil) setNomProfil(savedNomProfil);
      setChargementTermine(true);
    }).catch(() => setChargementTermine(true));
  }, []);

  const chargerDonneesTest = (type: "artiste" | "technicien") => {
    if (type === "artiste") {
      mettreAJourProfil(creerProfilArtiste());
      reinitialiserContrats(creerContratsArtiste());
      reinitialiserFormations(creerFormationsArtiste());
      reinitialiserEnseignements(creerEnseignementsArtiste());
      setNomProfil("Artiste — Annexe 10");
      sauvegarder("nomProfil", "Artiste — Annexe 10");
    } else {
      mettreAJourProfil(creerProfilTechnicien());
      reinitialiserContrats(creerContratsTechnicien());
      reinitialiserFormations(creerFormationsTechnicien());
      reinitialiserEnseignements(creerEnseignementsTechnicien());
      setNomProfil("Technicien — Annexe 8");
      sauvegarder("nomProfil", "Technicien — Annexe 8");
    }
    setModeTest(true);
    sauvegarder("modeTest", true);
  };

  const reinitialiser = () => {
    reinitialiserProfil();
    reinitialiserContrats([]);
    reinitialiserFormations([]);
    reinitialiserEnseignements([]);
    setModeTest(false);
    setNomProfil(null);
    supprimer("modeTest");
    supprimer("nomProfil");
  };

  return (
    <DonneesTestContext.Provider value={{ modeTest, nomProfil, chargementTermine, chargerDonneesTest, reinitialiser }}>
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
