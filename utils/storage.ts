import AsyncStorage from "@react-native-async-storage/async-storage";

const CLES = {
  contrats: "intermittence:contrats",
  profil: "intermittence:profil",
  modeTest: "intermittence:modeTest",
  nomProfil: "intermittence:nomProfil",
} as const;

export type CleStorage = keyof typeof CLES;

export async function charger<T>(cle: CleStorage): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(CLES[cle]);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export async function sauvegarder<T>(cle: CleStorage, valeur: T): Promise<void> {
  try {
    await AsyncStorage.setItem(CLES[cle], JSON.stringify(valeur));
  } catch {
  }
}

export async function supprimer(cle: CleStorage): Promise<void> {
  try {
    await AsyncStorage.removeItem(CLES[cle]);
  } catch {
  }
}
