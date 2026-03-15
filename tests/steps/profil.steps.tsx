import { defineFeature, loadFeature } from "jest-cucumber";
import {
  renderHook,
  act,
  RenderHookResult,
} from "@testing-library/react-native";
import { ProfilProvider, useProfil } from "../../contexts/ProfilContext";

type ProfilHook = RenderHookResult<ReturnType<typeof useProfil>, unknown>;

const feature = loadFeature("tests/features/profil.feature");

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProfilProvider>{children}</ProfilProvider>
);

const configurerProfil = (
  hook: ProfilHook,
  annexe: string,
  heures: string,
  salaire: string,
  dateAnniversaire = "15/09/2026"
) => {
  act(() => {
    hook.result.current.mettreAJourProfil({
      annexe: annexe as "8" | "10",
      dateAnniversaire,
      heuresTravaillees: Number(heures),
      salaireReference: Number(salaire),
    });
  });
};

defineFeature(feature, (test) => {
  test("Pas de profil au démarrage", ({ given, then }) => {
    let hook: ProfilHook;

    given("le contexte du profil est initialisé", () => {
      hook = renderHook(() => useProfil(), { wrapper });
    });

    then("le profil est vide", () => {
      expect(hook.result.current.profil).toBeNull();
    });
  });

  test("Mise à jour du profil", ({ given, when, then, and }) => {
    let hook: ProfilHook;

    given("le contexte du profil est initialisé", () => {
      hook = renderHook(() => useProfil(), { wrapper });
    });

    when(
      /^je configure mon profil en annexe "(.*)" avec (\d+) heures et (\d+) euros$/,
      (annexe: string, heures: string, salaire: string) => {
        configurerProfil(hook, annexe, heures, salaire);
      }
    );

    then("le profil existe", () => {
      expect(hook.result.current.profil).not.toBeNull();
    });

    and(/^l'annexe du profil est "(.*)"$/, (annexe: string) => {
      expect(hook.result.current.profil!.annexe).toBe(annexe);
    });

    and(/^les heures du profil sont (\d+)$/, (heures: string) => {
      expect(hook.result.current.profil!.heuresTravaillees).toBe(
        Number(heures)
      );
    });

    and(
      /^le salaire de référence du profil est (\d+)$/,
      (salaire: string) => {
        expect(hook.result.current.profil!.salaireReference).toBe(
          Number(salaire)
        );
      }
    );
  });

  test("Modification du profil existant", ({ given, when, then, and }) => {
    let hook: ProfilHook;

    given("le contexte du profil est initialisé", () => {
      hook = renderHook(() => useProfil(), { wrapper });
    });

    and(
      /^je configure mon profil en annexe "(.*)" avec (\d+) heures et (\d+) euros$/,
      (annexe: string, heures: string, salaire: string) => {
        configurerProfil(hook, annexe, heures, salaire);
      }
    );

    when(
      /^je configure mon profil en annexe "(.*)" avec (\d+) heures et (\d+) euros$/,
      (annexe: string, heures: string, salaire: string) => {
        configurerProfil(hook, annexe, heures, salaire, "01/10/2026");
      }
    );

    then(/^l'annexe du profil est "(.*)"$/, (annexe: string) => {
      expect(hook.result.current.profil!.annexe).toBe(annexe);
    });

    and(/^les heures du profil sont (\d+)$/, (heures: string) => {
      expect(hook.result.current.profil!.heuresTravaillees).toBe(
        Number(heures)
      );
    });

    and(
      /^le salaire de référence du profil est (\d+)$/,
      (salaire: string) => {
        expect(hook.result.current.profil!.salaireReference).toBe(
          Number(salaire)
        );
      }
    );
  });

  test("Suppression du profil", ({ given, when, then, and }) => {
    let hook: ProfilHook;

    given("le contexte du profil est initialisé", () => {
      hook = renderHook(() => useProfil(), { wrapper });
    });

    and(
      /^je configure mon profil en annexe "(.*)" avec (\d+) heures et (\d+) euros$/,
      (annexe: string, heures: string, salaire: string) => {
        configurerProfil(hook, annexe, heures, salaire);
      }
    );

    when("je supprime le profil", () => {
      act(() => {
        hook.result.current.supprimerProfil();
      });
    });

    then("le profil est vide", () => {
      expect(hook.result.current.profil).toBeNull();
    });
  });

  test("Erreur hors du Provider", ({ then }) => {
    then("useProfil lance une erreur si utilisé hors du Provider", () => {
      expect(() => {
        renderHook(() => useProfil());
      }).toThrow("useProfil doit être utilisé dans un ProfilProvider");
    });
  });
});
