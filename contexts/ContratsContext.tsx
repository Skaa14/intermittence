import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { Contrat } from "../types/contrat";
import { charger, sauvegarder } from "../utils/storage";

interface ContratsContextType {
  contrats: Contrat[];
  chargementTermine: boolean;
  ajouterContrat: (contrat: Omit<Contrat, "id">) => void;
  modifierContrat: (id: string, contrat: Omit<Contrat, "id">) => void;
  supprimerContrat: (id: string) => void;
  reinitialiserContrats: (contrats: Omit<Contrat, "id">[]) => void;
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

function maxId(contrats: Contrat[]): number {
  if (contrats.length === 0) return 0;
  return Math.max(...contrats.map((c) => Number(c.id) || 0));
}

export function ContratsProvider({ children }: { children: ReactNode }) {
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const [chargementTermine, setChargementTermine] = useState(false);
  const nextId = useRef(1);

  useEffect(() => {
    charger<Contrat[]>("contrats").then((donnees) => {
      if (donnees && donnees.length > 0) {
        setContrats(trierParDate(donnees));
        nextId.current = maxId(donnees) + 1;
      }
      setChargementTermine(true);
    }).catch(() => setChargementTermine(true));
  }, []);

  const persister = (nouveauxContrats: Contrat[]) => {
    sauvegarder("contrats", nouveauxContrats);
  };

  const ajouterContrat = (contratSansId: Omit<Contrat, "id">) => {
    const nouveau: Contrat = {
      ...contratSansId,
      id: String(nextId.current++),
    };
    setContrats((prev) => {
      const maj = trierParDate([...prev, nouveau]);
      persister(maj);
      return maj;
    });
  };

  const modifierContrat = (id: string, contratSansId: Omit<Contrat, "id">) => {
    setContrats((prev) => {
      const maj = trierParDate(
        prev.map((c) => (c.id === id ? { ...contratSansId, id } : c))
      );
      persister(maj);
      return maj;
    });
  };

  const supprimerContrat = (id: string) => {
    setContrats((prev) => {
      const maj = prev.filter((c) => c.id !== id);
      persister(maj);
      return maj;
    });
  };

  const reinitialiserContrats = (nouveauxContrats: Omit<Contrat, "id">[]) => {
    nextId.current = 1;
    const avecIds = nouveauxContrats.map((c) => ({ ...c, id: String(nextId.current++) }));
    const maj = trierParDate(avecIds);
    setContrats(maj);
    persister(maj);
  };

  return (
    <ContratsContext.Provider
      value={{ contrats, chargementTermine, ajouterContrat, modifierContrat, supprimerContrat, reinitialiserContrats }}
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
