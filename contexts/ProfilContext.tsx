import { createContext, useContext, useState, ReactNode } from "react";
import { ProfilIntermittent } from "../types/profil";

interface ProfilContextType {
  profil: ProfilIntermittent | null;
  mettreAJourProfil: (profil: ProfilIntermittent) => void;
}

const ProfilContext = createContext<ProfilContextType | null>(null);

export function ProfilProvider({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<ProfilIntermittent | null>(null);

  const mettreAJourProfil = (nouveauProfil: ProfilIntermittent) => {
    setProfil(nouveauProfil);
  };

  return (
    <ProfilContext.Provider
      value={{ profil, mettreAJourProfil }}
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
