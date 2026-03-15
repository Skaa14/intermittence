import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { Contrat } from "../types/contrat";

interface ContratsContextType {
  contrats: Contrat[];
  ajouterContrat: (contrat: Omit<Contrat, "id">) => void;
  modifierContrat: (id: string, contrat: Omit<Contrat, "id">) => void;
  supprimerContrat: (id: string) => void;
}

const ContratsContext = createContext<ContratsContextType | null>(null);

function parseDateFR(date: string): number {
  const parts = date.split("/");
  if (parts.length !== 3) return 0;
  const [jour, mois, annee] = parts;
  const timestamp = new Date(`${annee}-${mois}-${jour}`).getTime();
  return isNaN(timestamp) ? 0 : timestamp;
}

function trierParDate(contrats: Contrat[]): Contrat[] {
  return [...contrats].sort(
    (a, b) => parseDateFR(a.dateDebut) - parseDateFR(b.dateDebut)
  );
}

export function ContratsProvider({ children }: { children: ReactNode }) {
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const nextId = useRef(1);

  const ajouterContrat = (contratSansId: Omit<Contrat, "id">) => {
    const nouveau: Contrat = {
      ...contratSansId,
      id: String(nextId.current++),
    };
    setContrats((prev) => trierParDate([...prev, nouveau]));
  };

  const modifierContrat = (id: string, contratSansId: Omit<Contrat, "id">) => {
    setContrats((prev) =>
      trierParDate(
        prev.map((c) => (c.id === id ? { ...contratSansId, id } : c))
      )
    );
  };

  const supprimerContrat = (id: string) => {
    setContrats((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ContratsContext.Provider
      value={{ contrats, ajouterContrat, modifierContrat, supprimerContrat }}
    >
      {children}
    </ContratsContext.Provider>
  );
}

export function useContrats() {
  const context = useContext(ContratsContext);
  if (!context) {
    throw new Error("useContrats doit être utilisé dans un ContratsProvider");
  }
  return context;
}
