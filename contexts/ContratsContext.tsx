import { createContext, useContext, useState, ReactNode } from "react";
import { Contrat } from "../types/contrat";

interface ContratsContextType {
  contrats: Contrat[];
  ajouterContrat: (contrat: Omit<Contrat, "id">) => void;
  supprimerContrat: (id: string) => void;
}

const ContratsContext = createContext<ContratsContextType | null>(null);

export function ContratsProvider({ children }: { children: ReactNode }) {
  const [contrats, setContrats] = useState<Contrat[]>([]);

  const ajouterContrat = (contratSansId: Omit<Contrat, "id">) => {
    const nouveau: Contrat = {
      ...contratSansId,
      id: Date.now().toString(),
    };
    setContrats((prev) => [...prev, nouveau]);
  };

  const supprimerContrat = (id: string) => {
    setContrats((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ContratsContext.Provider
      value={{ contrats, ajouterContrat, supprimerContrat }}
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
