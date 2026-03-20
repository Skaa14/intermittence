import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo, ReactNode } from "react";
import { ProfilIntermittent, ProfilSansId } from "../types/profil";
import {
  charger,
  sauvegarder,
  supprimer,
  cleProfilData,
  chargerParCle,
  sauvegarderParCle,
  supprimerParCle,
  TypeDonneeProfil,
} from "../utils/storage";

interface ProfilsContextType {
  profils: ProfilIntermittent[];
  profilActifId: string | null;
  profilActif: ProfilIntermittent | null;
  chargementTermine: boolean;
  ajouterProfil: (profil: ProfilSansId) => string;
  modifierProfil: (id: string, donnees: ProfilSansId) => void;
  supprimerProfil: (id: string) => void;
  dupliquerProfil: (id: string, nouveauNom: string) => void;
  changerProfilActif: (id: string) => void;
}

const ProfilsContext = createContext<ProfilsContextType | null>(null);

const TYPES_DONNEES: TypeDonneeProfil[] = ["contrats", "formations", "enseignements"];

export function ProfilsProvider({ children }: { children: ReactNode }) {
  const [profils, setProfils] = useState<ProfilIntermittent[]>([]);
  const [profilActifId, setProfilActifId] = useState<string | null>(null);
  const [chargementTermine, setChargementTermine] = useState(false);
  const profilsRef = useRef(profils);
  profilsRef.current = profils;

  useEffect(() => {
    Promise.all([
      charger<ProfilIntermittent[]>("profils"),
      charger<string>("profilActifId"),
    ])
      .then(([profilsCharges, idActif]) => {
        if (profilsCharges) {
          let aMigre = false;
          const migres = profilsCharges.map((p) => {
            if (p.aOuvertDroits === undefined) {
              aMigre = true;
              return { ...p, aOuvertDroits: true } as ProfilIntermittent;
            }
            return p;
          });
          setProfils(migres);
          if (aMigre) sauvegarder("profils", migres);
        }
        if (idActif) setProfilActifId(idActif);
      })
      .finally(() => setChargementTermine(true));
  }, []);

  const persisterProfilActifId = useCallback((id: string | null) => {
    setProfilActifId(id);
    if (id) {
      sauvegarder("profilActifId", id);
    } else {
      supprimer("profilActifId");
    }
  }, []);

  const ajouterProfil = useCallback((donnees: ProfilSansId): string => {
    const id = crypto.randomUUID();
    const nouveau: ProfilIntermittent = { id, ...donnees };
    setProfils((prev) => {
      const mis = [...prev, nouveau];
      sauvegarder("profils", mis);
      return mis;
    });
    persisterProfilActifId(id);
    return id;
  }, [persisterProfilActifId]);

  const modifierProfil = useCallback((id: string, donnees: ProfilSansId) => {
    setProfils((prev) => {
      const mis = prev.map((p) => (p.id === id ? { id, ...donnees } : p));
      sauvegarder("profils", mis);
      return mis;
    });
  }, []);

  const supprimerProfil = useCallback((id: string) => {
    Promise.all(TYPES_DONNEES.map((type) => supprimerParCle(cleProfilData(id, type))));

    setProfils((prev) => {
      const mis = prev.filter((p) => p.id !== id);
      sauvegarder("profils", mis);
      return mis;
    });

    setProfilActifId((prevId) => {
      if (prevId !== id) return prevId;
      const autre = profilsRef.current.find((p) => p.id !== id);
      const nouvelId = autre?.id ?? null;
      if (nouvelId) {
        sauvegarder("profilActifId", nouvelId);
      } else {
        supprimer("profilActifId");
      }
      return nouvelId;
    });
  }, []);

  const dupliquerProfil = useCallback(async (id: string, nouveauNom: string) => {
    const source = profilsRef.current.find((p) => p.id === id);
    if (!source) return;

    const nouvelId = crypto.randomUUID();
    const copie: ProfilIntermittent = { ...source, id: nouvelId, nom: nouveauNom };

    setProfils((prev) => {
      const mis = [...prev, copie];
      sauvegarder("profils", mis);
      return mis;
    });

    await Promise.all(
      TYPES_DONNEES.map(async (type) => {
        const donnees = await chargerParCle(cleProfilData(id, type));
        if (donnees) {
          await sauvegarderParCle(cleProfilData(nouvelId, type), donnees);
        }
      })
    );
  }, []);

  const changerProfilActif = useCallback((id: string) => {
    persisterProfilActifId(id);
  }, [persisterProfilActifId]);

  const profilActif = useMemo(
    () => profils.find((p) => p.id === profilActifId) ?? null,
    [profils, profilActifId]
  );

  const valeur = useMemo<ProfilsContextType>(
    () => ({
      profils,
      profilActifId,
      profilActif,
      chargementTermine,
      ajouterProfil,
      modifierProfil,
      supprimerProfil,
      dupliquerProfil,
      changerProfilActif,
    }),
    [profils, profilActifId, profilActif, chargementTermine, ajouterProfil, modifierProfil, supprimerProfil, dupliquerProfil, changerProfilActif]
  );

  return (
    <ProfilsContext.Provider value={valeur}>
      {children}
    </ProfilsContext.Provider>
  );
}

export function useProfils() {
  const context = useContext(ProfilsContext);
  if (!context) {
    throw new Error("useProfils doit être utilisé dans un ProfilsProvider");
  }
  return context;
}
