Feature: Tri des contrats par date croissante

  Background:
    Given nous sommes le "01/01/2026"

  Scenario: Les contrats sont affichés du plus ancien au plus récent
    Given ces contrats existent
      | Employeur     | Début      | Fin        | Heures | Salaire |
      | Studio Mars   | 15/03/2026 | 31/03/2026 | 40     | 1500    |
      | Théâtre Jan   | 10/01/2026 | 31/01/2026 | 40     | 1500    |
      | Cinéma Fév    | 20/02/2026 | 28/02/2026 | 40     | 1500    |
    Then les contrats sont affichés dans l'ordre "Théâtre Jan", "Cinéma Fév", "Studio Mars"

  Scenario: Le tri est maintenu après modification de date
    Given ces contrats existent
      | Employeur   | Début      | Fin        | Heures | Salaire |
      | Contrat A   | 01/01/2026 | 31/01/2026 | 40     | 1500    |
      | Contrat B   | 01/03/2026 | 31/03/2026 | 40     | 1500    |
    When je modifie les dates de "Contrat A" en début "01/06/2026" et fin "30/06/2026"
    Then les contrats sont affichés dans l'ordre "Contrat B", "Contrat A"
