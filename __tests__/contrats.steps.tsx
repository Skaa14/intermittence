import { defineFeature, loadFeature } from "jest-cucumber";
import {
  renderHook,
  act,
  RenderHookResult,
} from "@testing-library/react-native";
import { ContratsProvider, useContrats } from "../contexts/ContratsContext";

type ContratsHook = RenderHookResult<ReturnType<typeof useContrats>, unknown>;

const feature = loadFeature("features/contrats.feature");

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ContratsProvider>{children}</ContratsProvider>
);

defineFeature(feature, (test) => {
  test("Liste de contrats vide au démarrage", ({ given, then }) => {
    let hook: ContratsHook;

    given("le contexte des contrats est initialisé", () => {
      hook = renderHook(() => useContrats(), { wrapper });
    });

    then("la liste des contrats est vide", () => {
      expect(hook.result.current.contrats).toEqual([]);
    });
  });

  test("Ajout d'un contrat", ({ given, when, then, and }) => {
    let hook: ContratsHook;

    given("le contexte des contrats est initialisé", () => {
      hook = renderHook(() => useContrats(), { wrapper });
    });

    when(
      /^j'ajoute un contrat pour "(.*)" de (\d+) euros brut$/,
      (employeur: string, salaire: string) => {
        act(() => {
          hook.result.current.ajouterContrat({
            employeur,
            dateDebut: "01/03/2026",
            dateFin: "15/03/2026",
            heures: 80,
            salaireBrut: Number(salaire),
          });
        });
      }
    );

    then(/^la liste contient (\d+) contrat$/, (count: string) => {
      expect(hook.result.current.contrats).toHaveLength(Number(count));
    });

    and(/^l'employeur du dernier contrat est "(.*)"$/, (employeur: string) => {
      const contrats = hook.result.current.contrats;
      expect(contrats[contrats.length - 1].employeur).toBe(employeur);
    });

    and(
      /^le salaire brut du dernier contrat est (\d+)$/,
      (salaire: string) => {
        const contrats = hook.result.current.contrats;
        expect(contrats[contrats.length - 1].salaireBrut).toBe(Number(salaire));
      }
    );
  });

  test("Suppression d'un contrat", ({ given, when, then, and }) => {
    let hook: ContratsHook;

    given("le contexte des contrats est initialisé", () => {
      hook = renderHook(() => useContrats(), { wrapper });
    });

    and(
      /^j'ajoute un contrat pour "(.*)" de (\d+) euros brut$/,
      (employeur: string, salaire: string) => {
        act(() => {
          hook.result.current.ajouterContrat({
            employeur,
            dateDebut: "01/01/2026",
            dateFin: "31/01/2026",
            heures: 120,
            salaireBrut: Number(salaire),
          });
        });
      }
    );

    when("je supprime le dernier contrat", () => {
      const contrats = hook.result.current.contrats;
      const id = contrats[contrats.length - 1].id;
      act(() => {
        hook.result.current.supprimerContrat(id);
      });
    });

    then("la liste des contrats est vide", () => {
      expect(hook.result.current.contrats).toHaveLength(0);
    });
  });

  test("Erreur hors du Provider", ({ then }) => {
    then("useContrats lance une erreur si utilisé hors du Provider", () => {
      expect(() => {
        renderHook(() => useContrats());
      }).toThrow("useContrats doit être utilisé dans un ContratsProvider");
    });
  });
});
