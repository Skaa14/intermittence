import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ProfilIntermittent } from "../types/profil";
import { charger, sauvegarder, supprimer } from "../utils/storage";

interface ProfilContextType {
  profil: ProfilIntermittent | null;
  chargementTermine: boolean;
  mettreAJourProfil: (profil: ProfilIntermittent) => void;
  reinitialiserProfil: () => void;
}

const ProfilContext = createContext<ProfilContextType | null>(null);

export function ProfilProvider({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<ProfilIntermittent | null>(null);
  const [chargementTermine, setChargementTermine] = useState(false);

  useEffect(() => {
    charger<ProfilIntermittent>("profil").then((donnees) => {
      if (donnees) setProfil(donnees);
      setChargementTermine(true);
    }).catch(() => setChargementTermine(true));
  }, []);

  const mettreAJourProfil = (nouveauProfil: ProfilIntermittent) => {
    setProfil(nouveauProfil);
    sauvegarder("profil", nouveauProfil);
  };

  const reinitialiserProfil = () => {
    setProfil(null);
    supprimer("profil");
  };

  return (
    <ProfilContext.Provider
      value={{ profil, chargementTermine, mettreAJourProfil, reinitialiserProfil }}
    >
      {children}
    </ProfilContext.Provider>
  );
}

export function useProfil() {
  const context = useContext(ProfilContext);
  if (!context) {
    throw new Error("useProfil doit être utilisé dans un ProfilProvider");
  }
  return context;
}
