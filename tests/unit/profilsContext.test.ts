import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createElement, ReactNode } from "react";
import { ProfilsProvider, useProfils } from "../../contexts/ProfilsContext";
import { ProfilIntermittent } from "../../types/profil";
import { cleProfilData } from "../../utils/storage";

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(ProfilsProvider, null, children);

function renderProfils() {
  return renderHook(() => useProfils(), { wrapper });
}

const profilSanId = {
  nom: "Artiste",
  annexe: "10" as const,
  dateAnniversaire: "15/09/2026",
  salaireReference: 16200,
  heuresTravaillees: 545,
  tauxCSG: "standard" as const,
  alsaceMoselle: false,
};

describe("ProfilsContext", () => {
  it("démarre vide et chargé", async () => {
    const { result } = renderProfils();
    await waitFor(() => expect(result.current.chargementTermine).toBe(true));
    expect(result.current.profils).toEqual([]);
    expect(result.current.profilActif).toBeNull();
  });

  it("ajoute un profil et le rend actif", async () => {
    const { result } = renderProfils();
    await waitFor(() => expect(result.current.chargementTermine).toBe(true));

    act(() => result.current.ajouterProfil(profilSanId));

    expect(result.current.profils).toHaveLength(1);
    expect(result.current.profils[0].nom).toBe("Artiste");
    expect(result.current.profils[0].id).toBeDefined();
    expect(result.current.profilActif?.nom).toBe("Artiste");
  });

  it("modifie un profil existant", async () => {
    const { result } = renderProfils();
    await waitFor(() => expect(result.current.chargementTermine).toBe(true));

    act(() => result.current.ajouterProfil(profilSanId));
    const id = result.current.profils[0].id;

    act(() => result.current.modifierProfil(id, { ...profilSanId, nom: "Technicien", annexe: "8" }));

    expect(result.current.profils[0].nom).toBe("Technicien");
    expect(result.current.profils[0].annexe).toBe("8");
    expect(result.current.profils[0].id).toBe(id);
  });

  it("supprime un profil et ses données scopées", async () => {
    const { result } = renderProfils();
    await waitFor(() => expect(result.current.chargementTermine).toBe(true));

    act(() => result.current.ajouterProfil(profilSanId));
    const id = result.current.profils[0].id;

    await AsyncStorage.setItem(cleProfilData(id, "contrats"), JSON.stringify([]));
    await AsyncStorage.setItem(cleProfilData(id, "formations"), JSON.stringify([]));

    act(() => result.current.supprimerProfil(id));

    expect(result.current.profils).toHaveLength(0);
    const contrats = await AsyncStorage.getItem(cleProfilData(id, "contrats"));
    expect(contrats).toBeNull();
  });

  it("switch le profil actif vers un autre après suppression", async () => {
    const { result } = renderProfils();
    await waitFor(() => expect(result.current.chargementTermine).toBe(true));

    act(() => result.current.ajouterProfil(profilSanId));
    act(() => result.current.ajouterProfil({ ...profilSanId, nom: "Technicien" }));

    const idPremier = result.current.profils[0].id;
    const idSecond = result.current.profils[1].id;

    expect(result.current.profilActifId).toBe(idSecond);

    act(() => result.current.changerProfilActif(idPremier));
    expect(result.current.profilActifId).toBe(idPremier);

    act(() => result.current.supprimerProfil(idPremier));

    await waitFor(() => {
      expect(result.current.profils).toHaveLength(1);
      expect(result.current.profilActif?.nom).toBe("Technicien");
    });
  });

  it("duplique un profil avec ses données scopées", async () => {
    const { result } = renderProfils();
    await waitFor(() => expect(result.current.chargementTermine).toBe(true));

    act(() => result.current.ajouterProfil(profilSanId));
    const idSource = result.current.profils[0].id;

    const contratsSource = [{ id: "c1", employeur: "Test" }];
    await AsyncStorage.setItem(
      cleProfilData(idSource, "contrats"),
      JSON.stringify(contratsSource)
    );

    await act(() => result.current.dupliquerProfil(idSource, "Copie Artiste"));

    expect(result.current.profils).toHaveLength(2);
    const copie = result.current.profils[1];
    expect(copie.nom).toBe("Copie Artiste");
    expect(copie.id).not.toBe(idSource);
    expect(copie.annexe).toBe("10");

    const contratsCopie = await AsyncStorage.getItem(cleProfilData(copie.id, "contrats"));
    expect(JSON.parse(contratsCopie!)).toEqual(contratsSource);
  });

  it("change le profil actif", async () => {
    const { result } = renderProfils();
    await waitFor(() => expect(result.current.chargementTermine).toBe(true));

    act(() => result.current.ajouterProfil(profilSanId));
    act(() => result.current.ajouterProfil({ ...profilSanId, nom: "Technicien" }));

    const idPremier = result.current.profils[0].id;

    act(() => result.current.changerProfilActif(idPremier));

    expect(result.current.profilActifId).toBe(idPremier);
    expect(result.current.profilActif?.nom).toBe("Artiste");
  });

  it("persiste et restaure depuis le storage", async () => {
    const { result, unmount } = renderProfils();
    await waitFor(() => expect(result.current.chargementTermine).toBe(true));

    act(() => result.current.ajouterProfil(profilSanId));
    const id = result.current.profils[0].id;

    unmount();

    const { result: result2 } = renderProfils();
    await waitFor(() => expect(result2.current.chargementTermine).toBe(true));

    expect(result2.current.profils).toHaveLength(1);
    expect(result2.current.profils[0].id).toBe(id);
    expect(result2.current.profilActifId).toBe(id);
  });
});
