import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo, ReactNode } from "react";
import { Alert, Platform } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { ProfilIntermittent, ProfilSansId } from "../types/profil";
import * as Crypto from "expo-crypto";
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
  exporterProfil: (id: string) => Promise<void>;
  importerProfil: () => Promise<void>;
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
    const id = Crypto.randomUUID();
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

    const nouvelId = Crypto.randomUUID();
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

  const exporterProfil = useCallback(async (id: string) => {
    const source = profilsRef.current.find((p) => p.id === id);
    if (!source) return;

    try {
      // 1. Rassembler toutes les données du profil
      const exportData = {
        version: "1.0",
        profil: source,
        contrats: await chargerParCle(cleProfilData(id, "contrats")) || [],
        formations: await chargerParCle(cleProfilData(id, "formations")) || [],
        enseignements: await chargerParCle(cleProfilData(id, "enseignements")) || [],
      };

      // 2. Créer un fichier JSON temporaire
      const safeNom = source.nom.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `export_intermittence_${safeNom}.json`;

      // Gestion spécifique pour le Web (téléchargement direct)
      if (Platform.OS === 'web') {
        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }

      // Gestion Native (iOS / Android)
      const fileUri = (FileSystem.cacheDirectory ?? "") + fileName;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportData), {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // 3. Partager le fichier
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { 
          mimeType: 'application/json', 
          dialogTitle: `Exporter le profil ${source.nom}`,
          UTI: 'public.json' // Recommandé pour iOS
        });
      } else {
        Alert.alert("Erreur", "Le partage n'est pas disponible sur cet appareil.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible d'exporter le profil.");
    }
  }, []);

  const importerProfil = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.canceled) return;

      const asset = result.assets[0];
      let content: string;

      // Sur Web, FileSystem ne peut pas lire l'URI du DocumentPicker directement
      if (Platform.OS === 'web') {
        const response = await fetch(asset.uri);
        content = await response.text();
      } else {
        content = await FileSystem.readAsStringAsync(asset.uri);
      }

      const data = JSON.parse(content);

      // Validation basique
      if (!data.profil || !data.profil.nom) {
        throw new Error("Format de fichier invalide.");
      }

      // 1. Créer le nouveau profil (avec un nouvel ID pour éviter les conflits)
      const nouvelId = Crypto.randomUUID();
      const nouveauProfil: ProfilIntermittent = {
        ...data.profil,
        id: nouvelId,
        nom: `${data.profil.nom} (Importé)`,
      };

      // 2. Sauvegarder les données associées
      if (data.contrats) await sauvegarderParCle(cleProfilData(nouvelId, "contrats"), data.contrats);
      if (data.formations) await sauvegarderParCle(cleProfilData(nouvelId, "formations"), data.formations);
      if (data.enseignements) await sauvegarderParCle(cleProfilData(nouvelId, "enseignements"), data.enseignements);

      // 3. Ajouter à la liste des profils
      setProfils((prev) => {
        const mis = [...prev, nouveauProfil];
        sauvegarder("profils", mis);
        return mis;
      });

      Alert.alert("Succès", `Le profil "${data.profil.nom}" a été importé.`);
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible d'importer le fichier. Vérifiez qu'il s'agit bien d'un export valide.");
    }
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
      exporterProfil,
      importerProfil,
      changerProfilActif,
    }),
    [profils, profilActifId, profilActif, chargementTermine, ajouterProfil, modifierProfil, supprimerProfil, dupliquerProfil, exporterProfil, importerProfil, changerProfilActif]
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
