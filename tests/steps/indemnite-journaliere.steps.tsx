import { defineFeature, loadFeature } from "jest-cucumber";
import { calculerAJ } from "../../utils/calculerAJ";
import { Annexe } from "../../types/profil";

const feature = loadFeature("tests/features/indemnite-journaliere.feature");

defineFeature(feature, (test) => {
  let annexe: Annexe;
  let heures: number;
  let salaire: number;
  let resultat: number;

  const givenProfil = (given: Function) => {
    given(
      /^un profil annexe "(.*)" avec (\d+) heures et (\d+) euros de salaire$/,
      (a: string, h: string, s: string) => {
        annexe = a as Annexe;
        heures = Number(h);
        salaire = Number(s);
      }
    );
  };

  const whenCalcul = (when: Function) => {
    when("je calcule l'indemnité journalière", () => {
      resultat = calculerAJ(annexe, salaire, heures);
    });
  };

  const thenAJ = (then: Function) => {
    then(/^l'AJ brute est ([\d.]+) euros$/, (montant: string) => {
      expect(resultat).toBeCloseTo(Number(montant), 2);
    });
  };

  test("Calcul AJ annexe 8 cas standard", ({ given, when, then }) => {
    givenProfil(given);
    whenCalcul(when);
    thenAJ(then);
  });

  test("Calcul AJ annexe 10 cas standard", ({ given, when, then }) => {
    givenProfil(given);
    whenCalcul(when);
    thenAJ(then);
  });

  test("Plancher annexe 8", ({ given, when, then }) => {
    givenProfil(given);
    whenCalcul(when);
    thenAJ(then);
  });

  test("Plancher annexe 10", ({ given, when, then }) => {
    givenProfil(given);
    whenCalcul(when);
    thenAJ(then);
  });

  test("AJ avec heures au-dessus du seuil NHT annexe 8", ({
    given,
    when,
    then,
  }) => {
    givenProfil(given);
    whenCalcul(when);
    thenAJ(then);
  });
});
