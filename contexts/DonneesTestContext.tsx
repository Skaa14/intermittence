import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useContrats } from "./ContratsContext";
import { useProfils } from "./ProfilsContext";
import { useFormations } from "./FormationsContext";
import { useEnseignements } from "./EnseignementsContext";
import { charger, sauvegarder, supprimer, sauvegarderParCle, cleProfilData } from "../utils/storage";
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
  const { profilActif, modifierProfil, ajouterProfil, supprimerProfil } = useProfils();
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
    const donneesProfil = type === "artiste" ? creerProfilArtiste() : creerProfilTechnicien();
    const { id: _, ...sanId } = donneesProfil;

    let profilId: string;
    if (profilActif) {
      profilId = profilActif.id;
      modifierProfil(profilId, sanId);
    } else {
      profilId = ajouterProfil(sanId);
    }

    const contrats = type === "artiste" ? creerContratsArtiste() : creerContratsTechnicien();
    const formations = type === "artiste" ? creerFormationsArtiste() : creerFormationsTechnicien();
    const enseignements = type === "artiste" ? creerEnseignementsArtiste() : creerEnseignementsTechnicien();

    sauvegarderParCle(cleProfilData(profilId, "contrats"), contrats.map((c, i) => ({ ...c, id: String(i + 1) })));
    sauvegarderParCle(cleProfilData(profilId, "formations"), formations.map((f, i) => ({ ...f, id: String(i + 1) })));
    sauvegarderParCle(cleProfilData(profilId, "enseignements"), enseignements.map((e, i) => ({ ...e, id: String(i + 1) })));

    reinitialiserContrats(contrats);
    reinitialiserFormations(formations);
    reinitialiserEnseignements(enseignements);

    setNomProfil(type === "artiste" ? "Artiste — Annexe 10" : "Technicien — Annexe 8");
    sauvegarder("nomProfil", type === "artiste" ? "Artiste — Annexe 10" : "Technicien — Annexe 8");
    setModeTest(true);
    sauvegarder("modeTest", true);
  };

  const reinitialiser = () => {
    if (profilActif) supprimerProfil(profilActif.id);
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
